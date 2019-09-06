import { lang } from '../config/main'
import { baseStimulus } from '../lib/markup/stimuli'


const screenOne = () => {
  var stimulus = baseStimulus(`
    <div class='instructions'>
    <h1>${lang.instructions.welcome}</h1>
    <p>${lang.instructions.p1}</p>
    <p>${lang.instructions.p2}</p>
    </div>
    `, prompt=true)

  return {
    type: 'html_keyboard_response',
    stimulus: stimulus,
    prompt:  lang.prompt.continue.press,
    response_ends_trial: true
  }
}

const screenTwo = () => {
  var stimulus = baseStimulus(`
    <div class='instructions'>
    <p>${lang.instructions.fixation}</p>
    <div id="fixation-dot"></div>
    </div>
    `, true)

  return {
    type: 'html_keyboard_response',
    stimulus: stimulus,
    prompt:  lang.prompt.continue.press,
    response_ends_trial: true
  }
}

const screenThree = () => {
  var stimulus = baseStimulus(`
    <div class='instructions'>
    <p>${lang.instructions.rate}</p>
    </div>
    `, true)
  return {
    type: 'html_keyboard_response',
    stimulus: stimulus,
    prompt:  lang.prompt.continue.press,
    response_ends_trial: true
  }
}

const screenFour = () => {
  var stimulus = baseStimulus(`
    <div class='instructions'>
    <p>${lang.instructions.rate_practice}</p>
    </div>
    `, true)
  return {
    type: 'html_keyboard_response',
    stimulus: stimulus,
    prompt:  lang.prompt.continue.press,
    response_ends_trial: true
  }
}


const instructions1 = {
  type: 'html_keyboard_response',
  timeline: [
    screenOne(),
    screenTwo(),
    screenThree(),
    screenFour(),
  ]
}

export default instructions1
