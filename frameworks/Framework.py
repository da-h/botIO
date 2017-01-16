
class Framework(object):

    def react(self, image, lastreaction, score):
        return [0.5, 0.7, 0.8]
        return self.learningscheme.predict(image, lastreaction, score)

    def __init__(self, learningscheme_tuple, save_after_cycles=None):
        self.learningscheme_tuple = learningscheme_tuple
        self.save_after_cycles = save_after_cycles
        self.game_running = False

    def game_initialized(self, image_dim, numkeys):
        self.game_running = True
        self.learningscheme = self.learningscheme_tuple[0](image_dim, numkeys, **learningscheme_tuple[1])

    def game_restarted(self):
        self.learningscheme.game_restarted()

    def run(framework, learningscheme_tuple, architecture_tuple, save_after_cycles=None):
        learningscheme_tuple[1]["architecture_tuple"] = architecture_tuple
        framework[1]["learningscheme_tuple"] = learningschem_tuplee
        framework[1]["save_after_cycles"] = save_after_cycles
        framework[0](**framework[1])
