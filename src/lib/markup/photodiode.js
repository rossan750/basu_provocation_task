import { AT_HOME, MTURK, eventCodes  } from  '../../config/main'
import $ from 'jquery'

// conditionally load electron and psiturk based on MTURK config variable
const isElectron = !MTURK
let ipcRenderer = false;
if (isElectron) {
  const electron = window.require('electron');
  ipcRenderer  = electron.ipcRenderer;
}

// Relies on styling in App.css, generate PD spot
const photodiodeGhostBox = () => {
	const class_ = (MTURK | AT_HOME) ? 'invisible' : 'visible'

  const markup = `<div class="photodiode-box ${class_}" id="photodiode-box">
									<span id="photodiode-spot" class="photodiode-spot"></span>
  								</div>`
	return markup
}

const pdSpotEncode = (taskCode) => {
  function pulse_for(ms, callback) {
      $('.photodiode-spot').css({"background-color": "white"})
      setTimeout(() => {
        $('.photodiode-spot').css({"background-color": "black"})
        callback()
      }, ms)
    }

    function repeat_pulse_for(ms, i) {
      if (i > 0) {
        pulse_for(ms, () => {
          setTimeout(() => {
            repeat_pulse_for(ms, i-1)
          }, ms)
        })
      }
    }

	if (!MTURK) {
		const blinkTime = 40
		let numBlinks = taskCode
    if (taskCode < eventCodes.open_provoc_task) numBlinks = 1;
		repeat_pulse_for(blinkTime, numBlinks)
    if (ipcRenderer) {
      ipcRenderer.send("trigger", taskCode)
      setTimeout(function(){ipcRenderer.send('trigger', 0)}, 5)
    }
	}
}

export {
	photodiodeGhostBox,
	pdSpotEncode
}
