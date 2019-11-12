// Event trigger settings - used in both the react app (renderer) and the electron app (main)

// NOTE: THESE CODES MUST MATCH public/config/trigger.js - MAKE SURE THE CODES MATCH

const eventCodes = {
	open_provoc_task: 13,
	fixation: 1,
	evidence: 5,
	show_ratings: 7,
	rate: 2,
	start_break: 8,
	test_connect: 32
}

// this is module.exports isntead of just exports as it is also imported into the electron app
module.exports = {
	eventCodes
}
