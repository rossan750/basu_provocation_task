import taskTrial from './taskTrial'
import path from 'path'
import { jsPsych } from 'jspsych-react'
import { MTURK } from '../config/main'
import experimentEnd from '../trials/experimentEnd'
import { generateStartingOpts } from '../lib/taskUtils'

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
					const localImagePath = path.join(app.getPath('desktop'), 'provocation-images', `${patientID}`)
					const neutralImagePath = path.join(localImagePath, 'neutral')
					const provokingImagePath = path.join(localImagePath, 'provoking')

					let neutralItems = fs.readdirSync(neutralImagePath)
					let provokingItems = fs.readdirSync(provokingImagePath)
					blockSettings.images.neutral = neutralItems.map( (image) => `file://` + path.join(neutralImagePath, image))
					blockSettings.images.provoking = provokingItems.map( (image) => `file://` + path.join(provokingImagePath, image))

					console.log(`Loaded images from ${localImagePath}`)
				} catch {
					console.log("Error loading local files - using default images")
				}
			}

			// initialize block
			const startingOpts = generateStartingOpts(blockSettings)

			// timeline = loop through trials
			let timeline = startingOpts.map( (image) => taskTrial(image))

			jsPsych.addNodeToEndOfTimeline({
				type: 'html_keyboard_response',
				timeline: timeline,
				randomize_order: true,
				repeats_per_condition: blockSettings.repeats_per_condition
			}, () => {})
			//
			jsPsych.addNodeToEndOfTimeline(experimentEnd(5000), () => {})
		}
	}
}

export default taskBlock
