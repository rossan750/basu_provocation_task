import firebase from "firebase/app";
import "firebase/firestore";

require("dotenv").config();
const COLLECTION_NAME = "participant_responses";
const config = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  projectId: process.env.REACT_APP_projectId || "no-firebase",
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
};
// Initialize firebase app
firebase.initializeApp(config);
// Get the firestore instance, and use the emulator if running locally
let db = firebase.firestore();
if (window.location.hostname === "localhost") {
  db.useEmulator("localhost", 8080);
}

// Add participant data and trial data to db
const initParticipant = (participantId, studyId, startDate) => {
  // return promise with value true if participant and study id match, false otherwise
    return db.collection(COLLECTION_NAME)
    .doc(studyId)
    .collection('participants')
    .doc(participantId)
    .collection('data')
    .doc(startDate)
    .set({start_time: startDate, app_version: window.navigator.appVersion, app_platform: window.navigator.platform, results: []})
    .then(()=>{
      return true
    })
    .catch((error) => {
      return false
    });
};

// create a document in the collection with a random id
const createFirebaseDocumentRandom = () => {
  console.log("Creating a document with a random ID");
  db.collection(COLLECTION_NAME).add({ dateCreated: new Date() });
};

// add individual trials to db
const addToFirebase = (data) => {
  console.log("Adding to Firebase", data);
  const participantID = data.participant_id;
  const studyID = data.study_id;
  const startDate = data.start_date;
  db.collection(COLLECTION_NAME)
    .doc(studyID)
    .collection("participants")
    .doc(participantID)
    .collection("data")
    .doc(startDate)
    .update('results', firebase.firestore.FieldValue.arrayUnion(data))
    .then(() => console.log("Successfully added to Firebase"))
    .catch(error => console.error("Error adding to Firebase:", error))
};

// Export types that exists in Firestore
// This is not always necessary, but it's used in other examples
const { TimeStamp, GeoPoint } = firebase.firestore;
export {
  db,
  TimeStamp,
  GeoPoint,
  COLLECTION_NAME,
  initParticipant,
  addToFirebase,
  createFirebaseDocumentRandom,
};

export default firebase;
