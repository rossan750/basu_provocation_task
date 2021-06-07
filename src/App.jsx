import React, { useState, useEffect, useCallback } from "react";
import { jsPsych } from "jspsych-react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { getTurkUniqueId, sleep } from "./lib/utils";
import { initParticipant, addToFirebase } from "./firebase"
import { MTURK, FIREBASE, IS_ELECTRON, VIDEO } from "./config/main"
import JsPsychExperiment from "./components/JsPsychExperiment"
import Login from "./components/Login"

function App() {
  const [loggedIn, setLogin] = useState(false);
  const [ipcRenderer, setRenderer] = useState(false);
  const [psiturk, setPsiturk] = useState(false);
  const [envParticipantId, setEnvParticipantId] = useState("");
  const [envStudyId, setEnvStudyId] = useState("");
  const [currentMethod, setMethod] = useState("default");
  const [reject, setReject] = useState(false);

  const startDate = new Date().toISOString();

  // Validation functions for desktop case and firebase
  const defaultValidation = async () => {
    return true;
  };
  const firebaseValidation = (participantId, studyId) => {
    return initParticipant(participantId, studyId, startDate);
  };

  // Adding data functions for firebase, electron adn Mturk
  const defaultFunction = (data) => {};
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

  // Function to add jspsych data on login
  const setLoggedIn = useCallback(
    (newLoggedIn, studyId, participantId) => {
      if (newLoggedIn) {
        jsPsych.data.addProperties({
          participant_id: participantId,
          study_id: studyId,
          start_date: startDate,
        });
      }
      setLogin(newLoggedIn);
    },
    [startDate]
  );

  // Login logic
  useEffect(() => {
    // For testing and debugging purposes
    console.log("Turk:", MTURK);
    console.log("Firebase:", FIREBASE);
    console.log("Electron:", IS_ELECTRON);
    console.log("Video:", VIDEO);

    // If on desktop
    if (IS_ELECTRON) {
      const electron = window.require("electron");
      const renderer = electron.ipcRenderer;
      setRenderer(renderer);
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
      // If MTURK
      if (MTURK) {
        /* eslint-disable */
        window.lodash = _.noConflict();
        const turkId = getTurkUniqueId();
        setPsiturk(new PsiTurk(turkId, "/complete"));
        setMethod("mturk");
        setLoggedIn(true, "mturk", turkId);
        /* eslint-enable */
      }
      // If firebase
      else if (FIREBASE) {
        setMethod("firebase");
      } else {
        setReject(true);
      }
    }
  }, [setLoggedIn]);

  if (reject) {
    return (
      <div className="centered-h-v">
        <div className="width-50 alert alert-danger">
          Please tell your task provider to enable Firebase.
        </div>
      </div>
    );
  } else {
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
                default: defaultFunction,
              }[currentMethod]
            }
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
}

export default App;
