# !/usr/bin/env python3
from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
import bson, time
from PIL import Image
from . import Framework
import sys
import numpy as np
import traceback

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



    # ======================= #
    # Connection to Framework #
    # ======================= #
    def __init__(self, server, sock, address):
        super(self.__class__,self).__init__(server, sock, address)
        self.lastscore = 0
        self.skip_img = -1
        self.skip_lastkeys = []
        self.awaits_img = 0
        self.msg = {}
        self.numkeys = 0

        # image size
        self.width = 0
        self.height = 0

    # ==================== #
    # Server-Communication #
    # ==================== #

    def handleMessage(self):
        try:

            raise ValueError("Blub")

            # first message ever
            if not self.msg:
                self.msg = bson.loads(self.data)

            # current status
            elif self.awaits_img == 0:
                self.awaits_img += 1
                self.msg = bson.loads(self.data)
                return

            # wating for images (message consists of two parts: game_info + multiple images)
            elif self.awaits_img <= self.numchannels:

                # get data
                img = Image.frombuffer( "RGBA", (self.width, self.height), self.data, "raw", "RGBA", 0, 1)

                # make grayscale
                img = np.asarray(img)
                img = np.dot(img[...,:3], [0.299, 0.587, 0.114])/255

                # insert into tensor with different channels
                self.images[self.awaits_img-1] = img

                # wait for more images?
                self.awaits_img += 1
                if self.awaits_img <= self.numchannels:
                    return

            self.awaits_img = 0

            # answers
            if not self.msg or self.msg["state"] == "game_start":
                print("game (re)started")
                self.msg = bson.loads(self.data)

                # TODO: not good, if error in python occurs
                # (wont re-init a new framework_wrapper)
                if not self.framework_wrapper.game_running:

                    # init game
                    self.width = self.msg["width"]
                    self.height = self.msg["height"]
                    self.numchannels = self.msg["numchannels"]
                    self.numkeys = self.msg["numkeys"]

                    # create image-tuple
                    self.images = [None]*self.numchannels

                    # let framework initialize learningscheme and architecture
                    self.framework_wrapper.game_initialized([self.width, self.height, self.numchannels], [self.numkeys])

                # ask for next image
                self.framework_wrapper.game_restarted()
                self.control([])
            elif self.msg["state"] == "game_running":



                # get data
                score = self.msg["score"]
                used_keys = self.msg["used_keys"]
                userinput = self.msg["userinput"]

                # skip image
                self.skip_img += 1
                if not userinput and self.framework_wrapper.skipframes > 1 and self.skip_img % self.framework_wrapper.skipframes != 0:
                    self.control(self.lastkeys)
                    return

                # learn ( using the image, the current score and last used keys )
                img = np.stack(self.images, 2)
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


        # connection closes due to exception
        except:
            print(traceback.format_exc())

            # no auto reconnect
            sys.exit(0)

    def handleConnected(self):
        print('Connection established to ', self.address)

    def handleClose(self):
        print('Connection closed.')
