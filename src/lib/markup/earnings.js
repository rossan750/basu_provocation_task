import { formatDollars } from '../utils'

const earningsDisplay = (earnings) => {
  const bclass = (earnings >= 0) ? 'success' : 'danger'
  return (
    `<div class='task-container'>
    <h1 class='text-${bclass}'>${formatDollars(earnings)}</h1>
    </div>`
  )
}

export {
  earningsDisplay
}
