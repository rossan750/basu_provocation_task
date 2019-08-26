import buildCountdown from '../trials/countdown'
import preamble from './preamble'
import taskBlock from './taskBlock'
import userId from '../trials/userId'

import { MTURK, defaultBlockSettings } from '../config/main'


const primaryTimeline = [
        userId(defaultBlockSettings),
        preamble,
        buildCountdown("Provocation starts in:", 3),
        taskBlock(defaultBlockSettings)
        ]

const mturkTimeline = [
        userId(defaultBlockSettings),
        preamble,
        buildCountdown("The tutorial block starts in:", 3),
        taskBlock(defaultBlockSettings)
        ]

export const tl = (MTURK) ? mturkTimeline : primaryTimeline
