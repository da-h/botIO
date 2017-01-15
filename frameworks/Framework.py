
class Framework(object):

    def react(self, image, lastreaction, score):
        return self.learningscheme.predict(image, lastreaction, score)

    def run(self, learningscheme, architecture, save_after_cycles=None):
        self.learningscheme = learningscheme
        self.learningscheme.architecture = architecture
        self.save_after_cycles = save_after_cycles
