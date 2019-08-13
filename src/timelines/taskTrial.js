// import trials
import fixation from '../trials/fixation'
import showImage from '../trials/showImage'
import rateImage from '../trials/rateImage'

const taskTrial = (blockSettings, blockDetails, condition) => {

  // timeline
  let timeline = [
    // show condition
    fixation(650),
    showImage(condition, 1001),
    fixation(650),
    // end the trial
    rateImage()
  ]

    return {
  		type: 'html_keyboard_response',
  		timeline: timeline
  	}
}

export default taskTrial
