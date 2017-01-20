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
        self.input_score_gain = tf.placeholder(tf.float32, shape=[1])
        # self.input_score_gain = tf.placeholder(tf.float32, shape=[timeframe_size])
        self.input_window = self.architecture.getInputPlaceholder(timeframe_size)
        self.input = tf.reshape(self.architecture.getInputPlaceholder(), [-1])
        self.action_prob = self.architecture.createCalculation(self.input)

        # formulate score_fn function
        score_fn = tf.Variable(tf.zeros(kwargs["numkeys"]), name="score_fn")
        for frame in range(timeframe_size):
            frame_prob = self.architecture.createCalculation(self.input_window[frame,:])
            # score_fn += self.input_score_gain[frame]*tf.log(frame_prob)
            score_fn += self.input_score_gain[0]*tf.log(frame_prob)
        #score_fn /= tf.constant(framecount, tf.float32, shape=[1])
        # self.score_fn = tf.reduce_mean(-score_fn)
        self.score_fn = score_fn
        self.update = self.architecture.optimizer.minimize(-self.score_fn)

        # all variables set!
        super()._init__finished()
        self.sess.run(tf.global_variables_initializer())


    def learn(self):
        current_score_fn = self.sess.run([-self.score_fn, self.update], feed_dict={self.input_window: self.x, self.input_score_gain: [self.score_gain]})[0]
        print("\nLearning (Iteration:", self.learncount, ", score_fn:",current_score_fn ,", ScoreGain:", self.score_gain ,")")
        self.x = []
        # self.score_gain = 0
        self.framecount = 0
        self.learncount += 1

    def react(self, image, absolute_score):
        self.skip += 1
        if self.skip % 10 != 0:
            return self.lastcommand
        self.framecount += 1

        image = image.reshape([-1])
        self.x.append(image)
        current_command = self.sess.run(self.action_prob, feed_dict={self.input: image}).reshape([-1])

        if self.timeframe_size == self.framecount:
            self.score_gain = absolute_score - self.lastscore - self.framecount
            self.learn()
            self.lastscore = absolute_score


        self.lastcommand = current_command.tolist()
        return self.lastcommand
        # return current_command.tolist()

    def game_restarted(self):
        self.x = []
        self.score_gain = []
