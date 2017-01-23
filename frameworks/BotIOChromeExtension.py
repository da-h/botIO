# !/usr/bin/env python3
from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
import bson, time
from PIL import Image
from . import Framework
import sys
import numpy as np

current_milli_time = lambda: int(round(time.time() * 1000))



class BotIOChromeExtension(Framework.Framework, SimpleWebSocketServer):

    def __init__(self, host='', port=9999, skipframes=0, **kwargs):
        self.host = host
        self.port = port
        self.skipframes = skipframes + 1
        SimpleWebSocketServer.__init__(self, host, port, BotIOChromeExtensionSocket, selectInterval=0.1)
        Framework.Framework.__init__(self, **kwargs)
        self.serveforever()

    def _constructWebSocket(self, sock, address):
        ws = self.websocketclass(self, sock, address)
        ws.framework_wrapper = self
        return ws

    def serveforever(self):
        print("Listening forever... <3 ")
        super(BotIOChromeExtension, self).serveforever()



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
    # TODO: make class, calc real and seen fps
    fps = 0
    fps_counter = 0
    fps_smooth = 0.9
    fps_last_timestamp = current_milli_time()
    num_frames = 0
    def updateFPS(self):
        self.fps_current_timestamp = current_milli_time()
        if self.fps_current_timestamp - self.fps_last_timestamp > 1000:
            self.fps_last_timestamp = self.fps_current_timestamp
            self.fps = self.fps_counter
            self.fps_counter=0
        self.fps_counter +=1
        self.num_frames +=1

    # image size
    width = 0
    height = 0


    # ======================= #
    # Connection to Framework #
    # ======================= #
    def __init__(self, server, sock, address):
        super(self.__class__,self).__init__(server, sock, address)
        self.lastscore = 0
        self.skip_img = -1
        self.skip_lastkeys = []


    # ==================== #
    # Server-Communication #
    # ==================== #

    def handleMessage(self):
        if not self.awaits_img:
            self.msg = bson.loads(self.data)

        # answers
        if self.msg["state"] == "game_start":
            print("game (re)started")

            # TODO: not good, if error in python occurs
            # (wont re-init a new framework_wrapper)
            if not self.framework_wrapper.game_running:

                # init game
                self.width = self.msg["width"]
                self.height = self.msg["height"]
                self.channels = self.msg["channels"]
                self.numkeys = self.msg["numkeys"]

                # let framework initialize learningscheme and architecture
                self.framework_wrapper.game_initialized([self.channels, self.width, self.height], [self.numkeys])

            # ask for next image
            self.framework_wrapper.game_restarted()
            self.control([])
        elif self.msg["state"] == "game_running":

            # message consists of two parts (game_info + img)
            # TODO: awaits multiple channels
            if not self.awaits_img:
                self.awaits_img = True
                return
            self.awaits_img = False

            # get data
            score = self.msg["score"]
            used_keys = self.msg["used_keys"]
            userinput = self.msg["userinput"]
            img = Image.frombuffer( "RGBA", (self.width, self.height), self.data, "raw", "RGBA", 0, 1)

            # make grayscale
            img = np.asarray(img)
            img = np.dot(img[...,:3], [0.299, 0.587, 0.114])/255

            # insert into tensor with different channels
            # TODO: pack into different channels
            img = [img]

            # skip image
            self.skip_img += 1
            if not userinput and self.framework_wrapper.skipframes > 1 and self.skip_img % self.framework_wrapper.skipframes != 0:
                self.control(self.lastkeys)
                return

            # learn ( using the image, the current score and last used keys )
            keys = self.framework_wrapper.react(used_keys, img, score, userinput)
            self.lastkeys = keys

            # recalc fps
            self.updateFPS()
            print("\rFPS:",self.fps, " Score_Gain:",score-self.lastscore, " Seen_Frames:",self.num_frames, " Predicted_keys:",keys, " user:", userinput, end="")
            self.lastscore = score

            # use next keys
            self.control(keys)

        elif self.msg["state"] == "game_ended":

            # score = msg["score"]
            print("game ended")

    def handleConnected(self):
        print('Connection established to ', self.address)

    def handleClose(self):
        print('Connection closed.')
