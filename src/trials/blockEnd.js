import { lang, breathingAudio } from '../config/main'
import { baseStimulus } from '../lib/markup/stimuli'

const blockEnd = (curBlock, totalBlocks) => {
  let prompt = baseStimulus(`
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
    type: 'audio_button_response',
    stimulus: breathingAudio,
    prompt: prompt,
    choices: [lang.prompt.continue.button]
  }
}

export default blockEnd
