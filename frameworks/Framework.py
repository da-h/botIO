
class Framework(object):

    def react(self, image, lastreaction, score):
        return self.learningscheme.react(image, score)

    def __init__(self, learningscheme_tuple, save_after_cycles=None):
        self.learningscheme_tuple = learningscheme_tuple
        self.save_after_cycles = save_after_cycles
        self.game_running = False

    def game_initialized(self, image_dim, numkeys):
        self.game_running = True
        self.learningscheme_tuple[1]["image_dim"] = image_dim
        self.learningscheme_tuple[1]["numkeys"] = numkeys
        self.learningscheme = self.learningscheme_tuple[0](**self.learningscheme_tuple[1])

    def game_restarted(self):
        self.learningscheme.game_restarted()

    def run(framework, learningscheme_tuple, architecture_tuple, save_after_cycles=None):
        learningscheme_tuple[1]["architecture_tuple"] = architecture_tuple
        framework[1]["learningscheme_tuple"] = learningscheme_tuple
        framework[1]["save_after_cycles"] = save_after_cycles
        framework[0](**framework[1])
