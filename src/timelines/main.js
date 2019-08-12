import buildCountdown from '../trials/countdown'
import preamble from './preamble'
import experimentEnd from '../trials/experimentEnd'
import taskBlock from './taskBlock'
import userId from '../trials/userId'

import { MTURK, defaultBlockSettings } from '../config/main'
import { practiceBlock } from '../config/practice'
import { tutorialBlock } from '../config/tutorial'
import { exptBlock1, exptBlock2 } from '../config/experiment'



const primaryTimeline = [
        userId(exptBlock1),
        preamble,
        buildCountdown("Provocation starts in:", 3),
        taskBlock(defaultBlockSettings),
        experimentEnd(5000)
        ]

const mturkTimeline = [
        userId(exptBlock1),
        preamble,
        buildCountdown("The tutorial block starts in:", 3),
        taskBlock(tutorialBlock),
        buildCountdown("The main block starts in:", 3),
        taskBlock(exptBlock2),
        experimentEnd(3000)
        ]

export const tl = (MTURK) ? mturkTimeline : primaryTimeline
