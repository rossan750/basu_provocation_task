import taskTrial from './taskTrial'
import { generateStartingOpts } from '../lib/taskUtils'

const taskBlock = (blockSettings) => {
  // initialize block
	const startingOpts = generateStartingOpts(blockSettings)

	// is this needed?
  const blockDetails = {
	  block_earnings: 0.0,
		optimal_earnings: 0.0,
		continue_block: true
	}

	// timeline = loop through trials
	let timeline = startingOpts.map( (image) => taskTrial(blockSettings, blockDetails, image))

  return {
		type: 'html_keyboard_response',
		timeline: timeline
	}
}

export default taskBlock
