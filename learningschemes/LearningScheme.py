import tensorflow as tf
import os

class LearningScheme(object):

    def __init__(self, image_dim, numkeys, architecture_tuple, save_after_cycles, restore_path):
        self.image_dim = image_dim
        self.numkeys = numkeys
        self.save_after_cycles = save_after_cycles
        self.restore_path = restore_path+"/"
        self.save_counter = 0
        self.save_checkpoints = 0

        self.constructNN(architecture_tuple)
        self.arch_x_ = self.architecture.getInputPlaceholder()
        self.arch_y_ = self.architecture.getOutputPlaceholder()

    def _init__finished(self):

        # build computation graph
        self.init_op = tf.global_variables_initializer()

        # start tensorflow session
        self.sess = tf.Session()
        self.sess.run(self.init_op)

        # restore if exists
        self.saver = tf.train.Saver()
        if not os.path.exists(self.restore_path):
            os.makedirs(self.restore_path)
        ckpt = tf.train.get_checkpoint_state(self.restore_path)
        if ckpt and ckpt.model_checkpoint_path:
            print("Restoring ... ", end="");
            self.saver.restore(self.sess, ckpt.model_checkpoint_path)
            print("Done.\n");

    def constructNN(self, architecture_tuple):
        # build architecture
        architecture_tuple[1]["input_size"] = self.image_dim
        architecture_tuple[1]["output_size"] = self.numkeys
        self.architecture = architecture_tuple[0](**architecture_tuple[1])

    def game_restarted(self):
        raise Exception("Should be overwritten")

    def react(self, used_keys, image, score, userinput=False):
        raise Exception("Should be overwritten")

    def save(self):
        self.save_counter += 1
        if self.save_counter % self.save_after_cycles == 0:
            self.save_checkpoints += 1
            self.saver.save(self.sess, self.restore_path, global_step=self.save_checkpoints)
