import tensorflow as tf
import numpy as np
from . import NNArchitecture

# https://github.com/aymericdamien/TensorFlow-Examples/blob/master/examples/3_NeuralNetworks/convolutional_network.py
class CNN_128x128_3x3_FC2(NNArchitecture.NNArchitecture):

    def __init__(self, input_dim, output_size, stride=0, fc_size=300, num_filters=20, optimizer=None):
        super().__init__(input_dim, output_size, optimizer)

        if input_dim[0] != 128 or input_dim[1] != 128:
            raise ValueError("wrong dimension given for this Network")

        self.stride = stride
        self.num_filters = num_filters
        self.fc_size = fc_size
        # TODO: needed???
        CNN = self.__class__

        # create needed variables
        self.W_conv1 = CNN.weight_variable([3,3,1,self.num_filters])
        self.b_conv1 = CNN.bias_variable([self.num_filters])
        self.W_conv2 = CNN.weight_variable([3,3,1,self.num_filters])
        self.b_conv2 = CNN.bias_variable([self.num_filters])
        self.W_conv3 = CNN.weight_variable([3,3,1,self.num_filters])
        self.b_conv3 = CNN.bias_variable([self.num_filters])
        self.W_fc1 = CNN.weight_variable([16*16*self.num_filters,self.fc_size])
        self.b_fc1 = CNN.bias_variable([self.fc_size])
        self.W_fc2 = CNN.weight_variable([self.fc_size,self.output_size])
        self.b_fc2 = CNN.bias_variable([self.output_size])

    def getInputPlaceholder(self, num=1):
        return tf.placeholder(tf.float32, shape=[num, 128*128])

    def getOutputPlaceholder(self, num=1):
        return tf.placeholder(tf.float32, shape=[num, self.output_size])

    def createCalculation(self, input_data):
        CNN = self.__class__

        #Dimension : 128*128*1
        x_ = tf.reshape(input_data, [-1, 128,128,1])

        #conv+relu+pool0. Dimension after : 64x64x1
        h_conv1 = tf.nn.relu(CNN.conv2d(x_, self.W_conv1, self.stride) + self.b_conv1)
        h_pool1 = CNN.max_pool_2x2(h_conv1)

        # test
        h_pool3_flat = tf.reshape(h_pool1, [-1, 16*16*self.num_filters])
        #conv+relu+pool1. Dimension after : 32x32x1
        # h_conv2 = tf.nn.relu(CNN.conv2d(h_pool1, self.W_conv2, self.stride) + self.b_conv2)
        # h_pool2 = CNN.max_pool_2x2(h_conv2)

        # #conv+relu+pool1. Dimension after : 16x16x1
        # h_conv3 = tf.nn.relu(CNN.conv2d(h_pool2, self.W_conv3, self.stride) + self.b_conv3)
        # h_pool3 = CNN.max_pool_2x2(h_conv3)

        # fully connected 1
        # h_pool3_flat = tf.reshape(h_pool3, [-1, 16*16*self.num_filters])
        h_fc1 = tf.nn.relu(tf.matmul(h_pool3_flat, self.W_fc1) + self.b_fc1)

        #dropout??
        #keep_prob = tf.placeholder(tf.float32)
        #h_fc1_drop = tf.nn.dropout(h_fc1, keep_prob)

        # fully connected 2

        # output
        return tf.matmul(h_fc1, self.W_fc2) + self.b_fc2

    def weight_variable(shape):
        initial = tf.truncated_normal(shape, stddev=0.1)
        return tf.Variable(initial)

    def bias_variable(shape):
        initial = tf.constant(0.1, shape=shape)
        return tf.Variable(initial)

    def conv2d(x, W, stride):
        return tf.nn.conv2d(x, W, strides=[1, stride, stride, 1], padding='SAME') #zero padding so input dim = output dim

    def max_pool_2x2(x): #regular maxpooling in 2x2 blocks
        return tf.nn.max_pool(x, ksize=[1, 2, 2, 1], strides=[1, 2, 2, 1], padding='SAME')
