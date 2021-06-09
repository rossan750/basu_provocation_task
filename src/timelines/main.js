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

const setupTimeline = async () => {
  let timeline = [experimentStart()];

  if (VOLUME) timeline.push(adjustVolume());
  
  if (VIDEO) timeline.push(camera());
  
  if (USE_EVENT_MARKER) timeline.push(holdUpMarker());

  const settings = await defaultBlockSettings();
  
  timeline.push(
    settings,
    instructions1,
    taskBlock(practiceBlockSettings),
    instructions2
  );

  return timeline;
}

const primaryTimeline = setupTimeline();

console.log("Primary timeline:", primaryTimeline)

const mturkTimeline = [];

export const tl = MTURK ? mturkTimeline : primaryTimeline;
