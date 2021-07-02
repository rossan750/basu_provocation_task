import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";

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

/**
 * Gets the download URLs for all objects in a Firebase storage folder. These can be
 * referenced in a src tag to display the objects, if they are images.
 * @param {string} participantID The participant ID.
 * @param {string} studyID The study ID.
 * @param {string} folderType The type of folder, either "neutral" or "provoking".
 * @returns An array of promises, each containing a download URL for an object.
 */
const getObjectURLs = async (participantID, studyID, folderType) => {
  const folderURL = `${studyID}/${participantID}/${folderType}`;
  const storage = firebase.storage();
  const ref = storage.ref(folderURL);
  const objects = await ref.listAll();
  let URLs = objects.items.map(async (item) => await item.getDownloadURL());
  return await Promise.all(URLs);
};

// Add participant data and trial data to db
const initParticipant = (participantId, studyId, startDate) => {
  // return promise with value true if participant and study id match, false otherwise
  return db
    .collection(COLLECTION_NAME)
    .doc(studyId)
    .collection("participants")
    .doc(participantId)
    .collection("data")
    .doc(startDate)
    .set({
      start_time: startDate,
      app_version: window.navigator.appVersion,
      app_platform: window.navigator.platform,
      results: [],
    })
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
};

// create a document in the collection with a random id
const createFirebaseDocumentRandom = () => {
  db.collection(COLLECTION_NAME).add({ dateCreated: new Date() });
};

// add individual trials to db
const addToFirebase = (data) => {
  const participantID = data.participant_id;
  const studyID = data.study_id;
  const startDate = data.start_date;
  db.collection(COLLECTION_NAME)
    .doc(studyID)
    .collection("participants")
    .doc(participantID)
    .collection("data")
    .doc(startDate)
    .update("results", firebase.firestore.FieldValue.arrayUnion(data))
    .then(() => {
      return true;
    })
    .catch((error) => {
      console.error("Error adding to Firebase:", error);
      return false;
    });
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

export { getObjectURLs };
export default firebase;
