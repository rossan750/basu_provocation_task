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
    taskSetUp(defaultBlockSettings), // start pd code + get local images, add block to end of timeline
    instructions1,
    taskBlock(practiceBlockSettings),
    instructions2,
    experimentEnd()
    ]
}
else if (AT_HOME && VIDEO) {
  timeline = [
    experimentStart(),
    userId(),
    adjustVolume(),
    camera(),
    taskSetUp(defaultBlockSettings), // start pd code + get local images, add block to end of timeline
    instructions1,
    taskBlock(practiceBlockSettings),
    instructions2,
    experimentEnd()
    ]
}
else {
  timeline = [
    experimentStart(),
    userId(),
    adjustVolume(),
    holdUpMarker(),
    taskSetUp(defaultBlockSettings), // start pd code + get local images, add block to end of timeline
    instructions1,
    taskBlock(practiceBlockSettings),
    instructions2
    ]
}

const primaryTimeline = timeline

const mturkTimeline = []

export const tl = (MTURK) ? mturkTimeline : primaryTimeline
