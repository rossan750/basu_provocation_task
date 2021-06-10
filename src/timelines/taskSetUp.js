import path from "path";
import { jsPsych } from "jspsych-react";
import firebase from "../firebase";
import {
  lang,
  numRequiredImages,
  IS_ELECTRON,
  USE_EVENT_MARKER,
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

const getFirebaseImages = async (blockSettings) => {
  const storage = firebase.storage();
  const participantID = jsPsych.data.get().select("participant_id")
        .values[0];
  const studyID = jsPsych.data.get().select("study_id").values[0];
  const neutralRef = storage.refFromURL(
    `gs://borton-task-provocation.appspot.com/${studyID}/participants/${participantID}/neutral`
  );
  const provokingRef = storage.refFromURL(
    `gs://borton-task-provocation.appspot.com/${studyID}/participants/${participantID}/provoking`
  );
  const neutralObjects = await neutralRef.listAll();
  let neutralURLs = [];
  neutralObjects.items.forEach((item) => {
    neutralURLs.push(item.getDownloadURL())
  });
  blockSettings.images.neutral = await Promise.all(neutralURLs);
  const provokingObjects = await provokingRef.listAll();
  let provokingURLs = [];
  provokingObjects.items.forEach((item) => {
    provokingURLs.push(item.getDownloadURL());
  });
  blockSettings.images.provoking = await Promise.all(provokingURLs)
};

const setImages = async (blockSettings) => {
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
      blockSettings.images.neutral = neutralItems.map(
        (image) => `file://` + path.join(neutralImagePath, image)
      );
      blockSettings.images.provoking = provokingItems.map(
        (image) => `file://` + path.join(provokingImagePath, image)
      );

      // check the number of loaded imaegs matches what is expected
      let numNeutral = blockSettings.images.neutral.length;
      let numProvoking = blockSettings.images.provoking.length;
      if (
        numNeutral !== numRequiredImages ||
        numProvoking !== numRequiredImages
      ) {
        ipcRenderer.send(
          "error",
          `Number of images provided does not meet requirement.  Found ${numNeutral} neutral images and ${numProvoking} provoking images, the settings for this task requires ${numRequiredImages} of each type.`
        );
      }

      console.log(`Loaded images from ${localImagePath}`);
    } catch (error) {
      console.log("Error loading local files - using default images");
      ipcRenderer.send(
        "error",
        `Could not load images from local device. - ${error}`
      );
    }
  } else if (FIREBASE) {
    blockSettings.images.neutral = [];
    blockSettings.images.provoking = [];
    await getFirebaseImages(blockSettings);
  }
};

const taskSetUp = (blockSettings) => {
  let addTasks = {
    type: "html_keyboard_response",
    trial_duration: 1,
    stimulus: "",
    prompt: "",
    on_start: async () => {
      await setImages(blockSettings);

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
    timeline: USE_EVENT_MARKER ? [addTasks] : [addTasks, startCode()],
  };
};

export default taskSetUp;
