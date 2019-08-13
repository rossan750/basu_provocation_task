import { triggerPort, eventCodes, keys } from '../config/main'
import { fixationHTML } from '../lib/markup/fixation'
import { photodiodeGhostBox, pdSpotEncode } from '../lib/markup/photodiode'
import { jsPsych } from 'jspsych-react'
import $ from 'jquery'
import * as _ from 'lodash'


const degToRad = (degrees) =>  Math.PI / 180 * degrees

const CANVAS_SIZE = 640
const CIRCLE_RADIUS = 30
const CURSOR_RADIUS = 15

const canvasHTML = `<canvas width="${CANVAS_SIZE}" height="${CANVAS_SIZE}" id="jspsych-canvas">
    Your browser does not support HTML5 canvas
  </canvas>`

const getCircles = (width, height, n) => {
  const center = CANVAS_SIZE / 2
  const r = center * 0.85

  const slice = Math.PI / (n-1)

  let circles = _.range(n).map( (val) => {
    let theta = slice * val - Math.PI / 2
    let x = r * Math.sin(theta) + center
    let y = r * Math.cos(theta) + center
    return {n: val+1, x: x, y: y}
  })

  return circles
}

const isColliding = (x1, y1, x2, y2) => {
  let dx = x1 - x2;
  let dy = y1 - y2;
  let distance = Math.sqrt(dx * dx + dy * dy);

  if ( distance < (CIRCLE_RADIUS + CURSOR_RADIUS) ) {
    return true
  } else {
    return false
  }
}

const getCircle = (x, y, circles) => {

  for(var i=0; i<circles.length; i++) {
    let c = circles[i]
    if ( isColliding(c.x, c.y, x, y) ) {
      return c
    }
  }

  return null
}

const drawNumbers = (ctx, circles) => {
  var ang;
  var num;
  ctx.font = CANVAS_SIZE * 0.07 + "px arial";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  circles.forEach( (circle) => {
    // draw circle
    ctx.fillStyle = "#D3D3D3"; // light grey
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, CIRCLE_RADIUS, 0, degToRad(360), true);
    ctx.fill();

    // draw text
    ctx.fillStyle = "#000000" // black
    ctx.fillText(circle.n.toString(), circle.x, circle.y + 3.5);
  })
}

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

            let canvas = document.querySelector('#jspsych-canvas');
            let ctx = canvas.getContext('2d');

            let w = $('#jspsych-canvas').width()
            let x = w / 2

            let h = $('#jspsych-canvas').height()
            let y = h / 2

            let circles = getCircles(w, h, 10)

            const canvasDraw = () => {
              // ctx.fillStyle = "black";
              ctx.clearRect(0, 0, canvas.width, canvas.height);

              drawNumbers(ctx, circles )

              ctx.fillStyle = "#f00";
              ctx.beginPath();
              ctx.arc(x, y, CURSOR_RADIUS, 0, degToRad(360), true);
              ctx.fill();
            }
            canvasDraw();

            canvas.requestPointerLock()

            let animation
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

                if (!animation) {
                  animation = requestAnimationFrame(function() {
                    animation = null;
                    canvasDraw();
                  });
                }
            }

            const handleClickListener = (e) => {
                let circle = getCircle(x, y, circles)

                if (circle) {
                  document.exitPointerLock()

                  pdSpotEncode(rateCode)

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
