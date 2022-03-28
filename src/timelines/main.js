import taskBlock from "./taskBlock";
import experimentStart from "../trials/experimentStart";
import holdUpMarker from "../trials/holdUpMarker";
import { instructions1, instructions2 } from "../trials/instructions";
import adjustVolume from "../trials/adjustVolume";
import camera from "../trials/camera";
import buildCountdown from '../trials/countdown'
import blockEnd from '../trials/blockEnd'
import experimentEnd from '../trials/experimentEnd'
import requestLock from '../trials/requestLock'
import releaseLock from '../trials/releaseLock'
import startCode from '../trials/startCode'
import {
  envConfig,
  defaultBlockSettings,
  practiceBlockSettings, lang,
} from '../config/main'
import { getImages } from '../lib/taskSetUpUtils'

const taskSetUp = async (participantID, studyID, blockSettings) => {
  const newImages = await getImages(participantID, studyID)

  if (newImages) {
    blockSettings.images.neutral = newImages.neutral
    blockSettings.images.provoking = newImages.provoking
  } else {
    blockSettings.images = defaultBlockSettings.images
  }

  let newBlocks = []
  for (let i = 1; i <= blockSettings.num_repeats; i++) {
    newBlocks.push(
      buildCountdown(lang.countdown.message, 3),
      taskBlock(blockSettings)
    )
    if (i < blockSettings.num_repeats) {
      newBlocks.push(
        blockEnd(i, blockSettings.num_repeats)
      )
    }
  }

  return newBlocks
}

const tl = async (participantID, studyID) => {
  let timeline = [experimentStart()];
  
  if (envConfig.USE_EEG) timeline.push(startCode());

  if (envConfig.USE_VOLUME) timeline.push(adjustVolume());

  if (envConfig.USE_VIDEO) timeline.push(camera());

  if (envConfig.USE_EEG) timeline.push(holdUpMarker());

  timeline.push(
    instructions1,
    requestLock(),
    taskBlock(practiceBlockSettings),
    releaseLock(),
    instructions2
  );

  const newBlocks = await taskSetUp(participantID, studyID, defaultBlockSettings)

  timeline.push(requestLock())
  timeline.push(...newBlocks)
  timeline.push(releaseLock())

  timeline.push(experimentEnd(5000))

  const primaryTimeline = timeline;

  const mturkTimeline = [];

  return envConfig.USE_MTURK ? mturkTimeline : primaryTimeline
}

export { tl }
