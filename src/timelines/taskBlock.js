import taskTrial from './taskTrial'
import { generateStartingOpts } from '../lib/taskUtils'

const taskBlock = (blockSettings) => {
  // initialize block
	const startingOpts = generateStartingOpts(blockSettings)

	// timeline = loop through trials
	let timeline = startingOpts.map( (image) => taskTrial(blockSettings, image))

  return {
		type: 'html_keyboard_response',
		timeline: timeline
	}
}

export default taskBlock
