import { lang } from '../config/main'
import { baseStimulus } from '../lib/markup/stimuli'

const screenFive = () => {
  var stimulus = baseStimulus(`
    <div class='instructions'>
    <ul>
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
    prompt:  lang.prompt.continue.press,
    response_ends_trial: true
  }
}

const instructions2 = {
  type: 'html_keyboard_response',
  timeline: [
    screenFive(),
    screenSix(),
  ]
}

export default instructions2
