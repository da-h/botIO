import tensorflow as tf

class NNArchitecture(object):

    def __init__(self, input_size, output_size, optimizer=tf.train.AdamOptimizer(0.001)):
        self.optimizer = optimizer
        self.input_size = input_size
        self.output_size = output_size

    def getInputPlaceholder(self, num=1):
        return tf.placeholder(tf.float32, shape=[num] + self.input_size)

    def getOutputPlaceholder(self, num=1):
        return tf.placeholder(tf.float32, shape=[num] + self.output_size)

    def createCalculation(self, input_data):
        raise Exception("Should be overwritten")

