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
        self.lastcommand = []

        # inputs
        self.input_score = tf.placeholder(tf.float32, shape=[1])
        # self.input_score = tf.placeholder(tf.float32, shape=[timeframe_size])
        self.input_window = self.architecture.getInputPlaceholder(timeframe_size)
        self.input = tf.reshape(self.architecture.getInputPlaceholder(), [-1])
        self.action_prob = self.architecture.createCalculation(self.input)

        # formulate loss function
        loss = tf.Variable(tf.zeros(kwargs["numkeys"]), name="loss")
        for frame in range(timeframe_size):
            frame_prob = self.architecture.createCalculation(self.input_window[frame,:])
            # loss += self.input_score[frame]*tf.log(frame_prob)
            loss += self.input_score[0]*tf.log(frame_prob)
        #loss /= tf.constant(framecount, tf.float32, shape=[1])
        self.loss = tf.reduce_sum(loss)
        self.update = self.architecture.optimizer.minimize(-loss)

        # all variables set!
        super()._init__finished()
        self.sess.run(tf.global_variables_initializer())


    def learn(self):
        current_loss = self.sess.run([self.loss, self.update], feed_dict={self.input_window: self.x, self.input_score: [self.score_gain]})[0]
        print("\nLearning (Iteration:", self.learncount, ", Loss:",current_loss ,", ScoreGain:", self.score_gain ,")")
        self.x = []
        # self.score_gain = 0
        self.framecount = 0
        self.learncount += 1

    def react(self, image, score):
        self.framecount += 1
        # if self.framecount % 10 == 0:
        #     return self.lastcommand

        image = image.reshape([-1])
        self.x.append(image)
        current_command = self.sess.run(self.action_prob, feed_dict={self.input: image}).reshape([-1])

        if self.timeframe_size == self.framecount:
            self.score_gain = score - self.lastscore - self.framecount/100
            self.learn()
            self.lastscore = score

        # self.lastcommand = current_command.tolist()
        # return self.lastcommand
        return current_command.tolist()

    def game_restarted(self):
        self.x = []
        self.score_gain = []

    def predict(self, image, lastreaction, score):
        return [0.5, 0.7, 0.8]
