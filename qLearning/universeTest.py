import gym
import universe  # register the universe environments
from universe.wrappers import action_space
import random
import numpy as np
import tensorflow as tf
import time
import os
import logging
import matplotlib.pyplot as plt
import collections
from universe.wrappers import BlockingReset, GymCoreAction, EpisodeID, Unvectorize, Vectorize, Vision, Logger

univ_logger=logging.getLogger('universe')
univ_logger.setLevel(logging.WARNING)

#y u no learn
class QNet(object):
    def __init__(self, img_x, img_y, path, channels=1, action_num=3, batch_size=None):
        self.path = path
        self.IMG_X = img_x
        self.IMG_Y = img_y
        self.CHANNELS = channels
        self.BATCH_SIZE = batch_size
        self.ACTION_NUM = action_num
        self.y_conv = None
        self.x = None
        self.rewardPlusQ = None
        self.train_step = None
        self.saver = None
        self.variables = []
        self.currentActions = None

    def build(self):
        def conv2d(x, W):
            return tf.nn.conv2d(x, W, strides=[1, 1, 1, 1], padding='SAME')

        def max_pool_2x2(x):
            return tf.nn.max_pool(x, ksize=[1, 2, 2, 1],
                                  strides=[1, 2, 2, 1], padding='SAME')

        def weight_variable(shape):
            initial = tf.truncated_normal(shape, stddev=0.1)
            return tf.Variable(initial)

        def bias_variable(shape):
            initial = tf.constant(0.1, shape=shape)
            return tf.Variable(initial)

        # Create the model
        self.x = tf.placeholder(tf.float32, [self.BATCH_SIZE, self.IMG_X, self.IMG_Y, self.CHANNELS])

        self.currentActions = tf.placeholder(tf.float32,[self.BATCH_SIZE,self.ACTION_NUM])

        # TODO: make this dynamic
        W_conv1 = weight_variable([5, 5, self.CHANNELS, 16])
        b_conv1 = bias_variable([16])
        h_conv1 = tf.nn.relu(conv2d(self.x, W_conv1) + b_conv1)
        h_pool1 = max_pool_2x2(h_conv1)

        W_conv2 = weight_variable([5, 5, 16, 32])
        b_conv2 = bias_variable([32])

        h_conv2 = tf.nn.relu(conv2d(h_pool1, W_conv2) + b_conv2)
        h_pool2 = max_pool_2x2(h_conv2)

        W_fc1 = weight_variable([self.IMG_Y / 4 * self.IMG_X / 4 * 32, 128])
        b_fc1 = bias_variable([128])

        h_pool2_flat = tf.reshape(h_pool2, [-1, self.IMG_Y / 4 * self.IMG_X / 4 * 32])
        h_fc1 = tf.nn.sigmoid(tf.matmul(h_pool2_flat, W_fc1) + b_fc1)

        #give information about already pressed buttons
        h_fc1 = tf.concat(1,[h_fc1,self.currentActions])

        W_fc2 = weight_variable([128+self.ACTION_NUM, self.ACTION_NUM])
        b_fc2 = bias_variable([self.ACTION_NUM])
        #self.variables = [W_conv1,b_conv1,h_conv1,h_pool1,W_conv2,b_conv2,h_conv2,h_pool2,W_fc1,b_fc1,h_pool2_flat,h_fc1,W_fc2,b_fc2]
        self.y_conv = tf.matmul(h_fc1, W_fc2) + b_fc2

        # Define loss and optimizer

        self.rewardPlusQ = tf.placeholder(tf.float32, [self.BATCH_SIZE, self.ACTION_NUM])
        loss = tf.reduce_mean(tf.squared_difference(self.rewardPlusQ, self.y_conv))
        # cross_entropy = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits(labels=y_, logits=y))
        self.train_step = tf.train.AdagradOptimizer(learning_rate=0.1).minimize(loss)


        # sess = tf.InteractiveSession()
        # tf.global_variables_initializer().run()
        self.saver = tf.train.Saver()

    def save(self, session):
        self.saver.save(session,self.path)

    def load(self, session):
        self.saver.restore(session, self.path)



class QFunc(object):
    def __init__(self, net, session, action_num):
        self.replayMemory = []
        self.epsilon = 1
        self.ACTION_NUM = action_num
        self.net = net
        self.session = session
        self.BATCH_SIZE = 4
        self.gamma = 0.9

    # returns Q values for each available action
    def getQValues(self, inputFrames, currentActions):
        return self.session.run(self.net.y_conv, feed_dict={self.net.x: inputFrames, self.net.currentActions:currentActions})

    def train(self):
        # take n tuples (state,action,reward,nextState,currentActions) from replay memory
        if (len(self.replayMemory) <= self.BATCH_SIZE):
            return
        replayTuples = np.array(random.sample(self.replayMemory, self.BATCH_SIZE))

        # for each tuple calculate bestActionMaxReward = reward + lr*max(getQValues(nextState))
        prevStates = toNp(replayTuples,0)
        nextStates = toNp(replayTuples,3)
        currentActions= toNp(replayTuples,4)

        qVals = self.getQValues(nextStates, currentActions)
        rewardPlusQ = self.getQValues(prevStates,currentActions)
        for i in range(self.BATCH_SIZE):
            rewardPlusQ[i, replayTuples[i, 1]] = replayTuples[i, 2] + self.gamma * np.max(qVals[i])

            # backpropagation with loss = bestActionMaxReward - getQValue(state)[action]
        self.session.run(self.net.train_step,
                         feed_dict={self.net.rewardPlusQ: rewardPlusQ,
                                    self.net.x: toNp(replayTuples,0),
                                    self.net.currentActions:toNp(replayTuples,4)})



        #increase iteration and update epsilon accordingly
        self.epsilon = max(self.epsilon * 0.9, 0.0)


    def addToReplay(self, stateTuple):
        #ensure that replay memory doesn't run out of mem
        if(len(self.replayMemory ) > 1000):
            del self.replayMemory[random.randint(0,len(self.replayMemory)-1)]

        self.replayMemory.append(stateTuple)

    def test(self, inputFrames):
        pass

    def react(self, observation,currentActions):
        action = None
        if (random.random() >= self.epsilon):
            tmp = self.getQValues(observation, currentActions)
            action = np.argmax(tmp)
            print tmp
        else:
            action = random.randint(0, self.ACTION_NUM-1)
        return action

