import userId from '../trials/userId'
import experimentStart from '../trials/experimentStart'
import experimentEnd from '../trials/experimentEnd'
import holdUpMarker from '../trials/holdUpMarker'
import taskBlock from './taskBlock'
import taskSetUp from './taskSetUp'
import { instructions1, instructions2 } from '../trials/instructions'
import adjustVolume from '../trials/adjustVolume'
import camera from '../trials/camera'

import { AT_HOME, VIDEO, MTURK, defaultBlockSettings, practiceBlockSettings} from '../config/main'

let timeline
if (AT_HOME && !VIDEO) {
  timeline = [
    experimentStart(),
    userId(),
    adjustVolume(),
    // THIS BLOCK MODIFIES THE TIMELINE ITSELF BY APPENDING A TASK BLOCK AND EXPERIMENT END. This is probably not ideal because it makes composition obscure.
    taskSetUp(defaultBlockSettings), // start pd code + get local images, add block to end of timeline
    instructions1,
    taskBlock(practiceBlockSettings),
    instructions2
    ]
}
else if (AT_HOME && VIDEO) {
  timeline = [
    experimentStart(),
    userId(),
    adjustVolume(),
    camera(),
    // THIS BLOCK MODIFIES THE TIMELINE ITSELF BY APPENDING  A TASK BLOCK AND EXPERIMENT END. This is probably not ideal because it makes composition obscure.
    taskSetUp(defaultBlockSettings), // start pd code + get local images, add block to end of timeline 
    instructions1,
    taskBlock(practiceBlockSettings),
    instructions2
    ]
}
else {
  timeline = [
    experimentStart(),
    userId(),
    adjustVolume(),
    holdUpMarker(),
    // THIS BLOCK MODIFIES THE TIMELINE ITSELF BY APPENDING A TASK BLOCK AND EXPERIMENT END. This is probably not ideal because it makes composition obscure.
    taskSetUp(defaultBlockSettings), // start pd code + get local images, add block to end of timeline
    instructions1,
    taskBlock(practiceBlockSettings),
    instructions2
    ]
}

const primaryTimeline = timeline

const mturkTimeline = []

export const tl = (MTURK) ? mturkTimeline : primaryTimeline
