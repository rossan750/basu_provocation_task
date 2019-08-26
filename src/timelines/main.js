import buildCountdown from '../trials/countdown'
import preamble from './preamble'
import experimentEnd from '../trials/experimentEnd'
import taskBlock from './taskBlock'
import userId from '../trials/userId'

import { MTURK, defaultBlockSettings } from '../config/main'


const primaryTimeline = [
        userId(defaultBlockSettings),
        preamble,
        buildCountdown("Provocation starts in:", 3),
        taskBlock(defaultBlockSettings),
        experimentEnd(5000)
        ]

const mturkTimeline = [
        userId(defaultBlockSettings),
        preamble,
        buildCountdown("The tutorial block starts in:", 3),
        taskBlock(defaultBlockSettings),
        experimentEnd(5000)
        ]

export const tl = (MTURK) ? mturkTimeline : primaryTimeline
