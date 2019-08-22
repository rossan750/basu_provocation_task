// config/main.js
// This is the main configuration file where universal and default settings should be placed.
// These settins can then be imported anywhere in the app as they are exported at the botom of the file.

import { jsPsych } from 'jspsych-react'
import _ from 'lodash'
import { eventCodes } from './trigger'

// mapping of letters to key codes
const keys = {
	"A": 65,
	"B": 66,
	"C": 67,
	"F": 70,
	"J": 74,
	"space": 32
}

// is this mechanical turk?
const MTURK = (!jsPsych.turk.turkInfo().outsideTurk)

const imageSettings = {
	width: 600,
	height: 600
}

// import images
const importAll = (r) => {
  return r.keys().map(r);
}

// UPDATE THIS PATH TO CHANGE IMAGE FOLDER
const images = importAll(require.context('../assets/images/test-images', false, /\.(png|jpe?g|svg)$/));

const practiceImages = importAll(require.context('../assets/images/test-images', false, /\.(png|jpe?g|svg)$/));

const ratingSettings = {
	max: 10,
	canvasSize: 640, // canvas is a square
	circleRadius: 30,
	cursorRadius: 15
}

// get language file
const lang = require('../language/en_us.json')
if (process.env.MTURK) { // if this is mturk, merge in the mturk specific language
  const mlang = require('../language/en_us.mturk.json')
	_.merge(lang, mlang)
}

const defaultBlockSettings = {
	images: images,
	repeats_per_condition: 1, // number of times every condition is repeated
	is_practice: false,
	is_tutorial: false,
	photodiode_active: false
}

const practiceBlockSettings = {
	images: practiceImages,
	repeats_per_condition: 1, // number of times every condition is repeated
	is_practice: false,
	is_tutorial: false,
	photodiode_active: false
}

export {
	keys,
	imageSettings,
	ratingSettings,
	defaultBlockSettings,
	lang,
	eventCodes,
	MTURK,
	defaultBlockSettings
}
