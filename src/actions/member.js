import ErrorMessages from '../constants/errors';
import statusMessage from './status';
import {Firebase, FirebaseStorage, Firestore} from '../lib/firebase';

/**
 * Sign Up to Firebase
 */
export function signUp(formData) {
  const {
    school,
    name,
    email,
    password,
    password2,
    phone,
    studentNum,
  } = formData;

  return dispatch => new Promise(async (resolve, reject) => {
    // Validation checks
    if (!school) return reject({ message: ErrorMessages.missingSchool });
    if (!name) return reject({ message: ErrorMessages.missingName });
    if (!email) return reject({ message: ErrorMessages.missingEmail });
    if (!password) return reject({ message: ErrorMessages.missingPassword });
    if (!password2) return reject({ message: ErrorMessages.missingPassword });
    if (!phone) return reject({ message: ErrorMessages.missingPhone });
    if (!studentNum) return reject({ message: ErrorMessages.missingStudentNum });
    if (password !== password2) return reject({ message: ErrorMessages.passwordsDontMatch });

    await statusMessage(dispatch, 'loading', true);

    // Go to Firebase
    return Firebase.auth()
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        // Send user details to Firebase database
        if (res && res.uid) {
          // FirebaseRef.child(`users/${res.uid}`).set({
          //   school,
          //   name,
          //   phone,
          //   studentNum,
          //   signedUp: Firebase.database.ServerValue.TIMESTAMP,
          //   lastLoggedIn: Firebase.database.ServerValue.TIMESTAMP,
          // }).then(() => statusMessage(dispatch, 'loading', false).then(resolve));
        }
      }).catch(reject);
  }).catch(async (err) => { await statusMessage(dispatch, 'error', err.message); throw err.message; });
}

/**
 * Get this User's Details
 */
function getUserData(dispatch) {
  const UID = (
    Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return false;

  const docRef = Firestore.collection("users").doc(UID);
  return docRef.get().then(doc => {
    return dispatch({
      type: 'USER_DETAILS_UPDATE',
      data: {...doc.data(),docId:doc.id},
    });
  });

  // const ref = FirebaseRef.child(`users/${UID}`);
  // return ref.on('value', (snapshot) => {
  //   const userData = snapshot.val() || [];

  //   return dispatch({
  //     type: 'USER_DETAILS_UPDATE',
  //     data: userData,
  //   });
  // });
}

export function getMemberData() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  // Ensure token is up to date
  return dispatch => new Promise((resolve) => {
    Firebase.auth().onAuthStateChanged((loggedIn) => {
      if (loggedIn) {
        return resolve(getUserData(dispatch));
      }

      return () => new Promise(() => resolve());
    });
  });
}
export function getMemberListData(member) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  // Ensure token is up to date
  return dispatch => new Promise(async (resolve) => {
    return resolve(Firestore.collection("scheduler").doc(member.universe)
      .get().then(async doc => {
        const userListSnapshots = await Firestore.collection("users").orderBy("name", 'asc').limit(10).get();
        let userList = [];
        userListSnapshots.docs.forEach(doc => {
          userList.push({...doc.data(), docId: doc.id});
        });
        const data = doc.data();
        return dispatch({
          type: 'SCHEDULER_OWNER_UPDATE',
          ownerList: data ? data.userList : [],
          userList: userList,
        });
      }));
  });
}

export function getSearchMemberList(name) {
  if (Firebase === null) return () => new Promise(resolve => resolve());
  return dispatch => new Promise( async (resolve) => {
    const documentSnapshots = await Firestore.collection("users").where('name', '==', name).get();

    let docList = [];
    documentSnapshots.docs.forEach(doc => {
      docList.push({...doc.data(), docId: doc.id});
    });
    return resolve(dispatch({
      type: 'SCHEDULER_SEARCH_LIST',
      searchUserList: docList,
    }));
  });
}

export function addStepMemberList(member) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => {
    return resolve(dispatch({
      type: 'ADD_STEP_MEMBER_LIST',
      member: member,
    }));
  });
}
export function removeStepMemberList(index) {
  if (Firebase === null) return () => new Promise(resolve => resolve());
  return dispatch => new Promise(resolve => {
    return resolve(dispatch({
      type: 'REMOVE_STEP_MEMBER_LIST',
      index: index,
    }));
  });
}
export function resetStepMemberList() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => {
    return resolve(dispatch({
      type: 'RESET_STEP_MEMBER_LIST',
      member: [],
    }));
  });
}


/**
 * Login to Firebase with Email/Password
 */
