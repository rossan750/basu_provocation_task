import { lang, breathingAudio, eventCodes } from '../config/main'
import { baseStimulus } from '../lib/markup/stimuli'
import { photodiodeGhostBox, pdSpotEncode } from '../lib/markup/photodiode'

const blockEnd = (curBlock, totalBlocks) => {
  const code = eventCodes.start_break;

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
  </div>`, true) + photodiodeGhostBox()

   return {
    type: 'audio_keyboard_response',
    stimulus: breathingAudio,
    prompt: prompt,
    choices: [],
    response_ends_trial: false,
    trial_ends_after_audio: true,
    on_load: () => {
      pdSpotEncode(code)
    },
    on_finish: (data) => {
      data.code = code
    }
  }
}

export default blockEnd
