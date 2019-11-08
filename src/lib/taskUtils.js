// utilities specific to this app/task
import _ from 'lodash'
import { shuffleArray, deepCopy, randomTrue } from './utils'

// initialize starting conditions for each trial within a block
// each repetition set is independently randomized then concatenated
// no more than 3 images from a set can repeat in a row
const generateStartingOpts = (b) => {
	let startingOptions = []

	for (let i = 0; i < b.repeats_per_condition; i++) {
		let neutralImages = shuffleArray(deepCopy(b.images.neutral))
		let provokingImages = shuffleArray(deepCopy(b.images.provoking))

		while (neutralImages.length > 0 && provokingImages.length > 0) {
			if (neutralImages.length - provokingImages.length >= 3 ) {
				startingOptions.push(neutralImages.pop())
			} else if (provokingImages.length - neutralImages.length >= 3) {
				startingOptions.push(provokingImages.pop())
			} else if ( randomTrue() ) {
				startingOptions.push(neutralImages.pop())
			} else {
				startingOptions.push(provokingImages.pop())
			}
		}

		startingOptions.push(...neutralImages)
		startingOptions.push(...provokingImages)
	}

	return startingOptions
}

const getCircles = (start, stop, size) => {
  const center = size / 2
  const r = center * 0.85
	const n = stop - start + 1

  const slice = Math.PI / (n-1)

  let circles = _.range(start, stop + 1).map( (val) => {
    let theta = slice * val - Math.PI / 2
    let x = r * Math.sin(theta) + center
    let y = r * Math.cos(theta) + center
    return {n: val, x: x, y: y}
  })

  return circles
}

const isColliding = (x1, y1, r1, x2, y2) => {
  let dx = x1 - x2;
  let dy = y1 - y2;
  let distance = Math.sqrt(dx * dx + dy * dy);

  if ( distance < r1 ) {
    return true
  } else {
    return false
  }
}

const getCircle = (x, y, r, circles, circle_r) => {

  for(var i=0; i<circles.length; i++) {
    let c = circles[i]
    if ( isColliding(c.x, c.y, circle_r, x, y, r) ) {
      return c
    }
  }

  return null
}

const drawNumbers = (ctx, circles, radius, x, y, cursor_radius) => {
  ctx.font = radius * 0.8 + "px arial";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

	let hovered = getCircle(x, y, cursor_radius, circles, radius)

  circles.forEach( (circle) => {
    // draw circle
		if (circle === hovered) {
			ctx.fillStyle = "#778899" // medium grey
		} else {
    	ctx.fillStyle = "#D3D3D3"; // light grey
		}
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, radius, 0, 2 * Math.PI, true);
    ctx.fill();

    // draw text
    ctx.fillStyle = "#000000" // black
    ctx.fillText(circle.n.toString(), circle.x, circle.y + 3.5);
  })
}

const drawPrompt = (ctx, rt, size) => {
	// only draw if it's been 10 seconds
	if (rt < 10000) return

  ctx.font = 20 + "px arial";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  // draw text
  ctx.fillStyle = "#ffffff" // white
  ctx.fillText("Please select a rating", size / 2, size * .25);
}

const drawFixation = (ctx, size) => {
	ctx.fillStyle = "#ffffff";
	ctx.beginPath();
	ctx.arc(size/2, size/2, 7.5, 0, 2 * Math.PI, true);
	ctx.fill();
}

const drawCursor = (ctx, x, y, cursorSize) => {
	ctx.strokeWidth = 2;

	ctx.moveTo(x, y - cursorSize);
	ctx.lineTo(x, y + cursorSize);

	ctx.moveTo(x - cursorSize,  y);
	ctx.lineTo(x + cursorSize,  y);

	// Line color
	ctx.strokeStyle = '#a6a6a6';

	ctx.stroke();
}

export {
	generateStartingOpts,
	getCircles,
	getCircle,
	drawNumbers,
	drawPrompt,
	drawFixation,
	drawCursor
}
