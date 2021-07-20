import path from 'path'
import { getObjectURLs } from '../firebase'
import {
  envConfig,
  numRequiredImages
} from '../config/main'

let app = false
let fs = false
let ipcRenderer = false

/**
 * Sets the experiment images from the Firebase storage bucket.
 * The function updates this object's "images" field to contain the images from Firebase.
 */
const getFirebaseImages = async (participantID, studyID) => {
  const newImages = {
    neutral: [],
    provoking: []
  }
  newImages.neutral = await getObjectURLs(participantID, studyID, 'neutral')
  newImages.provoking = await getObjectURLs(participantID, studyID, 'provoking')
  return newImages
}

const checkNumImages = (newImages) => {
  // check the number of loaded images matches what is expected
  let numNeutral = newImages.neutral.length
  let numProvoking = newImages.provoking.length
  if (numNeutral !== numRequiredImages || numProvoking !== numRequiredImages) {
    const errorMessage = `Number of images provided does not meet requirement.  Found ${numNeutral} neutral images and ${numProvoking} provoking images, the settings for this task requires ${numRequiredImages} of each type.`
    if (envConfig.USE_ELECTRON) {
      ipcRenderer.send(
        'error',
        errorMessage
      )
    } else {
      alert(
        errorMessage
      )
    }
  }
}

const getLocalImages = (participantID, category) => {
  const localImagePath = path.join(
    app.getPath('desktop'),
    'provocation-images',
    `${participantID}`
  )

  const imagePath = path.join(localImagePath, category)
  const items = fs.readdirSync(imagePath)
  return items.map(
    (image) => `file://` + path.join(imagePath, image)
  )
}

const getImages = async (participantID) => {
  if (envConfig.USE_ELECTRON) {
    app = window.require('electron').remote.app
    fs = window.require('fs')
    const electron = window.require('electron')
    ipcRenderer = electron.ipcRenderer
    try {
      const newImages = {};
      newImages.neutral = getLocalImages(participantID, 'neutral')
      newImages.provoking = getLocalImages(participantID, 'provoking')

      checkNumImages(newImages)
      return newImages
    } catch (error) {
      console.warn('Error loading local files - using default images')
      ipcRenderer.send(
        'error',
        `Could not load images from local device. - ${error}`
      )
    }
  } else if (envConfig.USE_FIREBASE) {
    const newImages = await getFirebaseImages()
    checkNumImages(newImages)
    return newImages
  }
}

export { getImages }
