import React from "react";
import { Experiment } from "jspsych-react";
import { tl } from "../timelines/main";
import { breathingAudio } from "../config/main"

function JsPsychExperiment({ dataUpdateFunction, dataFinishFunction }) {
  return (
    <div className="App">
      <Experiment
        settings={{
          timeline: tl,
          preload_audio: [breathingAudio],
          on_data_update: (data) => dataUpdateFunction(data),
          on_finish: (data) => dataFinishFunction(data),
        }}
      />
    </div>
  );
}

export default JsPsychExperiment;