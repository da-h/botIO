from . import LearningScheme
import tensorflow as tf

class PolicyGradient(LearningScheme.LearningScheme):

    def __init__(self, window_inc=0, timeframe_size=100, **kwargs):
        super().__init__(**kwargs)

        # timeframe related
        self.learncount = 0
        self.framecount = 0
        self.timeframe_size = timeframe_size
        self.x = []
        self.score_gain = 0
        self.lastscore = 0
        self.lastcommand = [0.5,0.5,0.5]
        self.skip = 0

        # inputs
        self.input_score_gain = tf.placeholder(tf.float32, shape=())
        self.input_window = self.architecture.getInputPlaceholder(timeframe_size)
        self.input = tf.reshape(self.architecture.getInputPlaceholder(), [-1])
        self.action_prob = self.architecture.createCalculation(self.input)
        self.output_keys = self.architecture.getOutputPlaceholder()

        # score-function for user-interaction
        self.score_fn_usr = tf.square(self.action_prob - self.output_keys)
        self.update_usr = self.architecture.optimizer.minimize(self.score_fn_usr)

        # (POLICY GRADIENT) formulate score_fn_pg function
        score_fn_pg = tf.Variable(tf.zeros(kwargs["numkeys"]), name="score_fn_pg")
        for frame in range(timeframe_size):
            frame_prob = self.architecture.createCalculation(self.input_window[frame,:])
            score_fn_pg += self.input_score_gain*tf.log(frame_prob)
        self.score_fn_pg = score_fn_pg
        self.update_pg = self.architecture.optimizer.minimize(-self.score_fn_pg)

        # all variables set!
        super()._init__finished()
        self.sess.run(tf.global_variables_initializer())

    def _reset_pg(self):
        self.x = []
        self.frameconut = 0

    def react(self, used_keys, image, absolute_score, userinput=False):
        image = image.reshape([-1])

        # learn user commands
        if userinput:
            self.sess.run(self.update_usr, feed_dict={self.input: image, self.output_keys: used_keys})
            self._reset_pg()
            return used_keys # in case user is not giving input by the time of sending this message

        self.framecount += 1
        self.skip += 1
        if self.skip % 10 != 0:
            return self.lastcommand

        self.x.append(image)
        current_command = self.sess.run(self.action_prob, feed_dict={self.input: image}).reshape([-1])

        # learn policy gradient
        if self.timeframe_size == self.framecount:
            self.score_gain = absolute_score - self.lastscore - self.framecount
            self.sess.run(self.update_pg, feed_dict={self.input_window: self.x, self.input_score_gain: self.score_gain})
            print("\nLearning (Iteration:", self.learncount, ", ScoreGain:", self.score_gain ,")")
            self.learncount += 1
            self._reset_pg()
            self.lastscore = absolute_score

        self.lastcommand = current_command.tolist()
        return self.lastcommand
        # return current_command.tolist()

    def game_restarted(self):
        self.x = []
        self.score_gain = []
