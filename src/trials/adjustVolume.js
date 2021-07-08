import { lang } from '../config/main'
import { baseStimulus } from '../lib/markup/stimuli';

const adjustVolume = () => {
    const stimulus = baseStimulus(`
    <div class='instructions'>
    <h1>${lang.instructions.adjust_volume}</h1>
    </div>
    `, true)
    
    return {
        type: 'html_button_response',
        stimulus: stimulus,
        choices: [ lang.prompt.continue.button ],
        response_ends_trial: true
    }
}

export default adjustVolume