export function login(formData) {
  const {
    email,
    password,
  } = formData;

  return dispatch => new Promise(async (resolve, reject) => {
    await statusMessage(dispatch, 'loading', true);

    // Validation checks
    if (!email) return reject({ message: ErrorMessages.missingEmail });
    if (!password) return reject({ message: ErrorMessages.missingPassword });

    await Firebase.auth().setPersistence(Firebase.auth.Auth.Persistence.LOCAL);

    const res = await Firebase.auth().signInWithEmailAndPassword(email, password).catch(async err =>{
      await statusMessage(dispatch, 'loading', false);
      return reject({ message: ErrorMessages[err.code]});
    });
    if(!res){
      return reject();
    }
    if (res && res.user.uid) {
      Firestore.collection("users").doc(res.user.uid).set({
        lastLoggedIn: Date.now(),
      }, {merge: true}).catch(err => reject({ message: err }));
    }

    await getUserData(dispatch);
    await statusMessage(dispatch, 'loading', false);
    return resolve(dispatch({
      type: 'USER_LOGIN',
      data: res,
    }));

  }).catch(async (err) => { await statusMessage(dispatch, 'error', err.message);});
}

/**
 * Reset Password
 */
export function resetPassword(formData) {
  const { email } = formData;

  return dispatch => new Promise(async (resolve, reject) => {
    // Validation checks
    if (!email) return reject({ message: ErrorMessages.missingEmail });

    await statusMessage(dispatch, 'loading', true);

    // Go to Firebase
    return Firebase.auth()
      .sendPasswordResetEmail(email)
      .then(() => statusMessage(dispatch, 'loading', false).then(resolve(dispatch({ type: 'USER_RESET' }))))
      .catch(reject);
  }).catch(async (err) => { await statusMessage(dispatch, 'error', err.message); throw err.message; });
}

/**
 * Update Profile
 */
export function updateProfile(formData) {
  const {
    phone,
    company,
    isSingle,
    isProfileOpen,
    imageUrl,
    imageBlob,
  } = formData;
  let thumb = formData.thumb;
  return dispatch => new Promise(async (resolve, reject) => {
    const UID = Firebase.auth().currentUser.uid;
    if (!UID) return reject({ message: ErrorMessages.missingFirstName });

    await statusMessage(dispatch, 'loading', true);
    if(imageUrl && imageBlob){
      thumb = await FirebaseStorage.child('users/' + UID + '/' + imageBlob._55._data.name)
        .put(imageBlob._55)
        .then(async snapshot => await snapshot.ref.getDownloadURL());
      thumb = thumb.replace(imageBlob._55._data.name, 'thumb_' + imageBlob._55._data.name)
    }
    return Firestore.collection("users").doc(UID).set({ thumb, phone, company, isSingle, isProfileOpen}, {merge:true})
      .then(async () => {

        // Update Redux
        await getUserData(dispatch);
        await statusMessage(dispatch, 'success', '프로필 수정 완료');
        resolve();
      }).catch(reject);
  }).catch(async (err) => { await statusMessage(dispatch, 'error', err.message); throw err.message; });
}

export function changePassword(formData) {
  const {
    thumb,
    phone,
    company,
    isSingle,
    isProfileOpen,
  } = formData;

  return dispatch => new Promise(async (resolve, reject) => {
    const UID = Firebase.auth().currentUser.uid;
    if (!UID) return reject({ message: ErrorMessages.missingFirstName });

    await statusMessage(dispatch, 'loading', true);
    // return FirebaseRef.child(`users/${UID}`).update({ thumb, phone, company, isSingle, isProfileOpen})
    //   .then(async () => {
    //     // Update Email address
    //
    //     // Change the password
    //     if (changePassword) {
    //       await Firebase.auth().currentUser.updatePassword(password).catch(reject);
    //     }
    //
    //     // Update Redux
    //     await getUserData(dispatch);
    //     await statusMessage(dispatch, 'success', 'Profile Updated');
    //     resolve();
    //   }).catch(reject);
  }).catch(async (err) => { await statusMessage(dispatch, 'error', err.message); throw err.message; });
}

export function logout() {
  return dispatch => new Promise((resolve, reject) => {
    Firebase.auth().signOut()
      .then(() => {
        dispatch({ type: 'USER_RESET' });
        setTimeout(resolve, 1000); // Resolve after 1s so that user sees a message
      }).catch(reject);
  }).catch(async (err) => { await statusMessage(dispatch, 'error', err.message); throw err.message; });
}