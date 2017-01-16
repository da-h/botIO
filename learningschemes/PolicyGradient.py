from . import LearningScheme

class PolicyGradient(LearningScheme.LearningScheme):

    def __init__(self, window_inc=0, window_size=100):
        super().__init__()

    def predict(self, image, lastreaction, score):
        return [0.5, 0.7, 0.8]
