import taskTrial from './taskTrial'
import path from 'path'
import { jsPsych } from 'jspsych-react'
import { MTURK } from '../config/main'
import experimentEnd from '../trials/experimentEnd'

const isElectron = !MTURK
let app = false
let fs = false
if ( isElectron ) {
	app = window.require('electron').remote.app
	fs = window.require('fs')
}

const taskBlock = (blockSettings) => {

  return {
		type: 'html_keyboard_response',
		trial_duration: 1,
		stimulus: '',
		prompt: '',
		on_start: (trial) => {
			if ( app ) {
				try {
					const patientID = jsPsych.data.get().select('patient_id').values[0]
					const localImagePath = path.join(app.getPath('desktop'), `${patientID}`, 'images')

					let items = fs.readdirSync(localImagePath)
					blockSettings.images = items.map( (image) => `file://` + path.join(localImagePath, image))

					console.log(`Loaded images from ${localImagePath}`)
				} catch {
					console.log("Error loading local files - using default images")
				}
			} else {
				console.log("remote not required")
			}

			// initialize block
			const startingOpts = blockSettings.images

			// timeline = loop through trials
			let timeline = startingOpts.map( (image) => taskTrial(blockSettings, image))

			jsPsych.addNodeToEndOfTimeline({
				type: 'html_keyboard_response',
				timeline: timeline,
				randomize_order: true,
				repeats_per_condition: blockSettings.repeats_per_condition
			}, () => {})
			//
			jsPsych.addNodeToEndOfTimeline(experimentEnd(50000), () => {})
		}
	}
}

export default taskBlock
