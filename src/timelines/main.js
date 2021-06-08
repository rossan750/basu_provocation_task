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
  defaultBlockSettings,
  practiceBlockSettings,
  USE_EVENT_MARKER,
} from "../config/main";

let timeline = [experimentStart()];

if (VOLUME) timeline.push(adjustVolume());

if (VIDEO) timeline.push(camera());

if (USE_EVENT_MARKER) timeline.push(holdUpMarker());

timeline.push(
  taskSetUp(defaultBlockSettings),
  instructions1,
  taskBlock(practiceBlockSettings),
  instructions2
);

const primaryTimeline = timeline;

const mturkTimeline = [];

export const tl = MTURK ? mturkTimeline : primaryTimeline;
