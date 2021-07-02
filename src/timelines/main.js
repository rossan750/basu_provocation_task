import experimentStart from "../trials/experimentStart";
import holdUpMarker from "../trials/holdUpMarker";
import taskBlock from "./taskBlock";
import taskSetUp from "./taskSetUp";
import { instructions1, instructions2 } from "../trials/instructions";
import adjustVolume from "../trials/adjustVolume";
import camera from "../trials/camera";

import {
  VIDEO,
  MTURK,
  VOLUME,
  defaultBlockSettings,
  practiceBlockSettings,
  USE_EEG,
} from "../config/main";

let timeline = [experimentStart()];

if (VOLUME) timeline.push(adjustVolume());

if (VIDEO) timeline.push(camera());

if (USE_EEG) timeline.push(holdUpMarker());

timeline.push(
  taskSetUp(defaultBlockSettings),
  instructions1,
  taskBlock(practiceBlockSettings),
  instructions2
);

const primaryTimeline = timeline;

const mturkTimeline = [];

export const tl = MTURK ? mturkTimeline : primaryTimeline;
