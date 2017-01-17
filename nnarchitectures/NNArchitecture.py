
class NNArchitecture(object):

    def __init__(self, input_size, output_size, optimizer):
        self.optimizer = optimizer
        self.input_size = input_size
        self.output_size = output_size

    def getInputPlaceholder(self, num=1):
        raise Exception("Should be overwritten")

    def getOutputPlaceholder(self, num=1):
        raise Exception("Should be overwritten")

    def createCalculation(self, input_data):
        raise Exception("Should be overwritten")
