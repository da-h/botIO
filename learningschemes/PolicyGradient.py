from . import LearningScheme
import tensorflow as tf
import numpy as np

class PolicyGradient(LearningScheme.LearningScheme):

    def __init__(self, window_inc=0, timeframe_size=100, penalty_per_frame=1/10, **kwargs):
        super().__init__(**kwargs)

        # timeframe related
        self.learncount = 0
        self.framecount = 0
        self.timeframe_size = timeframe_size
        self.x = []
        self.score_gain = 0
        self.lastscore = 0
        self.lastcommand = [0.5,0.5,0.5]
        self.penalty_per_frame = penalty_per_frame

        # inputs
        self.input_score_gain = tf.placeholder(tf.float32, shape=())
        self.input_window = self.architecture.getInputPlaceholder(timeframe_size)
        self.input = tf.squeeze(self.architecture.getInputPlaceholder(), axis=0)
        self.action_prob = self.architecture.createCalculation(self.input)
        self.output_keys = tf.squeeze(self.architecture.getOutputPlaceholder())

        # score-function for user-interaction
        self.score_fn_usr = tf.square(self.action_prob - self.output_keys)
        self.update_usr = self.optimizer.minimize(self.score_fn_usr)

        # (POLICY GRADIENT) formulate score_fn_pg function
        score_fn_pg = tf.Variable(tf.zeros(kwargs["numkeys"]), name="score_fn_pg")
        for frame in range(timeframe_size):
            frame_prob = self.architecture.createCalculation(self.input_window[frame,:])

            # project into slither-command-space
            # frame_prob = tf.pack([ tf.reduce_max( [frame_prob[0],  )

            score_fn_pg += self.input_score_gain*tf.log(frame_prob)
        self.score_fn_pg = score_fn_pg
        self.update_pg = self.optimizer.minimize(-self.score_fn_pg)

        # all variables set!
        super()._init__finished()
        self.sess.run(tf.global_variables_initializer())

    def _reset_pg(self):
        self.x = []
        self.framecount = 0

    def react(self, used_key, image, absolute_score, userinput=False, extra_info=None):

        # learn user commands
        if userinput:
            self.sess.run(self.update_usr, feed_dict={self.input: image, self.output_keys: used_key, self.architecture.train_phase:True})
            self._reset_pg()
            self.save()
            return used_key # in case user is not giving input by the time of sending this message

        self.framecount += 1

        self.x.append(image)
        current_command = self.sess.run(self.action_prob, feed_dict={self.input: image, self.architecture.train_phase:True}).reshape([-1])

        # learn policy gradient
        if self.timeframe_size == self.framecount:
            self.score_gain = absolute_score - self.lastscore - self.framecount*self.penalty_per_frame
            self.sess.run(self.update_pg, feed_dict={self.input_window: self.x, self.input_score_gain: self.score_gain, self.architecture.train_phase:True})
            print("\n\nLearning (Iteration:", self.learncount, ", ScoreGain:", self.score_gain ,")")
            self.learncount += 1
            self._reset_pg()
            self.lastscore = absolute_score
            self.save()

        return current_command.tolist()

    def game_restarted(self):
        self.x = []
        self.score_gain = []
