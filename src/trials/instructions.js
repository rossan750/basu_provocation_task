import { lang } from '../config/main'
import { baseStimulus } from '../lib/markup/stimuli'


const screenOne = () => {
  var stimulus = baseStimulus(`
    <div class='instructions'>
    <h1>${lang.instructions.welcome}</h1>
    <p>${lang.instructions.p1}</p>
    <p>${lang.instructions.p2}</p>
    </div>
    `, true)

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
    <div id="fixation-dot" class="color-white"></div>
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

const screenFive = () => {
  var stimulus = baseStimulus(`
    <div class='instructions'>
    <p>${lang.instructions.no_talking}</p>
    </div>
    `, true)
  return {
    type: 'html_keyboard_response',
    stimulus: stimulus,
    prompt:  lang.prompt.continue.press,
    response_ends_trial: true
  }
}


const screenSix = () => {
  var stimulus = baseStimulus(`
    <div class='instructions'>
    <p>${lang.instructions.instruction_end}</p>
    </div>
    `, true)
  return {
    type: 'html_keyboard_response',
    stimulus: stimulus,
    prompt: lang.prompt.continue.press,
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

const instructions2 = {
  type: 'html_keyboard_response',
  timeline: [
    screenFive(),
    screenSix(),
  ]
}

export {
  instructions1,
  instructions2
}
