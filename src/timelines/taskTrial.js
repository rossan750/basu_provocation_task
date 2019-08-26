// import trials
import fixation from '../trials/fixation'
import showImage from '../trials/showImage'
import rateImage from '../trials/rateImage'

const taskTrial = (blockSettings, blockDetails, condition) => {

  // timeline
  let timeline = [
    // show condition
    fixation(2000),
    fixation(200, false, true), // not jittered, green
    showImage(condition, 1001),

    // end the trial
    rateImage()
  ]

    return {
  		type: 'html_keyboard_response',
  		timeline: timeline
  	}
}

export default taskTrial
