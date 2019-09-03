import buildCountdown from '../trials/countdown'
import preamble from './preamble'
import taskBlock from './taskBlock'
import userId from '../trials/userId'
import instructions1 from '../trials/instructions1'
import instructions2 from '../trials/instructions2'

import { MTURK, defaultBlockSettings, practiceBlockSettings, lang } from '../config/main'



const primaryTimeline = [
        userId(),
        preamble,
	      instructions1,
	      taskBlock(practiceBlockSettings),
	      instructions2,
        buildCountdown(lang.countdown.message, 3),
        taskBlock(defaultBlockSettings) // includes experimentEnd
        ]

const mturkTimeline = [
        userId(),
        preamble,
        buildCountdown(lang.countdown.message, 3),
        taskBlock(defaultBlockSettings) // includes experimentEnd
        ]

export const tl = (MTURK) ? mturkTimeline : primaryTimeline
