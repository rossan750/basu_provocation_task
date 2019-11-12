import taskTrial from './taskTrial'
import { generateStartingOpts } from '../lib/taskUtils'


const taskBlock = (blockSettings) => {

	const startingOpts = generateStartingOpts(blockSettings)
	let timeline = startingOpts.map( (image) => taskTrial(image))

	return {
		type: 'html_keyboard_response',
		timeline: timeline
	}
}

export default taskBlock
