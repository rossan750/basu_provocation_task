import buildCountdown from '../trials/countdown'
import preamble from './preamble'
import experimentEnd from '../trials/experimentEnd'
import taskBlock from './taskBlock'
import userId from '../trials/userId'
import instructions1 from '../trials/instructions1'
import instructions2 from '../trials/instructions2'

import { MTURK, defaultBlockSettings, practiceBlockSettings } from '../config/main'


const primaryTimeline = [
        userId(defaultBlockSettings),
        preamble,
	instructions1,
	taskBlock(practiceBlockSettings),
	instructions2,
        buildCountdown("Provocation starts in:", 3),
        taskBlock(defaultBlockSettings),
        experimentEnd(5000)
        ]

const mturkTimeline = [
        userId(defaultBlockSettings),
        preamble,
        buildCountdown("The tutorial block starts in:", 3),
        taskBlock(defaultBlockSettings),
        experimentEnd(3000)
        ]

export const tl = (MTURK) ? mturkTimeline : primaryTimeline
