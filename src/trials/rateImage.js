import _ from 'lodash'
import { triggerPort, eventCodes, keys } from '../config/main'
import { fixationHTML } from '../lib/markup/fixation'
import { photodiodeGhostBox, pdSpotEncode } from '../lib/markup/photodiode'
import { jsPsych } from 'jspsych-react'
import $ from 'jquery'


const degToRad = (degrees) =>  Math.PI / 180 * degrees

const canvasHTML = `<canvas width="640" height="640" id="jspsych-canvas">
    Your browser does not support HTML5 canvas
  </canvas>`

const rateImage = () => {
    let stimulus = `<div style='margin-bottom: -200px'>${fixationHTML}</div>
                    ${photodiodeGhostBox()}`


    return {
        type: 'call_function',
        async: true,
        func: (done) => {
            // send trigger events
            // const showCode = eventCodes.show_buttons
            // const betCode = eventCodes.bet
            // const drawCode = eventCodes.draw


            // pdSpotEncode(showCode)

            // add stimulus to the DOM
            document.getElementById('jspsych-content').innerHTML = stimulus
            document.getElementById('jspsych-content').innerHTML = canvasHTML

            let canvas = document.querySelector('#jspsych-canvas');
            let ctx = canvas.getContext('2d');

            const RADIUS = 15;

            let x = $('#jspsych-canvas').width() / 2;
            let y = $('#jspsych-canvas').height() / 2;

            function canvasDraw() {
              ctx.fillStyle = "black";
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.fillStyle = "#f00";
              ctx.beginPath();
              ctx.arc(x, y, RADIUS, 0, degToRad(360), true);
              ctx.fill();
            }
            canvasDraw();

            canvas.requestPointerLock()

            let animation
            const handleMoveListener = (e) => {
                console.log(x)
                console.log(y)
                console.log(e)
                // done({})
                x += e.originalEvent.movementX;
                y += e.originalEvent.movementY;
                if (x > canvas.width + RADIUS) {
                  x = -RADIUS;
                }
                if (y > canvas.height + RADIUS) {
                  y = -RADIUS;
                }
                if (x < -RADIUS) {
                  x = canvas.width + RADIUS;
                }
                if (y < -RADIUS) {
                  y = canvas.height + RADIUS;
                }

                if (!animation) {
                  animation = requestAnimationFrame(function() {
                    animation = null;
                    canvasDraw();
                  });
                }
            }

            const handleClickListener = (event) => {
                document.exitPointerLock()

                done({something: 'I did something'})
            }

            // Bind event listener to document
            $(document).bind('mousemove', handleMoveListener)
            $(document).bind('click', handleClickListener)
        }
    }
}

export default rateImage
