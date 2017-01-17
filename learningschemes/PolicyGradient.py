from . import LearningScheme
import tensorflow as tf

class PolicyGradient(LearningScheme.LearningScheme):

    def __init__(self, window_inc=0, timeframe_size=100, **kwargs):
        super().__init__(**kwargs)
        self.framecount = 0
        self.timeframe_size = timeframe_size
        self.x = []
        self.score = []

        # inputs
        self.input_score = tf.placeholder(tf.float32, shape=[timeframe_size])
        self.input_window = self.architecture.getInputPlaceholder(timeframe_size)
        self.input = self.architecture.getInputPlaceholder()
        self.action_prob = self.architecture.createCalculation(self.input[0])

        # formulate loss function
        self.loss = tf.Variable(tf.zeros(kwargs["numkeys"]), name="loss")
        for frame in range(0,timeframe_size-1):
            frame_prob = self.architecture.createCalculation(self.input_window[:,frame])
            self.loss += self.score[frame]*tf.log(frame_prob)
        #self.loss /= tf.constant(framecount, tf.float32, shape=[1])
        loss = tf.reduce_mean(loss)
        self.update = self.architecture.optimizer.maximize(loss)
        self.sess.run(tf.global_variables_initializer())

        super().__init__finished()

    def learn(self):
        self.sess.run(self.update, feed_dict={input_window: self.x, input_score: self.score})
        self.x = []
        self.score = []

    def react(self, image, score):
        self.x.append(image)
        self.score.append(score)
        current_command = self.sess.run(self.action_prob, feed_dict={input: image})
        self.framecount += 1

        if timeframe_size == self.framecount:
            self.learn()

        return current_command

    def predict(self, image, lastreaction, score):
        return [0.5, 0.7, 0.8]
