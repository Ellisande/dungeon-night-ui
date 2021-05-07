import firebase from "firebase";
import { config } from "../firebaseConfig";

function getApp() {
  if (!firebase.apps.length) {
    return firebase.initializeApp(config);
  } else {
    return firebase.apps[0];
  }
}

export { getApp as getFirebaseApp };
