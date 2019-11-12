import { lang } from '../config/main'
import { photodiodeGhostBox } from '../lib/markup/photodiode'
import { baseStimulus } from '../lib/markup/stimuli'

const experimentStart = () => {
  let stimulus = baseStimulus(`<div><h1>${lang.task.name}</h1></div>`, true) + photodiodeGhostBox()

   return {
    type: 'html_button_response',
    stimulus: stimulus,
    prompt: '',
    choices: [lang.prompt.continue.button],
  }
}

export default experimentStart