class activeActions(object):
    def __init__(self, allActions):
        self.actionNum = len(allActions)
        self.allActions = allActions
        self.actionList = np.zeros(self.actionNum)

    def update(self, action):
        actNum = len(self.allActions)
        actIndex = self.allActions.index(action)
        self.actionList[actIndex] = 1
        self.actionList[(actIndex+ actNum/2)%actNum] = 0

    def toList(self):
        return np.array(self.actionList)

    def reset(self):
        self.actionList = np.zeros(self.actionNum)


def toNp(replayTuples,b):
    return np.array([np.array(i) for i in replayTuples[:, b]])

def preprocess(observation):
    global flag, chosen
    vis  = observation['vision']
    #crop
    if(chosen[1] == 0):
        vis = vis[84:84+chosen[2][0],18:18+chosen[2][0],:]
    elif(chosen[1] == 1):
        vis = vis[0:chosen[2][0], 0:chosen[2][1], :]
    #black and white
    vis = np.mean(vis,-1)
    if(flag == False):
        plt.imshow(vis)
        plt.show()
        flag = True
    #visSize = vis.shape
    #vis = tf.image.rgb_to_grayscale(vis)
    #vis = tf.image.resize_images(vis, [int(visSize[0]*0.5), int(visSize[1]*0.5)])
    observation['vision'] = np.array(vis,dtype='float32')/255
    return observation

def readActions(file):
    actions = []
    with open('ActionLists/'+file,'r') as f:
        lines = f.readlines()

    for line in lines:
        splitLine = line.split(',')
        splitLine[2] = bool(int(splitLine[2]))
        actions.append([(splitLine[0],splitLine[1],splitLine[2])])
    return actions

def invertActions(actions):
    for i in range(len(actions[0])):
        actions[0][i] = (actions[0][i][0],actions[0][i][1],False)
    return actions

def queue2vision(queue, size):
    observations = list(queue)
    #print observations[0].shape, " ", observations[1].shape, " ", observations[2].shape
    observations = np.reshape(observations,size)
    return observations


flag = True
SLITHER_PROPS = ['internet.SlitherIOEasy-v0',0,(300,496)]
PONG_PROPS = ['gym-core.PongDeterministicSync-v3',1,(208,160)]
BREAKOUT_PROPS= ['gym-core.Breakout-v0',1,(208,160)]

chosen = BREAKOUT_PROPS
GAME = chosen[0]
QUEUESIZE = 3
VISION_SHAPE = (chosen[2][0],chosen[2][1],QUEUESIZE)
gameType = chosen[1]



env = GymCoreAction(gym.make(GAME))
print env.action_space
#actions = readActions(GAME)
actions=range(6)
activeAct = activeActions(actions)
observationQueue = collections.deque()
#print env.action_space



#size hardcoded for now
qnet = QNet(VISION_SHAPE[0],VISION_SHAPE[1],GAME, channels=QUEUESIZE,action_num=len(actions))

print("BUILDING MODEL")
start_time=time.time()
qnet.build()
#config = tf.ConfigProto(device_count={'GPU':0})
session=tf.Session()
init=tf.initialize_all_variables()
if(os.path.exists(GAME)):
    qnet.load(session)
else:
    session.run(init)




Q = QFunc(qnet,session=session,action_num=len(actions))
print "BUILDING MODEL TOOK %s SECONDS"%(time.time()-start_time)



env.configure(remotes=1)  # automatically creates a local docker container
observation_n = env.reset()


while True:

    while observation_n[0] is None:
        _act = actions[0]
        activeAct.update(_act)
        observation_n, reward_n, done_n, info = env.step([_act])
        env.render()


    while len(observationQueue) <3:
        observationQueue.append(np.array(preprocess(observation_n[0])['vision']))
        observation_n, reward_n, done_n, info = env.step([0])
        env.render()


    if(observation_n[0]['vision'].shape != VISION_SHAPE[:2]):
        observation_n = np.array([preprocess(ob) for ob in observation_n])

    ob = queue2vision(observationQueue,VISION_SHAPE)
    #for each frame in observation let the network react with an action
    actions_n = [actions[Q.react([ob],[activeAct.toList()])]]
    activeAct.update(actions_n[0])

    #the next observation and the rewards gotten from our previous actions
    observation_n, reward_n, done_n, info = env.step(actions_n)
    print activeAct.toList()

    #if game terminates save net
    if (observation_n[0] is None):
        qnet.save(session)
        activeAct.reset()
        continue

    observation_n = np.array([preprocess(_ob) for _ob in observation_n])
    observationQueue.append(observation_n[0]['vision'])


    observationQueue.popleft()
    obNew = queue2vision(observationQueue,VISION_SHAPE)

    #now these experiences must be saved as replay memories
    Q.addToReplay([ob, actions.index(actions_n[0]), reward_n[0],obNew, activeAct.toList()])

    Q.train()

    env.render()
