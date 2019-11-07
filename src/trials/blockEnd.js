import { lang } from '../config/main'
import { baseStimulus } from '../lib/markup/stimuli'

const blockEnd = (curBlock, totalBlocks) => {
  let stimulus = baseStimulus(`
    <div class='instructions'>
  <h1>${lang.block.end_p1}
    ${curBlock}
    ${lang.block.end_p2}
    ${totalBlocks}
    ${lang.block.end_p3}</h1>
  <h2>${lang.block.break_p1}
    ${curBlock + 1}
    ${lang.block.break_p2}
    ${totalBlocks}
    ${lang.block.break_p3}</h2>
  </div>`, true)

   return {
    type: 'html_button_response',
    stimulus: stimulus,
    choices: [lang.prompt.continue.button]
  }
}

export default blockEnd
