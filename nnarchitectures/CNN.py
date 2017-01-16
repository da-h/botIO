import tensorflow as tf
import numpy as np
from . import NNArchitecture

# https://github.com/aymericdamien/TensorFlow-Examples/blob/master/examples/3_NeuralNetworks/convolutional_network.py
class CNN(NNArchitecture.NNArchitecture):

    def __init__(self, input_size_x, input_size_y, layers=10, window_size=3, stride=[0,0] ):
        self.input_size_x = input_size_x
	self.input_size_y = input_size_y
	self.layers = layers
	self.window_size = window_size
	self.stride = stride

    def weight_variable(shape):
	initial = tf.truncated_normal(shape, stddev=0.1)
	return tf.Variable(initial)

    def bias_variable(shape):
	initial = tf.constant(0.1, shape=shape)
	return tf.Variable(initial)

    def conv2d(x, W):
	return tf.nn.conv2d(x, W, strides=[1, stride[0], stride[1], 1], padding='SAME') #zero padding so input dim = output dim

    def max_pool_2x2(x): #regular maxpooling in 2x2 blocks
	return tf.nn.max_pool(x, ksize=[1, 2, 2, 1], strides=[1, 2, 2, 1], padding='SAME')

    def train(self, input_data, output_data):
	sess = tf.Session()
	x_input = tf.reshape(input_data, [-1,300,300,3]

	#conv+relu+pool1. Dimension after : 150x150x20

	W_conv1 = weight_variable([3,3,1,20])
	b_conv1 = bias_variable([20])

	h_conv1 = tf.nn.relu(conv2d(x_input, W_conv1) + b_conv1)
	h_pool1 = max_pool_2x2_(h_conv1)

	#conv+relu+pool1. Dimension after : 75x75x20

	W_conv2 = weight_variable([3,3,20,20])
	b_conv2 = bias_variable([32])

	h_conv2 = tf.nn.relu(conv2d(x_input, W_conv1) + b_conv1)
	h_pool2 = max_pool_2x2_(h_conv1)

	#usw. bis Schicht CNN7/MAXPOOL7

	W_fc1 = weight_variable([3*3*20,300])
	b_fc1 = bias_variable([300])

	h_pool2_flat = tf.reshape(h_pool2, [-1, 3*3*20])
	h_fc1 = tf.nn.relu(tf.matmul(h_pool2_flat, W_fc1) + b_fc1)

	#dropout??
	#keep_prob = tf.placeholder(tf.float32)
	#h_fc1_drop = tf.nn.dropout(h_fc1, keep_prob)


	W_fc2 = weight_variable([300,4])
	b_fc2 = bias_variable([4])

	y_conv = tf.matmul(h_fc1, W_fc2) + b_fc2 #ist der output Layer


        cross_entropy = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits(y_conv,output_data)) # warum Softmax?
	train_step = tf.train.AdamOptimizer(1e-4).minimize(cross_entropy) #benutzt ADAM gradient descent
	correct_prediction = tf.equal(tf.argmax(y_conv,1), tf.argmax(output_data,1)) #warum argmax mit 1?
	accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))
	sess.run(tf.global_variables_initializer())


    def test(self, input_data):
	pass

