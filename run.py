
# import all/wanted modules
import * from frameworks
import * from learningschemes
import * from learningschemes

# create environment
# framework: serves picture, applies commands
# alternatives: UniverseFW, WebsocketFW
frw = WebsocketFW

# architecture of neural network
# alternatives: CNN, RNN, FC, [LSTM, FractalNet, HighwayNets, uNet, ...]
arc = CNN({'layers': 10, 'window_size': 3, 'stride': 0})

# learning scheme: gets pictures from framework, uses network
# alternatives: PolicyGradient, QLearning,
lsc = PolicyGradient({ 'window_inc': 0, 'window_size': 100})

# run
frw.run(lsc, arc, {'save_after_cycles':100})
