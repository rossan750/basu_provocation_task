import React, { useState, useEffect, useCallback } from "react";
import { jsPsych } from "jspsych-react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { getTurkUniqueId, sleep } from "./lib/utils";
import { initParticipant, addToFirebase } from "./firebase"
import { envConfig } from "./config/main"
import JsPsychExperiment from "./components/JsPsychExperiment"
import Login from "./components/Login"
import { version } from "../package.json";

function App() {
  const [loggedIn, setLogin] = useState(false);
  const [ipcRenderer, setRenderer] = useState(false);
  const [psiturk, setPsiturk] = useState(false);
  const [participantID, setParticipantID] = useState("");
  const [studyID, setStudyID] = useState("");
  const [envParticipantId, setEnvParticipantId] = useState("");
  const [envStudyId, setEnvStudyId] = useState("");
  const [currentMethod, setMethod] = useState("default");

  const startDate = new Date().toISOString();

  const query = new URLSearchParams(window.location.search);

  // Validation functions for desktop case and firebase
  const defaultValidation = async () => {
    return true;
  };
  const firebaseValidation = (participantId, studyId) => {
    return initParticipant(participantId, studyId, startDate);
  };

  // Adding data functions for firebase, electron adn Mturk
  const defaultFunction = () => {};
  const firebaseUpdateFunction = (data) => {
    addToFirebase(data);
  };
  const desktopUpdateFunction = (data) => {
    ipcRenderer.send("data", data);
  };
  const psiturkUpdateFunction = (data) => {
    psiturk.recordTrialData(data);
  };

  // On finish functions for electron, Mturk
  const desktopFinishFunction = () => {
    ipcRenderer.send("end", "true");
  };
  const psiturkFinishFunction = () => {
    const completePsiturk = async () => {
      psiturk.saveData();
      await sleep(5000);
      psiturk.completeHIT();
    };
    completePsiturk();
  };
  const defaultFinishFunction = () => {
    jsPsych.data.get().localSave('csv', 'neuro-task.csv')
  }

  // Function to add jspsych data on login
  const setLoggedIn = useCallback(
    (newLoggedIn, newStudyID, newParticipantID) => {
      if (newLoggedIn) {
        jsPsych.data.addProperties({
          participant_id: newParticipantID,
          study_id: newStudyID,
          start_date: startDate,
          timestamp: Date.now(),
          task_version: version
        });
      }
      setParticipantID(newParticipantID);
      setStudyID(newStudyID);
      setLogin(newLoggedIn);
    },
    [startDate]
  );

  // Login logic
  useEffect(() => {
    // For testing and debugging purposes
    console.log("Environment configuration:", envConfig);

    // If on desktop
    if (envConfig.USE_ELECTRON) {
      const electron = window.require("electron");
      const renderer = electron.ipcRenderer;
      setRenderer(renderer);
      renderer.send("updateEnvironmentVariables", envConfig);
      // If at home, fill in fields based on environment variables
      const credentials = renderer.sendSync("syncCredentials");
      if (credentials.envParticipantId) {
        setEnvParticipantId(credentials.envParticipantId);
      }
      if (credentials.envStudyId) {
        setEnvStudyId(credentials.envStudyId);
      }
      setMethod("desktop");
      // If online
    } else {
      if (envConfig.USE_MTURK) {
        /* eslint-disable */
        window.lodash = _.noConflict();
        const turkId = getTurkUniqueId();
        setPsiturk(new PsiTurk(turkId, "/complete"));
        setMethod("mturk");
        setLoggedIn(true, "mturk", turkId);
        /* eslint-enable */
      }
      // If firebase
      else if (envConfig.USE_FIREBASE) {
        setMethod("firebase");
        // Autologin with query parameters
        const participantId = query.get("participantID");
        const studyId = query.get("studyID");
        if (participantId) {
          setEnvParticipantId(participantId)
        }
        if (studyId) {
          setEnvStudyId(studyId)
        }
      }
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {loggedIn ? (
        <JsPsychExperiment
          dataUpdateFunction={
            {
              desktop: desktopUpdateFunction,
              firebase: firebaseUpdateFunction,
              mturk: psiturkUpdateFunction,
              default: defaultFunction,
            }[currentMethod]
          }
          dataFinishFunction={
            {
              desktop: desktopFinishFunction,
              mturk: psiturkFinishFunction,
              firebase: defaultFunction,
              default: defaultFinishFunction,
            }[currentMethod]
          }
          participantID={participantID}
          studyID={studyID}
        />
      ) : (
        <Login
          validationFunction={
            {
              desktop: defaultValidation,
              default: defaultValidation,
              firebase: firebaseValidation,
            }[currentMethod]
          }
          envParticipantId={envParticipantId}
          envStudyId={envStudyId}
          onLogin={setLoggedIn}
        />
      )}
    </>
  );
}

export default App;
