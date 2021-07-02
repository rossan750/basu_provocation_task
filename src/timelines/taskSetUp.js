import path from "path";
import { jsPsych } from "jspsych-react";
import { getObjectURLs } from "../firebase";
import {
  lang,
  numRequiredImages,
  IS_ELECTRON,
  USE_EEG,
  FIREBASE,
} from "../config/main";
import experimentEnd from "../trials/experimentEnd";
import blockEnd from "../trials/blockEnd";
import buildCountdown from "../trials/countdown";
import startCode from "../trials/startCode";
import taskBlock from "./taskBlock";

let app = false;
let fs = false;
let ipcRenderer = false;

/**
 * Sets the experiment images from the Firebase storage bucket.
 * @param {Object} blockSettings An object containing the settings for the experiment block.
 * The function updates this object's "images" field to contain the images from Firebase.
 */
 const getFirebaseImages = async () => {
  const participantID = jsPsych.data.get().select("participant_id").values[0];
  const studyID = jsPsych.data.get().select("study_id").values[0];
  const newImages = {
    neutral: [],
    provoking: []
  }
  newImages.neutral = await getObjectURLs(participantID, studyID, "neutral");
  newImages.provoking = await getObjectURLs(participantID, studyID, "provoking")
  return newImages;
};

const checkNumImages = (newImages) => {
  // check the number of loaded imaegs matches what is expected
  let numNeutral = newImages.neutral.length;
  let numProvoking = newImages.provoking.length;
  if (numNeutral !== numRequiredImages || numProvoking !== numRequiredImages) {
    if (IS_ELECTRON) {
      ipcRenderer.send(
        "error",
        `Number of images provided does not meet requirement.  Found ${numNeutral} neutral images and ${numProvoking} provoking images, the settings for this task requires ${numRequiredImages} of each type.`
      );
    } else {
      alert(
        `Number of images provided does not meet requirement.  Found ${numNeutral} neutral images and ${numProvoking} provoking images, the settings for this task requires ${numRequiredImages} of each type. Please reload and try again.`
      );
    }
  }
};

const setImages = async () => {
  if (IS_ELECTRON) {
    app = window.require("electron").remote.app;
    fs = window.require("fs");
    const electron = window.require("electron");
    ipcRenderer = electron.ipcRenderer;
    try {
      const participantID = jsPsych.data.get().select("participant_id")
        .values[0];
      const localImagePath = path.join(
        app.getPath("desktop"),
        "provocation-images",
        `${participantID}`
      );
      const neutralImagePath = path.join(localImagePath, "neutral");
      const provokingImagePath = path.join(localImagePath, "provoking");

      let neutralItems = fs.readdirSync(neutralImagePath);
      let provokingItems = fs.readdirSync(provokingImagePath);
      const newImages = {
        neutral: [],
        provoking: [],
      };
      newImages.neutral = neutralItems.map(
        (image) => `file://` + path.join(neutralImagePath, image)
      );
      newImages.provoking = provokingItems.map(
        (image) => `file://` + path.join(provokingImagePath, image)
      );

      console.log(`Loaded images from ${localImagePath}`);
      checkNumImages(newImages);
      return newImages;
    } catch (error) {
      console.log("Error loading local files - using default images");
      ipcRenderer.send(
        "error",
        `Could not load images from local device. - ${error}`
      );
    }
  } else if (FIREBASE) {
    const newImages = await getFirebaseImages();
    checkNumImages(newImages);
    return newImages;
  }
};

const taskSetUp = (blockSettings) => {
  let addTasks = {
    type: "html_keyboard_response",
    trial_duration: 1,
    stimulus: "",
    prompt: "",
    on_start: async () => {
      const newImages = await setImages(blockSettings);

      blockSettings.images.neutral = newImages.neutral;
      blockSettings.images.provoking = newImages.provoking;

      let i = 1;
      while (i <= blockSettings.num_repeats) {
        jsPsych.addNodeToEndOfTimeline(
          buildCountdown(lang.countdown.message, 3),
          () => {}
        );
        jsPsych.addNodeToEndOfTimeline(taskBlock(blockSettings), () => {});

        // if last block, add experiment end, otherwise add a break
        if (i < blockSettings.num_repeats) {
          jsPsych.addNodeToEndOfTimeline(
            blockEnd(i, blockSettings.num_repeats),
            () => {}
          );
        } else {
          jsPsych.addNodeToEndOfTimeline(experimentEnd(5000), () => {});
        }

        i += 1;
      }
      console.log("jspsych:", jsPsych);
    },
  };

  console.log("addTasks:", addTasks);

  return {
    type: "html_keyboard_response",
    timeline: USE_EEG ? [addTasks, startCode()] : [addTasks],
  };
};

export default taskSetUp;
