import { lang } from '../config/main'
import { baseStimulus } from '../lib/markup/stimuli'


const screenOne = baseStimulus(`
    <div class='instructions'>
    <h1>${lang.instructions.welcome}</h1>
    <p>${lang.instructions.p1}</p>
    <p>${lang.instructions.p2}</p>
    </div>
    `, true)

const screenTwo = baseStimulus(`
    <div class='instructions'>
    <p>${lang.instructions.fixation}</p>
    <div id="fixation-dot" class="color-white"></div>
    </div>
    `, true)

const screenThree = baseStimulus(`
    <div class='instructions'>
    <p>${lang.instructions.rate}</p>
    </div>
    `, true)

const screenFour = baseStimulus(`
    <div class='instructions'>
    <p>${lang.instructions.rate_practice}</p>
    </div>
    `, true)

const screenFive = baseStimulus(`
    <div class='instructions'>
    <p>${lang.instructions.no_talking}</p>
    </div>
    `, true)

const screenSix = baseStimulus(`
    <div class='instructions'>
    <p>${lang.instructions.instruction_end}</p>
    </div>
    `, true)

const instructions1 = {
  type: 'instructions',
  show_clickable_nav: true,
  pages: [
    screenOne,
    screenTwo,
    screenThree,
    screenFour,
  ]
}

const instructions2 = {
  type: 'instructions',
  show_clickable_nav: true,
  pages: [
    screenFive,
    screenSix,
  ]
}

export {
  instructions1,
  instructions2
}
