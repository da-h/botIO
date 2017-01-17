import tensorflow as tf

class LearningScheme(object):

    def __init__(self, image_dim, numkeys, architecture_tuple):
        self.image_dim = image_dim
        self.numkeys = numkeys

        self.constructNN(architecture_tuple)
        self.arch_x_ = self.architecture.getInputPlaceholder()
        self.arch_y_ = self.architecture.getOutputPlaceholder()

    def __init__finished(self):

        # build computation graph
        self.init_op = tf.global_variables_initializer()
        self.saver = tf.train.Saver()

        # start tensorflow session
        self.sess = tf.Session()
        self.sess.run(self.init_op)

    def constructNN(self, architecture_tuple):
        # build architecture
        architecture_tuple[1]["input_dim"] = self.image_dim
        architecture_tuple[1]["output_size"] = self.numkeys
        self.architecture = architecture_tuple[0](**architecture_tuple[1])

    def game_restarted():
        raise Exception("Should be overwritten")

    def learn(self):
        raise Exception("Should be overwritten")

    def react(self, image, score):
        raise Exception("Should be overwritten")
