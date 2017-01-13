# !/usr/bin/env python3
from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
import bson, time
from PIL import Image
from frameworks import Framework

current_milli_time = lambda: int(round(time.time() * 1000))


# dev-mode:
# import code # code.interact(local=locals())
# import pdb # pdb.set_trace()

class SimpleWebSocketServerBindToFramework(SimpleWebSocketServer):
    def _constructWebSocket(self, sock, adress):
        print("hi")
        return self.websocketclass(self, sock, adress)
    def serveforever(self):
        print("hi")


class BotIOChromeExtension(Framework.Framework, SimpleWebSocketServer):

    def __init__(self, host='', port=9999):
        SimpleWebSocketServer(
        self.host = host
        self.port = port
        #server = SimpleWebSocketServerBindToFramework(url, port, BotIOChromeExtensionSocket)

    def serveforever(self):
        print("hey")

# if score>100:
#     keys = [0.8, 0.2, 0.75]
# else:
#     keys = [0.8, 0.2, 0.25]

class BotIOChromeExtensionSocket(WebSocket):


    # === #
    # API #
    # === #
    awaits_img = False
    msg = {}
    numkeys = 0
    def control(self, keys):
        self.sendMessage(bson.dumps({"keys": keys}))

    # fps
    fps = 0
    fps_counter = 0
    fps_smooth = 0.9
    fps_last_timestamp = current_milli_time()
    def updateFPS(self):
        self.fps_current_timestamp = current_milli_time()
        if self.fps_current_timestamp - self.fps_last_timestamp > 1000:
            self.fps_last_timestamp = self.fps_current_timestamp
            self.fps = self.fps_counter
            self.fps_counter=0
        self.fps_counter+=1

    # image size
    width = 0
    height = 0


    # ======================= #
    # Connection to Framework #
    # ======================= #
    framework_wrapper = None
    def __init__(self, the_framework_wrapper):
        framework_wrapper = the_framework_wrapper


    # ==================== #
    # Server-Communication #
    # ==================== #

    def handleMessage(self):
        if not self.awaits_img:
            self.msg = bson.loads(self.data)

        # answers
        if self.msg["state"] == "game_start":
            print("game (re)started")
            self.width = self.msg["width"]
            self.height = self.msg["height"]
            self.height = self.msg["numkeys"]
            self.control([])
        elif self.msg["state"] == "game_running":

            # message consists of two parts (game_info + img)
            if not self.awaits_img:
                self.awaits_img = True
                return
            self.awaits_img = False

            # get data
            score = self.msg["score"]
            user_interaction = self.msg["user_interaction"]
            img = Image.frombuffer( "RGBA", (self.width, self.height), self.data, "raw", "RGBA", 0, 1)

            # learn ( using the image, the current score and last used keys )
            keys = framework_wrapper.react(img,interaction,score)

            # recalc fps
            self.updateFPS()
            print("FPS:",self.fps, " Score:",score)

            # use next keys
            # self.control(keys)
            self.sendMessage(bson.dumps({"keys": keys}))

        elif self.msg["state"] == "game_ended":

            # score = msg["score"]
            print("game ended")

    def handleConnected(self):
        print('Connection established to ', self.address)

    def handleClose(self):
        print('Connection closed.')

# server = SimpleWebSocketServer('', 9999, BotIOSocket)
# server.serveforever()
