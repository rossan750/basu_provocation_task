import experimentStart from "../trials/experimentStart";
import holdUpMarker from "../trials/holdUpMarker";
import taskBlock from "./taskBlock";
import taskSetUp from "./taskSetUp";
import { instructions1, instructions2 } from "../trials/instructions";
import adjustVolume from "../trials/adjustVolume";
import camera from "../trials/camera";

import {
  envConfig,
  defaultBlockSettings,
  practiceBlockSettings,
} from "../config/main";

let timeline = [experimentStart()];

if (envConfig.USE_VOLUME) timeline.push(adjustVolume());

if (envConfig.USE_VIDEO) timeline.push(camera());

if (envConfig.USE_EEG) timeline.push(holdUpMarker());

timeline.push(
  taskSetUp(defaultBlockSettings),
  instructions1,
  taskBlock(practiceBlockSettings),
  instructions2
);

const primaryTimeline = timeline;

const mturkTimeline = [];

export const tl = envConfig.USE_MTURK ? mturkTimeline : primaryTimeline;
