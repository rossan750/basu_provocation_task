import { photodiodeGhostBox } from '../lib/markup/photodiode'
import { fixationHTML } from '../lib/markup/fixation'

const requestLock = () => {
    let stimulus = `<div class="task-container"><h1>Click the dot</h1>` + fixationHTML(false) + photodiodeGhostBox() + `</div>`

    return {
      type: 'call_function',
      async: true,
      func: (done) => {
        // add stimulus to the DOM
        const el = document.querySelector('#jspsych-content')
        el.innerHTML = stimulus

        // request control of the cursor from the dom
        el.requestPointerLock = el.requestPointerLock ||
                            el.mozRequestPointerLock;

        const clickHandler = () => {
          el.requestPointerLock()
          el.innerHTML = ''
          setTimeout(
            () => {
              done({lock_request: true})
            },
            500)
        };

        el.addEventListener('click', clickHandler, {once: true})
      }
    }
}

export default requestLock
