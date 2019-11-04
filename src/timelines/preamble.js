import experimentStart from '../trials/experimentStart'
import startCode from '../trials/startCode'
import zoom from '../trials/zoom'
import welcome from '../trials/welcome'

const preamble = {
  type: 'html_keyboard_response',
  stimulus: '',
  timeline: [experimentStart(), startCode()]
}

export default preamble
