// Event trigger settings - used in both the react app (renderer) and the electron app (main)

// NOTE: THIS FILE IS A DUPLICATE OF /src/config/trigger.js - MAKE SURE THEY MATCH

const manufacturer = 'Teensyduino'
const vendorId = '16c0'
const productId = '0483'

const eventCodes = {
	open_provoc_task: 13,
	fixation: 1,
	evidence: 5,
	show_ratings: 7,
	rate: 2
}

// this is module.exports isntead of just exports as it is also imported into the electron app
module.exports = {
	manufacturer,
	vendorId,
	productId,
	eventCodes
}
