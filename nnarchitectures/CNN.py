import tensorflow as tf
import numpy as np
from . import NNArchitecture

# https://github.com/aymericdamien/TensorFlow-Examples/blob/master/examples/3_NeuralNetworks/convolutional_network.py

class CNN_128x128_3x3_FC2(NNArchitecture.NNArchitecture):

    def __init__(self, num_filters=20, **kwargs):
        super().__init__(**kwargs)

        if input_size[0] != 128 or input_size[1] != 128: # fixed 128x128 input size
            raise ValueError("wrong dimension given for this Network")

        self.num_filters = num_filters
        self.fc_size = fc_size
        CNN = self.__class__

	self.weight_vars = {}
        self.bias_vars = {}

	channels = input_size[0]
	
	self.weight_vars["W_conv_1"] =  tf.Variable(tf.truncated_normal([3,3,channels,num_filters],stddev=self.stddev(128*128))
	self.bias_vars["b_1"] = tf.Variable(tf.truncated_normal(num_filters,stddev=self.stddev(128*128))


	for i in range(2,6):
		self.weight_vars["W_conv_"+str(i)] =  tf.Variable(tf.truncated_normal([3,3,num_filters*2**(i-2),num_filters*2**(i-1)],stddev=self.stddev(128*128))
		self.bias_vars["b_"+str(i)] = tf.Variable(tf.truncated_normal(num_filters,stddev=self.stddev(128*128))

      

    def createCalculation(self, input_data):
        CNN = self.__class__
        #input dimension : 128*128*channels
	x = tf.reshape(x, [-1,128,128,channels])

	layers = {}

	layers["conv_relu_1"] = tf.nn.relu(CNN.conv2d(x, self.weight_vars["W_conv_1"]) + self.bias_vars["b_1"])
	layers["maxpool_1"] = CNN.max_pool_2x2(layers["conv_relu_1"])

	for i in range(1,5):
		layers["conv_relu_"+str(i+1)] = tf.nn.relu(CNN.conv2d(x, self.weight_vars["W_conv"+str(i)]) + self.bias_vars["b_"+str(i+1)])
		layers["maxpool_"+str(i+1)] = CNN.max_pool_2x2(layers["conv_relu_1"])
	
	#output dimension 4*4*num_filters*16

        return layers["maxpool_5"]

    
    def conv2d(x, W):
        return tf.nn.conv2d(x, W, strides=[1, 1, 1, 1], padding='SAME') #zero padding so input dim = output dim

    def max_pool_2x2(x): #regular maxpooling in 2x2 blocks
        return tf.nn.max_pool(x, ksize=[1, 2, 2, 1], strides=[1, 2, 2, 1], padding='SAME')

    def stddev(self, input_size):
        # return math.sqrt(2*1.3/input_size)
        return math.sqrt(4*1.3/input_size)
