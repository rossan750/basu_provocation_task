import { lang } from '../config/main'
import { baseStimulus } from '../lib/markup/stimuli'

const blockEnd = () => {
  let stimulus = baseStimulus(`
    <div class='instructions'>
  <h1>${lang.instructions.block_end}</h1>
  <h2>${lang.instructions.block_break}</h2>
  </div>`, true)

   return {
    type: 'html_button_response',
    stimulus: stimulus,
    choices: [lang.prompt.continue.button]
  }
}

export default blockEnd
