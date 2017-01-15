import tensorflow as tf
import numpy as np
from . import NNArchitecture

# https://github.com/aymericdamien/TensorFlow-Examples/blob/master/examples/3_NeuralNetworks/convolutional_network.py
class CNN(NNArchitecture.NNArchitecture):

    def __init__(self, layers=10, window_size=3, stride=0):
        super().__init__()

    def create(self, input_size, output_size):
        pass

    def train(self, input_data, output_data):
        pass

    def test(self, input_data):
        pass
