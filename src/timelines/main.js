import buildCountdown from '../trials/countdown'
import preamble from './preamble'
import userId from '../trials/userId'
import taskBlock from './taskBlock'
import { instructions1, instructions2 } from '../trials/instructions'

import { MTURK, defaultBlockSettings, practiceBlockSettings, lang } from '../config/main'



const primaryTimeline = [
        preamble,
        userId(),
        instructions1,
        taskBlock(practiceBlockSettings),
        instructions2,
        buildCountdown(lang.countdown.message, 3),
        taskBlock(defaultBlockSettings)
        ]

const mturkTimeline = [
        userId(),
        preamble,
        buildCountdown(lang.countdown.message, 3),
        taskBlock(defaultBlockSettings)
        ]

export const tl = (MTURK) ? mturkTimeline : primaryTimeline
