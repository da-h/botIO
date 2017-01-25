import tensorflow as tf
import numpy as np
import math
from . import NNArchitecture
from tensorflow.contrib.layers.python.layers import batch_norm as batch_norm


class CNN(NNArchitecture.NNArchitecture):

    def __init__(self, filters=20, batch_normalization=True, **kwargs):
        super().__init__(**kwargs)

        if self.input_size[1] != 128 or self.input_size[2] != 128: # fixed 128x128 input size
            raise ValueError("wrong dimension given for this Network")

        self.filters = filters
        CNN = self.__class__

        self.weight_vars = {}
        self.bias_vars = {}
        self.batch_normalization = batch_normalization

        self.channels = self.input_size[0]

        size = 128
        stddev = self.stddev(128**2, 64**2)
        self.weight_vars["W_conv_1"] =  tf.Variable(tf.truncated_normal([3,3,self.channels,filters],stddev=stddev))
        self.bias_vars["b_1"] = tf.Variable(tf.zeros([filters]))
        size /= 2

        for i in range(2,6):
            stddev = self.stddev((filters*2**(i-2))*size**2, filters*2**(i-1)*(size/2)**2)
            size /= 2
            self.weight_vars["W_conv_"+str(i)] =  tf.Variable(tf.truncated_normal([3,3,filters*2**(i-2),filters*2**(i-1)],stddev=stddev))
            self.bias_vars["b_"+str(i)] = tf.Variable(tf.zeros([filters*2**(i-1)]))

    def createCalculation(self, input_data):
        CNN = self.__class__
        #input dimension : 128*128*channels
        x = tf.reshape(input_data, [-1,128,128,self.channels])

        layers = {}

        layers["conv_relu_1"] = tf.nn.relu(CNN.conv2d(x, self.weight_vars["W_conv_1"]) + self.bias_vars["b_1"])
        layers["maxpool_1"] = CNN.max_pool_2x2(layers["conv_relu_1"])

        for i in range(1,5):
            conv = CNN.conv2d(layers["maxpool_"+str(i)], self.weight_vars["W_conv_"+str(i+1)]) + self.bias_vars["b_"+str(i+1)]
            if self.batch_normalization:
                nout = np.prod(conv.get_shape().as_list()[-1])
                conv = CNN.batch_norm(conv, nout, self.train_phase)
            layers["conv_relu_"+str(i+1)] = tf.nn.relu(conv)
            layers["maxpool_"+str(i+1)] = CNN.max_pool_2x2(layers["conv_relu_"+str(i+1)])

        #output dimension 4*4*filters*16
        return layers["maxpool_5"]

    def conv2d(x, W):
        return tf.nn.conv2d(x, W, strides=[1, 1, 1, 1], padding='SAME') #zero padding so input dim = output dim

    def max_pool_2x2(x): #regular maxpooling in 2x2 blocks
        return tf.nn.max_pool(x, ksize=[1, 2, 2, 1], strides=[1, 2, 2, 1], padding='SAME')

    def batch_norm(x, n_out, phase_train):
        """
        Batch normalization on convolutional maps.
        Ref.: http://stackoverflow.com/questions/33949786/how-could-i-use-batch-normalization-in-tensorflow
        Args:
            x:           Tensor, 4D BHWD input maps
            n_out:       integer, depth of input maps
            phase_train: boolean tf.Varialbe, true indicates training phase
            scope:       string, variable scope
        Return:
            normed:      batch-normalized maps
        """
        with tf.variable_scope('bn'):
            beta = tf.Variable(tf.constant(0.0, shape=[n_out]),
                    name='beta', trainable=True)
            gamma = tf.Variable(tf.constant(1.0, shape=[n_out]),
                    name='gamma', trainable=True)
            batch_mean, batch_var = tf.nn.moments(x, [0,1,2], name='moments')
            ema = tf.train.ExponentialMovingAverage(decay=0.5)

            def mean_var_with_update():
                ema_apply_op = ema.apply([batch_mean, batch_var])
                with tf.control_dependencies([ema_apply_op]):
                    return tf.identity(batch_mean), tf.identity(batch_var)

            mean, var = tf.cond(phase_train,
                    mean_var_with_update,
                    lambda: (ema.average(batch_mean), ema.average(batch_var)))
            normed = tf.nn.batch_normalization(x, mean, var, beta, gamma, 1e-3)
            return normed

