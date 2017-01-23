import tensorflow as tf
import numpy as np
import math
from . import NNArchitecture


class CNN(NNArchitecture.NNArchitecture):

    def __init__(self, filters=20, **kwargs):
        super().__init__(**kwargs)

        if self.input_size[1] != 128 or self.input_size[2] != 128: # fixed 128x128 input size
            raise ValueError("wrong dimension given for this Network")

        self.filters = filters
        CNN = self.__class__

        self.weight_vars = {}
        self.bias_vars = {}

        self.channels = self.input_size[0]

        size = 128
        stddev = self.stddev(128**2, 64**2)
        self.weight_vars["W_conv_1"] =  tf.Variable(tf.truncated_normal([3,3,self.channels,filters],stddev=stddev))
        self.bias_vars["b_1"] = tf.Variable(tf.truncated_normal([filters],stddev=stddev))
        size /= 2


        for i in range(2,6):
            stddev = self.stddev((filters*2**(i-2))*size**2, filters*2**(i-1)*(size/2)**2)
            size /= 2
            self.weight_vars["W_conv_"+str(i)] =  tf.Variable(tf.truncated_normal([3,3,filters*2**(i-2),filters*2**(i-1)],stddev=stddev))
            self.bias_vars["b_"+str(i)] = tf.Variable(tf.truncated_normal([filters*2**(i-1)],stddev=stddev))



    def createCalculation(self, input_data):
        CNN = self.__class__
        #input dimension : 128*128*channels
        x = tf.reshape(input_data, [-1,128,128,self.channels])

        layers = {}

        layers["conv_relu_1"] = tf.nn.relu(CNN.conv2d(x, self.weight_vars["W_conv_1"]) + self.bias_vars["b_1"])
        layers["maxpool_1"] = CNN.max_pool_2x2(layers["conv_relu_1"])

        for i in range(1,5):
            layers["conv_relu_"+str(i+1)] = tf.nn.relu(CNN.conv2d(layers["maxpool_"+str(i)], self.weight_vars["W_conv_"+str(i+1)])
                    + self.bias_vars["b_"+str(i+1)])
            layers["maxpool_"+str(i+1)] = CNN.max_pool_2x2(layers["conv_relu_"+str(i+1)])

        #output dimension 4*4*filters*16
        return layers["maxpool_5"]

    def conv2d(x, W):
        return tf.nn.conv2d(x, W, strides=[1, 1, 1, 1], padding='SAME') #zero padding so input dim = output dim

    def max_pool_2x2(x): #regular maxpooling in 2x2 blocks
        return tf.nn.max_pool(x, ksize=[1, 2, 2, 1], strides=[1, 2, 2, 1], padding='SAME')

    def stddev(self, input_size, output_size):
        return 2*math.sqrt(1.3/(input_size+output_size))
        # return 4*math.sqrt(6/(input_size+output_size))
