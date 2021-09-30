// config/main.js
// This is the main configuration file where universal and default settings should be placed.
// These settins can then be imported anywhere in the app as they are exported at the botom of the file.

import { jsPsych } from "jspsych-react";
import _ from "lodash";
import { eventCodes } from "./trigger";
import requireContext from "require-context.macro";

// is this mechanical turk?
const USE_MTURK = !jsPsych.turk.turkInfo().outsideTurk;
const USE_VIDEO = process.env.REACT_APP_VIDEO === "true";
const USE_FIREBASE = process.env.REACT_APP_FIREBASE === "true";
let USE_ELECTRON = true;

try {
  window.require("electron");
} catch {
  USE_ELECTRON = false;
}

// whether or not to ask the participant to adjust the volume
const USE_VOLUME = process.env.REACT_APP_VOLUME === "true";
// whether or not to set a frame in the Electron window, see electron.js
const HIDE_FRAME_ELECTRON = process.env.REACT_APP_HIDE_FRAME_ELECTRON === "true" && USE_ELECTRON;
// whether or not the EEG/event marker is available
const USE_EEG = process.env.REACT_APP_USE_EEG === "true" && USE_ELECTRON;
// whether or not the photodiode is in use
const USE_PHOTODIODE = process.env.REACT_APP_USE_PHOTODIODE === "true" && USE_ELECTRON;

const BREATHING_AUDIO = process.env.REACT_APP_BREATHING_AUDIO || "breathing_exercise"

const imageSettings = {
  width: 600,
  height: 600,
};

// how many of each type of image are required if loading images from disk
const numRequiredImages = 10;

// import images
const importAll = (r) => {
  return r.keys().map(r);
};

// audio codes
const audioCodes = {
  frequency: 100 * (eventCodes.open_provoc_task - 9),
  type: "sine",
};

// UPDATE THIS PATH TO CHANGE IMAGE FOLDER
const neutralImages = importAll(
  requireContext(
    "../assets/images/provocation-images/neutral",
    false,
    /\.(png|jpe?g|svg)$/
  )
);
const provokingImages = importAll(
  requireContext(
    "../assets/images/provocation-images/provoking",
    false,
    /\.(png|jpe?g|svg)$/
  )
);

const practiceImages = importAll(
  requireContext(
    "../assets/images/practice-images/neutral",
    false,
    /\.(png|jpe?g|svg)$/
  )
);

const audio = importAll(
  requireContext("../assets/audio", false, /\.(m4a|mp3)$/)
);

const breathingAudio = _.filter(audio, (o) =>
  o.includes(BREATHING_AUDIO)
)[0];

console.log(breathingAudio);

const ratingSettings = {
  min: 0,
  max: 10,
  canvasSize: 640, // canvas is a square
  circleRadius: 28,
  cursorRadius: 7.5,
};

// get language file
const lang = require("../language/en_us.json");
if (USE_MTURK) {
  // if this is mturk, merge in the mturk specific language
  const mlang = require("../language/en_us.mturk.json");
  _.merge(lang, mlang);
}

const defaultBlockSettings = {
  num_repeats: 2, // how many blocks to have
  images: {
    neutral: neutralImages,
    provoking: provokingImages,
  },
  repeats_per_condition: 3, // number of times every condition is repeated
  is_practice: false,
};

const practiceBlockSettings = {
  images: {
    neutral: practiceImages,
    provoking: [],
  },
  repeats_per_condition: 1, // number of times every condition is repeated
  is_practice: true,
};

const taskName = "Provocation";

const envConfig = {
  USE_MTURK,
  USE_VIDEO,
  USE_ELECTRON,
  USE_FIREBASE,
  USE_EEG,
  HIDE_FRAME_ELECTRON,
  USE_PHOTODIODE,
  USE_VOLUME
}

export {
  envConfig,
  imageSettings,
  numRequiredImages,
  ratingSettings,
  defaultBlockSettings,
  lang,
  eventCodes,
  practiceBlockSettings,
  importAll,
  breathingAudio,
  audioCodes,
  taskName,
};
