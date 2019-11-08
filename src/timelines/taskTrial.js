// import trials
import fixation from '../trials/fixation'
import showImage from '../trials/showImage'
import rateImage from '../trials/rateImage'

const taskTrial = (condition) => {

  // timeline
  let timeline = [
    // show condition
    fixation(2000, true, false, true), // jittered, white, hidden cursor
    fixation(200, false, true, true), // not jittered, green, hidden cursor
    showImage(condition, 3000),

    // end the trial
    rateImage()
  ]

    return {
  		type: 'html_keyboard_response',
  		timeline: timeline
  	}
}

export default taskTrial
