import tensorflow as tf
import numpy as np
from . import NNArchitecture
import math

# https://github.com/aymericdamien/TensorFlow-Examples/blob/master/examples/3_NeuralNetworks/convolutional_network.py
class FC(NNArchitecture.NNArchitecture):

    def __init__(self, layers=10, filters=20, **kwargs):
        super().__init__(**kwargs)

        self.filters = filters
        self.layers = layers

        # create needed variables
        stddev = math.sqrt(2*1.3/(self.input_size[0]*self.input_size[1]))
        self.weight_vars = {}
        self.bias_vars = {}
        weight_dim = [self.input_size[0]*self.input_size[1], self.filters]
        self.weight_vars["W_fc0"] = tf.Variable(tf.truncated_normal(weight_dim,stddev=stddev))
        self.bias_vars["b_fc0"] = tf.Variable(tf.truncated_normal([self.filters], stddev=stddev))
        for i in range(1, self.layers):
            self.weight_vars["W_fc"+str(i)] = tf.Variable(tf.truncated_normal([self.filters,self.filters],stddev=stddev))
            self.bias_vars["b_fc"+str(i)] = tf.Variable(tf.truncated_normal([self.filters], stddev=stddev))
        self.weight_vars["W_fc"+str(self.layers)] = tf.Variable(tf.truncated_normal([self.filters, self.output_size],stddev=stddev))
        self.bias_vars["b_fc"+str(self.layers)] = tf.Variable(tf.truncated_normal([self.output_size], stddev=stddev))

    def createCalculation(self, input_data):

        #Dimension : 128*128*1
        x_ = tf.reshape(input_data, [1, self.input_size[0]*self.input_size[1]])

        construction = {}
        construction["y_0"] = tf.matmul( x_, self.weight_vars["W_fc0"]) + self.bias_vars["b_fc0"]
        for i in range(self.layers):
            construction["y_"+str(i+1)] = tf.matmul( tf.nn.relu(construction["y_"+str(i)]), self.weight_vars["W_fc"+str(i+1)]) + self.bias_vars["b_fc"+str(i+1)]

        # return construction["y_"+str(self.layers)]
        return tf.sigmoid(construction["y_"+str(self.layers)])
