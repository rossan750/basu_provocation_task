import { triggerPort, eventCodes, keys } from '../config/main'
import { fixationHTML } from '../lib/markup/fixation'
import { photodiodeGhostBox, pdSpotEncode } from '../lib/markup/photodiode'
import { jsPsych } from 'jspsych-react'
import { getCircles, getCircle, drawNumbers } from '../lib/taskUtils'
import $ from 'jquery'
import * as _ from 'lodash'

// make sure cursor radius is such that it can only touch one circle at a time
const CANVAS_SIZE = 640
const CIRCLE_RADIUS = 30
const CURSOR_RADIUS = 15

const canvasHTML = `<canvas width="${CANVAS_SIZE}" height="${CANVAS_SIZE}" id="jspsych-canvas">
    Your browser does not support HTML5 canvas
  </canvas>`


const rateImage = () => {
    let stimulus = canvasHTML + photodiodeGhostBox()

    return {
        type: 'call_function',
        async: true,
        func: (done) => {
            // send trigger events
            const showCode = eventCodes.show_ratings
            const rateCode = eventCodes.rate

            pdSpotEncode(showCode)

            const start = Date.now()

            // add stimulus to the DOM
            document.getElementById('jspsych-content').innerHTML = stimulus
            $('#jspsych-content').addClass('task-container')

            // set up canvas
            let canvas = document.querySelector('#jspsych-canvas');
            let ctx = canvas.getContext('2d');
            let animation

            let w = $('#jspsych-canvas').width()
            let x = w / 2

            let h = $('#jspsych-canvas').height()
            let y = h / 2

            let circles = getCircles(w, h, 10, CANVAS_SIZE)

            const canvasDraw = () => {
              // transparent background
              ctx.clearRect(0, 0, canvas.width, canvas.height);

              drawNumbers(ctx, circles, CIRCLE_RADIUS)

              // draw the cursor
              ctx.fillStyle = "#f00";
              ctx.beginPath();
              ctx.arc(x, y, CURSOR_RADIUS, 0, 2 * Math.PI, true);
              ctx.fill();
            }
            canvasDraw();

            // request control of the cursor from the dom
            canvas.requestPointerLock()

            const handleMoveListener = (e) => {
                x += e.originalEvent.movementX;
                y += e.originalEvent.movementY;

                // keep circle in canvas
                if (x > canvas.width + CURSOR_RADIUS) {
                  x = canvas.width - CURSOR_RADIUS;
                }
                if (y > canvas.height + CURSOR_RADIUS) {
                  y = canvas.height - CURSOR_RADIUS;
                }
                if (x < -CURSOR_RADIUS) {
                  x = CURSOR_RADIUS;
                }
                if (y < -CURSOR_RADIUS) {
                  y = CURSOR_RADIUS;
                }

                // re-draw with updates
                if (!animation) {
                  animation = requestAnimationFrame(function() {
                    animation = null;
                    canvasDraw();
                  });
                }
            }

            const handleClickListener = (e) => {
                // find circle that was clicked (or null if none)
                let circle = getCircle(x, y, CURSOR_RADIUS, circles, CIRCLE_RADIUS)

                if (circle) { // rating complete
                  // return control of mouse
                  document.exitPointerLock()

                  pdSpotEncode(rateCode)

                  // free event listeners
                  $(document).unbind('mousemove', handleMoveListener)
                  $(document).unbind('click', handleClickListener)

                  done({circle: circle, click: {x: x, y: y}, code: rateCode, rt: Date.now() - start})
                }
            }

            // Bind event listener to document
            $(document).bind('mousemove', handleMoveListener)
            $(document).bind('click', handleClickListener)
        }
    }
}

export default rateImage
