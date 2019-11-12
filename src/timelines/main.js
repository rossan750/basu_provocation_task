import userId from '../trials/userId'
import experimentStart from '../trials/experimentStart'
import holdUpMarker from '../trials/holdUpMarker'
import taskBlock from './taskBlock'
import taskSetUp from './taskSetUp'
import { instructions1, instructions2 } from '../trials/instructions'

import { MTURK, defaultBlockSettings, practiceBlockSettings} from '../config/main'



const primaryTimeline = [
        experimentStart(),
        userId(),
        holdUpMarker(),
        taskSetUp(defaultBlockSettings), // start pd code + get local images, add block to end of timeline
        instructions1,
        taskBlock(practiceBlockSettings),
        instructions2
        ]

const mturkTimeline = []

export const tl = (MTURK) ? mturkTimeline : primaryTimeline
