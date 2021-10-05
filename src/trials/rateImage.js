import { eventCodes, ratingSettings } from '../config/main'
import { photodiodeGhostBox, pdSpotEncode } from '../lib/markup/photodiode'
import { getCircles, getCircle, drawNumbers, drawPrompt, drawFixation, drawCursor } from '../lib/taskUtils'
import $ from 'jquery'

// make sure cursor radius is such that it can only touch one circle at a time
const CANVAS_SIZE = ratingSettings.canvasSize
const CIRCLE_RADIUS = ratingSettings.circleRadius
const CURSOR_RADIUS = ratingSettings.cursorRadius

const canvasHTML = `<canvas width="${CANVAS_SIZE}" height="${CANVAS_SIZE}" id="jspsych-canvas">
    Your browser does not support HTML5 canvas
  </canvas>`

const rateImage = () => {
    let stimulus = `<div class="task-container">` + canvasHTML + photodiodeGhostBox() + `</div>`

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

        // set up canvas
        let canvas = document.querySelector('#jspsych-canvas');
        let ctx = canvas.getContext('2d');
        let animation
        let clicked = false; // require user engagement to lock

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

          drawPrompt(ctx, rt(), CANVAS_SIZE, clicked)

          drawNumbers(ctx, circles, CIRCLE_RADIUS, x, y, CURSOR_RADIUS)

          drawFixation(ctx, CANVAS_SIZE)

          // draw the cursor
          drawCursor(ctx, x, y, CURSOR_RADIUS)
        }

        // request control of the cursor from the dom
        canvas.requestPointerLock = canvas.requestPointerLock ||
                            canvas.mozRequestPointerLock;

        document.exitPointerLock = document.exitPointerLock ||
                           document.mozExitPointerLock;

        const lockChangeAlert = (e) => {
          console.log(e)
          console.log(document.pointerLockElement)
          if (document.pointerLockElement === canvas ||
              document.mozPointerLockElement === canvas) {
            clicked = true;
            if (!animation) {
              animation = requestAnimationFrame(() => {
                animation = null;
                canvasDraw();
              });
            }
            // Bind event listener to document
            canvas.addEventListener("mousemove", handleMoveListener, false)
            canvas.addEventListener("click", handleClickListener, false)
          } else {
            canvas.removeEventListener("mousemove", handleMoveListener, false)
            canvas.removeEventListener("click", handleClickListener, false)
          }
        }

        document.addEventListener('pointerlockerror', (e) => {
          clicked = false;
          if (!animation) {
            animation = requestAnimationFrame(() => {
              animation = null;
              canvasDraw();
            });
          }
        }
          , false);
        document.addEventListener('pointerlockchange', lockChangeAlert, false);
        document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

        canvas.onclick = () => canvas.requestPointerLock();

        // show ratings
        canvasDraw();
        pdSpotEncode(showCode)

        // make sure canvas re-draws at 10 seconds to get prompt
        setTimeout(canvasDraw, 10000)
        let firstcall = true;
        const handleMoveListener = (e) => {
          if (firstcall) {
            console.log(e)
            console.log(x, y, dx, dy)
            firstcall = false
          }
          x += e.movementX;
          y += e.movementY;

          if (e.movementX > 10 || e.movementY > 10) {
            console.log(e)
          }

          // if direction changes, add to path
          let newdx = Math.sign(e.movementX)
          let newdy = Math.sign(e.movementY)

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
            animation = requestAnimationFrame(() => {
              animation = null;
              canvasDraw();
            });
          }
        }

        const handleClickListener = () => {
            // find circle that was clicked (or null if none)
            let circle = getCircle(x, y, CURSOR_RADIUS, circles, CIRCLE_RADIUS)

            if (circle) { // rating complete
              const end_rt = rt()
              pdSpotEncode(rateCode)

              // add final click spot to path
              addToPath()

              console.log("requesting pointer lock exit")
              document.exitPointerLock()

              setTimeout(
                  () => {
                    document.removeEventListener('pointerlockchange', lockChangeAlert, false);
                    document.removeEventListener('mozpointerlockchange', lockChangeAlert, false);
                    done({circle: circle, click: {x: x, y: y}, code: [showCode, rateCode], rt: end_rt, path: path})
                  },
                  500)
            }
        }
      }
    }
}

export default rateImage
