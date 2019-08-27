import buildCountdown from '../trials/countdown'
import preamble from './preamble'
import taskBlock from './taskBlock'
import userId from '../trials/userId'
import { MTURK, defaultBlockSettings, lang } from '../config/main'


const primaryTimeline = [
        userId(defaultBlockSettings),
        preamble,
        buildCountdown(lang.countdown.message, 3),
        taskBlock(defaultBlockSettings) // includes experimentEnd
        ]

const mturkTimeline = [
        userId(defaultBlockSettings),
        preamble,
        buildCountdown(lang.countdown.message, 3),
        taskBlock(defaultBlockSettings) // includes experimentEnd
        ]

export const tl = (MTURK) ? mturkTimeline : primaryTimeline
