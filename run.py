
# import all/wanted classes
from frameworks.Framework import *
from frameworks.BotIOChromeExtension import *
from learningschemes.LearningScheme import *
from learningschemes.PolicyGradient import *
from nnarchitectures.NNArchitecture import *
from nnarchitectures.CNN import *
import tensorflow as tf

# create environment
# framework: serves picture, applies commands
# alternatives: UniverseFW, BotIOChromeExtension
frw = (BotIOChromeExtension,{'host':'','port':9999})

# architecture of neural network
# alternatives: CNN, RNN, FC, [LSTM, FractalNet, HighwayNets, uNet, ...]
arc = (CNN_128x128_3x3_FC2, {"output_size":3, "stride":1, "fc_size":300, "num_filters":20, "optimizer":tf.train.GradientDescentOptimizer(0.5)})

# learning scheme: gets pictures from framework, uses network
# alternatives: PolicyGradient, QLearning,
lsc = (PolicyGradient,{"window_inc":0, "timeframe_size":100})

# run
Framework.Framework.run(frw, lsc, arc, save_after_cycles=100)
