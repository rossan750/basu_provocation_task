import { eventCodes, ratingSettings } from '../config/main'
import { photodiodeGhostBox, pdSpotEncode } from '../lib/markup/photodiode'
import { getCircles, getCircle, drawNumbers, drawPrompt } from '../lib/taskUtils'
import $ from 'jquery'

// make sure cursor radius is such that it can only touch one circle at a time
const CANVAS_SIZE = ratingSettings.canvasSize
const CIRCLE_RADIUS = ratingSettings.circleRadius
const CURSOR_RADIUS = ratingSettings.cursorRadius

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

        const start = Date.now()

        // add stimulus to the DOM
        document.getElementById('jspsych-content').innerHTML = stimulus
        $('#jspsych-content').addClass('task-container')

        // set up canvas
        let canvas = document.querySelector('#jspsych-canvas');
        let ctx = canvas.getContext('2d');
        let animation

        // cross-browser compatibility
        canvas.requestPointerLock = canvas.requestPointerLock ||
                                    canvas.mozRequestPointerLock;
        document.exitPointerLock = document.exitPointerLock    ||
                                   document.mozExitPointerLock;

        let w = $('#jspsych-canvas').width()
        let x = w / 2
        let dx = 0 // start at rest

        let h = $('#jspsych-canvas').height()
        let y = h / 2
        let dy = 0 // start at rest

        let path = []
        const rt = () => Date.now() - start
        const addToPath = () => path.push({x: x, y: y, elapsed: rt()})
        addToPath()

        let circles = getCircles(ratingSettings.min, ratingSettings.max, CANVAS_SIZE)

        const canvasDraw = () => {
          // transparent background
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          drawPrompt(ctx, rt(), CANVAS_SIZE)

          drawNumbers(ctx, circles, CIRCLE_RADIUS, x, y, CURSOR_RADIUS)

          // draw the cursor
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(x, y, CURSOR_RADIUS, 0, 2 * Math.PI, true);
          ctx.fill();
        }
        // show ratings
        canvasDraw();
        pdSpotEncode(showCode)

        // make sure canvas re-draws at 10 seconds to get prompt
        setTimeout(canvasDraw, 10000)

        // request control of the cursor from the dom
        canvas.requestPointerLock()

        const handleMoveListener = (e) => {
          x += e.originalEvent.movementX;
          y += e.originalEvent.movementY;

          // if direction changes, add to path
          let newdx = Math.sign(e.originalEvent.movementX)
          let newdy = Math.sign(e.originalEvent.movementY)

          let updated = false
          if ( newdx !== dx && newdx !== 0 ) {
            addToPath()
            dx = newdx
            updated = true
          }

          if ( newdy !== dy && newdy !== 0 ) {
            if (!updated) addToPath()
            dy = newdy
          }

          // keep circle in canvas
          if (x > canvas.width - CURSOR_RADIUS) {
            x = canvas.width - CURSOR_RADIUS;
          }
          if (y > canvas.height - CURSOR_RADIUS) {
            y = canvas.height - CURSOR_RADIUS;
          }
          if (x < CURSOR_RADIUS) {
            x = CURSOR_RADIUS;
          }
          if (y < CURSOR_RADIUS) {
            y = CURSOR_RADIUS;
          }

          // re-draw with updates
          if (!animation) {
            animation = requestAnimationFrame( () => {
              animation = null;
              canvasDraw();
            });
          }
        }

        const handleClickListener = (e) => {
            // find circle that was clicked (or null if none)
            let circle = getCircle(x, y, CURSOR_RADIUS, circles, CIRCLE_RADIUS)

            if (circle) { // rating complete
              const end_rt = rt()
              pdSpotEncode(rateCode)

              // add final click spot to path
              addToPath()

              // return control of mouse
              document.exitPointerLock()

              // free event listeners
              $(document).unbind('mousemove', handleMoveListener)
              $(document).unbind('click', handleClickListener)

              setTimeout(
                  () => done({circle: circle, click: {x: x, y: y}, code: [showCode, rateCode], rt: end_rt, path: path}),
                  500)
            }
        }

        // Bind event listener to document
        $(document).bind('mousemove', handleMoveListener)
        $(document).bind('click', handleClickListener)
      }
    }
}

export default rateImage
