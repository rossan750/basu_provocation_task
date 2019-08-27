import { eventCodes, imageSettings } from '../config/main'
import { photodiodeGhostBox, pdSpotEncode } from '../lib/markup/photodiode'
import $ from 'jquery'
import { jitter50 } from '../lib/utils'


const showImage = (image, duration) => {
  const code = eventCodes.evidence

  return {
    type: 'image_keyboard_response',
    stimulus: image,
    prompt: photodiodeGhostBox(),
    response_ends_trial: false,
    trial_duration: jitter50(duration),
    on_load: () => {
      $('#jspsych-image-keyboard-response-stimulus').addClass('image')
      $('#jspsych-image-keyboard-response-stimulus').height(imageSettings.height)
      $('#jspsych-image-keyboard-response-stimulus').width(imageSettings.width)
      pdSpotEncode(code)
    },
    on_finish: (data) => data.code = code
  }
}

export default showImage
