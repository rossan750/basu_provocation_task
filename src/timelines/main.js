import experimentStart from "../trials/experimentStart";
import holdUpMarker from "../trials/holdUpMarker";
import taskBlock from "./taskBlock";
import { instructions1, instructions2 } from "../trials/instructions";
import adjustVolume from "../trials/adjustVolume";
import camera from "../trials/camera";
import {
  envConfig,
  defaultBlockSettings,
  practiceBlockSettings, lang,
} from '../config/main'
import buildCountdown from '../trials/countdown'
import blockEnd from '../trials/blockEnd'
import experimentEnd from '../trials/experimentEnd'
import { getImages } from '../lib/taskSetUpUtils'

const taskSetUp = async (participantID, studyID, blockSettings) => {
  const newImages = await getImages(participantID)

  blockSettings.images.neutral = newImages.neutral
  blockSettings.images.provoking = newImages.provoking

  let newBlocks = []
  for (let i = 1; i < blockSettings.num_repeats; i++) {
    newBlocks.push(
      buildCountdown(lang.countdown.message, 3),
      taskBlock(blockSettings),
      blockEnd(i, blockSettings.num_repeats)
    )
  }
  newBlocks.push(experimentEnd(5000))
  console.log("New blocks:", newBlocks)

  return newBlocks
}

const tl = async (participantID, studyID) => {
  let timeline = [experimentStart()];

  if (envConfig.USE_VOLUME) timeline.push(adjustVolume());

  if (envConfig.USE_VIDEO) timeline.push(camera());

  if (envConfig.USE_EEG) timeline.push(holdUpMarker());

  timeline.push(
    instructions1,
    taskBlock(practiceBlockSettings),
    instructions2
  );

  const newBlocks = await taskSetUp(participantID, studyID, defaultBlockSettings)

  for (let i = 0; i < newBlocks.length; i++) {
    timeline.push(newBlocks[i])
  }

  const primaryTimeline = timeline;

  const mturkTimeline = [];

  return envConfig.USE_MTURK ? mturkTimeline : primaryTimeline
}

export { tl }