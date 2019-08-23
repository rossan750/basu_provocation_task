import { eventCodes } from '../config/main'
import { jitter50 } from '../lib/utils'
import { pdSpotEncode, photodiodeGhostBox } from '../lib/markup/photodiode'
import { fixationHTML } from '../lib/markup/fixation'
import { jsPsych } from 'jspsych-react'

const fixation = (duration, jittered=true, green=false) => {
  let stimulus = fixationHTML(green) + photodiodeGhostBox()

  const code = eventCodes.fixation;

  const trial_duration = jittered ? jitter50(duration) : duration

  return {
    type: 'html_keyboard_response',
    choices: jsPsych.NO_KEYS,
    stimulus: stimulus,
    response_ends_trial: false,
    trial_duration: trial_duration,
    on_load: () => pdSpotEncode(code),
    on_finish: (data) => data.code = code
  }
}

export default fixation
