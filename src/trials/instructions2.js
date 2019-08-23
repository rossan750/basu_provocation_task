import { lang } from '../config/main'
import { images } from '../lib/utils'
import {baseStimulus } from '../lib/markup/stimuli'
import {fixationHTML } from '../lib/markup/fixation'
import _ from 'lodash'

const screenFive = () => {
  var stimulus = baseStimulus(`
    <div class='instructions'>
    <ul>
    <p>${lang.instructions.no_talking}</p>
    </ul>
    </div>
    `, prompt=true)
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
    <div class="row">
    </div>
    `, prompt=true)
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
