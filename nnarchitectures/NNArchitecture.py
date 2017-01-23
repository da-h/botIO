import tensorflow as tf

class NNArchitecture(object):

    def __init__(self, input_size, output_size):
        self.input_size = input_size
        self.output_size = output_size

    def getInputPlaceholder(self, num=1):
        return tf.placeholder(tf.float32, shape=[num] + self.input_size)

    def getOutputPlaceholder(self, num=1):
        return tf.placeholder(tf.float32, shape=[num] + self.output_size)

    def createCalculation(self, input_data):
        raise Exception("Should be overwritten")

class NNMerge(NNArchitecture):
    def __init__(self, input_size, output_size, settings, mid_sizes):
        self.input_size = input_size
        self.output_size = output_size
        self.mid_sizes = [input_size] + mid_sizes + [output_size]
        self.archs = []

        # build architecture
        for i, (arc_class, arc_param) in enumerate(settings):
            arc_param["input_size"] = self.mid_sizes[i]
            arc_param["output_size"] = self.mid_sizes[i+1]
            self.archs.append( arc_class(**arc_param) )


    def createCalculation(self, input_data):
        results = [ input_data ]

        for i, arc in enumerate(self.archs):
            results.append( arc.createCalculation( results[i] ) )

        return results[-1]
