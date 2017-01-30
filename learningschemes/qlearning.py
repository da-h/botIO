from . import LearningScheme
import tensorflow as tf
import numpy as np
from random import randint, random


class qlearning(LearningScheme.LearningScheme):

    def __init__(self, window_inc=0, **kwargs, discount, random_jump_rate):

        #set num_keys to 5

        super().__init__(**kwargs)

        #Qlearning parameters
        self.discount = discount
        self.random_jump_rate = random_jump_rate

        # timeframe related
        self.learncount = 0
        self.x = []

        #new inputs
        self.input_last_qval = tf.placeholder(tf.float32, shape=())
        self.input_currentmax = tf.placeholder(tf.float32, shape=())
        self.input_absolutescore = tf.placeholder(tf.float32, shape=())
        self.current_qvals = self.architecture.createCalculation(self.input)
        self.input = tf.squeeze(self.architecture.getInputPlaceholder(), axis=0)

        #qLearning formulate loss
        loss= tf.Variable(tf.zeros(kwargs["numkeys"]), name="loss")
        loss = self.input_absolute_score+self.discount*tf.reduce_max(self.current_qvals)-self.input_last_qval
        self.loss = loss
        self.update_ql = self.optimizer.minimize(tf.nn.l2_loss(self.loss))

        # all variables set!
        super()._init__finished()
        self.sess.run(tf.global_variables_initializer())

    def constructNN(self, architecture_tuple):
        # build architecture
        architecture_tuple[1]["input_size"] = self.image_dim
        architecture_tuple[1]["output_size"] = 6
        self.architecture = architecture_tuple[0](**architecture_tuple[1])

    def react(self, used_keys, image, absolute_score, userinput=False):

        current_qvals = self.sess.run(self.current_qvals, feed_dict={self.input: image}).reshape([-1])
        currentargmax = np.argmax(current_qvals)
        current_command = np.zeros(self.numkeys)
        self.absolute_score = absolute_score

        if random.uniform(0, 1) < self.random_jump_rate #for some small Probability do a random Jump
            action = randint(0,6)
        else #else take the action with best q-value
            action = currentargmax
        #hardcode command keys
        ######

        #learn
        if self.learncount is not 0:
            self.sess.run(self.update_ql, feed_dict={self.input: image,self.input_last_qval: self.last_qval, self.input_absolutescore: self.absolute_score})
        self.last_qval = current_qvals[action] #save qval
        self.learncount +=1
        self.save()

        return current_command

    def game_restarted(self):
        pass
