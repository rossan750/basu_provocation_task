// import trials
import fixation from '../trials/fixation'
import showImage from '../trials/showImage'
import taskEnd from '../trials/taskEnd'


const taskTrial = (blockSettings, blockDetails, condition) => {
  // initialize trial details
  let trialDetails = {
    condition: condition,
    trial_earnings: 0,
    start_time: Date.now()
  }

  // timeline
  let timeline = [
    // show condition
    fixation(650),
    showImage(condition, 3000),
    fixation(650),
    // end the trial
    taskEnd(trialDetails, 500)
  ]

    return {
  		type: 'html_keyboard_response',
  		timeline: timeline
  	}
}

export default taskTrial
