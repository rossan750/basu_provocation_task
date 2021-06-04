import { jsPsych } from 'jspsych-react'

// add a random number between 0 and offset to the base number
const jitter = (base, offset) => (
  base + Math.floor(Math.random() * Math.floor(offset))
)

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// add a random number between 0 and 50 to the base number
const jitter50 = (base) => jitter(base, 50)

// flip a coin
const randomTrue = () => Math.random() > 0.5

// deeply copy an object
const deepCopy = (obj) => JSON.parse(JSON.stringify(obj))

// format a number as a dollar amount
const formatDollars = (amount) => '$' + parseFloat(amount).toFixed(2)

// shuffle the items in an array randomly
const shuffleArray = (array) => {
  let currentIndex = array.length
  let temporaryValue, randomIndex
  // While there remain elements to shuffle
  while (0 !== currentIndex) {
    // Pick a remaining element
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1
    // And swap it with the current element
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }
  return array
}

// create a pre-trial wait period
const generateWaitSet = (trial, waitTime) => {
  let waitTrial = Object.assign({}, trial)
  waitTrial.trial_duration = waitTime
  waitTrial.response_ends_trial = false
  waitTrial.prompt = '-'

  return [waitTrial, trial]
}

const keypressResponse = (info) => {
  const data = {
    key_press: info.key
  }

  jsPsych.finishTrial(data)
}

const startKeypressListener = () => {
  let keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
    callback_function: keypressResponse,
    valid_responses: jsPsych.ALL_KEYS,
    persist: false
  })

  return keyboardListener
}

const getTurkUniqueId = () => {
  const turkInfo = jsPsych.turk.turkInfo()
  const uniqueId = `${turkInfo.workerId}:${turkInfo.assignmentId}`
  return uniqueId
}

const beep = (audioCodes) => {
  const context = new AudioContext()
  const o = context.createOscillator()
  const g = context.createGain()
  o.type = audioCodes.type
  o.connect(g)
  o.frequency.setValueAtTime(audioCodes.frequency, 0)
  console.log(context.currentTime)
  g.connect(context.destination)
  o.start()
  o.stop(context.currentTime + 0.4)
}

export {
  jitter,
  sleep,
  jitter50,
  randomTrue,
  deepCopy,
  formatDollars,
  shuffleArray,
  generateWaitSet,
  startKeypressListener,
  getTurkUniqueId,
  beep
}
