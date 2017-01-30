
# import all/wanted classes
from frameworks.Framework import *
from frameworks.BotIOChromeExtension import *
from learningschemes.LearningScheme import *
from learningschemes.PolicyGradient import *
from nnarchitectures.NNArchitecture import *
from nnarchitectures.CNN import *
from nnarchitectures.FC import *
import tensorflow as tf

# create environment
# framework: serves picture, applies commands
# alternatives: UniverseFW, BotIOChromeExtension
frw = (BotIOChromeExtension,{'host':'','port':9999, 'skipframes': 3})

# stddev-function
def stddev(fan_in, fan_out):
    # return math.sqrt(4*1.3/(fan_in+fan_out))
    # return math.sqrt(150/(fan_in))
    return 4*math.sqrt(6/(fan_in+fan_out))

# architecture of neural network
# alternatives: CNN, RNN, FC, [LSTM, FractalNet, HighwayNets, uNet, ...]
# arc = (CNN_128x128_3x3_FC2, {"output_size":3, "stride":1, "fc_size":300, "num_filters":20})
arc = (NNMerge, {"settings":[
            (CNN, {"filters":5, "batch_normalization":False, "stddev":stddev}),
            (FC, {"layers":1, "filters":100, "stddev": stddev})
        ], "mid_sizes":[[4*4*5*(2**4)]]})
restore_name = "CNN_20__FC_2x300"

# learning scheme: gets pictures from framework, uses network
# alternatives: PolicyGradient, QLearning,
lsc = (PolicyGradient,{"window_inc":0, "timeframe_size":40, "optimizer":tf.train.AdamOptimizer(0.00001), "penalty_per_frame": 1/4})


# run
Framework.Framework.run(frw, lsc, arc, save_after_cycles=100, restore_name=restore_name)
