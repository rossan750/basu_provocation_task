export const fixationHTML = (color) => {
  if (color) {
    return '<div class="task-container"><div id="fixation-dot" class="color-green"> </div></div>'
  } else {
    return '<div class="task-container"><div id="fixation-dot" class="color-white"> </div></div>'
  }
}
