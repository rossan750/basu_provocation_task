import React, { useState, useEffect } from "react"
import { Experiment } from "jspsych-react"
import { tl } from "../timelines/main"
import { breathingAudio } from "../config/main"

function JsPsychExperiment ({ dataUpdateFunction, dataFinishFunction, participantID, studyID }) {
  const [timeline, setTimeline] = useState([])

  useEffect(() => {
    tl(participantID, studyID).then((newTimeline) => setTimeline(newTimeline))
  }, [participantID, studyID])

  if (timeline.length === 0) {
    return (
      <div className="App height-100">
        <div className="centered-h-v">Loading task</div>
      </div>
    )
  } else {
    return (
      <div className="App">
        <Experiment
          settings={{
            timeline: timeline,
            preload_audio: [breathingAudio],
            on_data_update: (data) => dataUpdateFunction(data),
            on_finish: (data) => dataFinishFunction(data),
          }}
        />
      </div>
    )
  }
}

export default JsPsychExperiment