
export const env = 'development'

// Config for firebase
export const firebase = {
  apiKey: "AIzaSyDf9mR0ispFuFSCYUI65lugGRIb1xRvRds",
  authDomain: "club-mba.firebaseapp.com",
  databaseURL: "https://club-mba.firebaseio.com",
  projectId: "club-mba",
  storageBucket: "club-mba.appspot.com",
  messagingSenderId: "746007003891"
}

// Config for react-redux-firebase
// For more details, visit https://prescottprue.gitbooks.io/react-redux-firebase/content/config.html
export const reduxFirebase = {
  // collection within Firestore to which user profiles are written (would be
  // RTDB without useFirestoreForProfile)
  userProfile: 'users',
  // Profile data is located within Firestore instead of Real Time Database
  useFirestoreForProfile: true,
   // place metadata about storage uploads into Firestore
   // when calling uploadFiles or uploadFile with a third argument
  useFirestoreForStorageMeta: true,
  enableLogging: false, // enable/disable Firebase Database Logging
  updateProfileOnLogin: false, // enable/disable updating of profile on login
  attachAuthIsReady: false
  // profileDecorator: (userData) => ({ email: userData.email }) // customize format of user profile
}

export default { env, firebase, reduxFirebase }
