import * as FirebaseModule from 'firebase';
import 'firebase/firestore'
import firebaseConfig from '../constants/firebase';

const {
  apiKey,
  authDomain,
  databaseURL,
  storageBucket,
  messagingSenderId,
  projectId,
} = firebaseConfig;

let firebaseInitialized = false;

if (
  apiKey !== 'null' &&
  authDomain !== 'null' &&
  databaseURL !== 'null' &&
  storageBucket !== 'null' &&
  messagingSenderId !== 'null'
) {
  FirebaseModule.initializeApp({
    ...firebaseConfig
  });
  FirebaseModule.firestore().settings({})
  firebaseInitialized = true;
}

export const Firebase = firebaseInitialized ? FirebaseModule : null;
export const Firestore = firebaseInitialized ? FirebaseModule.firestore() : null;
export const FirebaseStorage = firebaseInitialized ? FirebaseModule.storage().ref() : null;

