import ErrorMessages from '../constants/errors';
import statusMessage from './status';
import {Firebase, FirebaseStorage, Firestore} from '../lib/firebase';


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
        const userListSnapshots = await Firestore.collection("users").where('authWaiting', '==', false).orderBy("name", 'asc').limit(10).get();
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

export function getAuthRequestMemberListData(member) {
    if (Firebase === null) return () => new Promise(resolve => resolve());

    // Ensure token is up to date
    return dispatch => new Promise(async (resolve) => {
        return resolve(Firestore.collection("users").where('authWaiting', '==', true).limit(10).get()
            .then(async userListSnapshots => {
                let userList = [];
                userListSnapshots.docs.forEach(doc => {
                    userList.push({...doc.data(), docId: doc.id});
                });

                return dispatch({
                    type: 'SCHEDULER_OWNER_UPDATE',
                    userList: userList,
                });
            }));
    });
}
export function approveUser(userMap) {
    if (Firebase === null) return () => new Promise(resolve => resolve());

    return dispatch => new Promise(async (resolve) => {
        userMap.forEach((item) => {
            Firestore.collection("users").doc(item.docId).set({authWaiting:false}, {merge:true})
        });

        resolve();
    });
}

export function getOtherUserData(docId) {
    if (Firebase === null) return () => new Promise(resolve => resolve());
    return dispatch => new Promise(async resolve => {
        await statusMessage(dispatch, 'loading', true);
        const documentSnapshots = await Firestore.collection('users').doc(docId).get();
        await statusMessage(dispatch, 'loading', false);

        return resolve(dispatch({
            type: 'GET_OTHER_USER',
            data: {
                user: {...documentSnapshots.data(), docId: documentSnapshots.id}
            }
        }));
    });
}

export function getSearchMemberList(name) {
  if (Firebase === null) return () => new Promise(resolve => resolve());
  return dispatch => new Promise( async (resolve) => {
    //const documentSnapshots = await Firestore.collection("users").where('name', '==', name).get();
    const documentSnapshots = await Firestore.collection("users").orderBy('name').startAt(name).endAt(name + "\uf8ff").limit(20).get();
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

export function addStaffMemberList(member) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => {
    return resolve(dispatch({
      type: 'ADD_STEP_MEMBER_LIST',
      member: member,
    }));
  });
}
export function removeStaffMemberList(index) {
  if (Firebase === null) return () => new Promise(resolve => resolve());
  return dispatch => new Promise(resolve => {
    return resolve(dispatch({
      type: 'REMOVE_STEP_MEMBER_LIST',
      index: index,
    }));
  });
}
export function resetStaffMemberList() {
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

export function findEmail(formData) {
    const { name, studentNum, phone } = formData;
    if (Firebase === null) return () => new Promise(resolve => resolve());

    return dispatch => new Promise( async (resolve) => {

        const documentSnapshots = await Firestore.collection("users")
                                        .where('name', '==', name)
                                        .where('studentNum', '==', studentNum)
                                        .where('phone', '==', phone).get().catch(err => console.log(err));
        let docList = [];
        documentSnapshots.docs.forEach(doc => {
            docList.push({...doc.data(), docId: doc.id});
        });

        return resolve(dispatch({
            type: 'UPDATE_MEMBER_STATE',
            data:{
                findEmail: docList[0] ? docList[0] : {},
            }

        }));
    });
}export function clearFindEmail() {
    if (Firebase === null) return () => new Promise(resolve => resolve());

    return dispatch => new Promise( async (resolve) => {
        return resolve(dispatch({
            type: 'UPDATE_MEMBER_STATE',
            data:{
                findEmail: undefined,
            }

        }));
    });
}

/**
 * Reset Password
 */
export function resetPassword(formData) {
  const { passwordEmail } = formData;

  return dispatch => new Promise(async (resolve, reject) => {
    // Validation checks
    if (!passwordEmail) return reject({ message: ErrorMessages.missingEmail });

    // Go to Firebase
    return Firebase.auth()
      .sendPasswordResetEmail(passwordEmail)
      .then(() => statusMessage(dispatch, 'loading', false).then(resolve(dispatch({ type: 'USER_RESET' }))))
      .catch(() => resolve());
  }).catch(async (err) => { await statusMessage(dispatch, 'error', err.message); throw err.message; });
}
/**
 * Update Profile
 */
export function updateTerms(formData) {
    return dispatch => new Promise(async (resolve, reject) => {
        const UID = Firebase.auth().currentUser.uid;
        if (!UID) return reject({ message: ErrorMessages.missingFirstName });

        return Firestore.collection("users").doc(UID).set({ termsCheck:true}, {merge:true})
            .then(async () => {
                return resolve(dispatch({
                    type: 'USER_DETAILS_UPDATE',
                    data: {
                        termsCheck:true
                    },
                }));
            }).catch(reject);
    }).catch(async (err) => { await statusMessage(dispatch, 'error', err.message); throw err.message; });
}

/**
 * Update Profile
 */
export function updateProfile(formData) {
  const {
    phone,
    company,
    className,
    mbaType,
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
    return Firestore.collection("users").doc(UID).set({ thumb, phone, company, className, mbaType, isSingle, isProfileOpen}, {merge:true})
      .then(async () => {

        // Update Redux
        await getUserData(dispatch);
        await statusMessage(dispatch, 'success', '프로필 수정 완료');
        resolve();
      }).catch(reject);
  }).catch(async (err) => { await statusMessage(dispatch, 'error', err.message); throw err.message; });
}


export function createProfile(formData) {
    let {
        name,
        phone,
        studentNum,
        className,
        mbaType,
        company,
        isGraduation,
        isProfileOpen,
        imageUrl,
        imageBlob,
        password,
        universe,
        checkedNotification,
        checkedTermsService,
        checkedTermsUser,
    } = formData;
    const email = formData.email.trim();
    className = className || '';
    mbaType = mbaType || '';
    company = company || '';
    universe = universe || 'yonsei';

    let thumb = formData.thumb;

    return dispatch => new Promise(async (resolve, reject) => {
        await statusMessage(dispatch, 'loading', true);
        return Firebase.auth()
            .createUserWithEmailAndPassword(email, password)
            .then(async (res) => {
                const uid = res.user.uid;
                if(imageUrl && imageBlob){
                    thumb = await FirebaseStorage.child('users/' + uid + '/' + imageBlob._55._data.name)
                        .put(imageBlob._55)
                        .then(async snapshot => await snapshot.ref.getDownloadURL())
                        .catch(async (err) => { console.log(err); throw err; });
                    thumb = thumb.replace(imageBlob._55._data.name, 'thumb_' + imageBlob._55._data.name)

                }
                if(!thumb || thumb === ''){
                    thumb = 'https://firebasestorage.googleapis.com/v0/b/club-mba.appspot.com/o/image%2Fthumb_gray.jpg?alt=media&token=821900e5-3630-4295-ac7d-eda9c6eb0e12';
                }

                Firestore.collection("users").doc(uid).set({ email, phone, name, studentNum, universe, isGraduation,
                                                        className, mbaType, company, isProfileOpen, thumb, checkedNotification, checkedTermsService, checkedTermsUser,
                                                        createDate: Date.now(),
                                                            'memberType': 'U',
                                                            'authWaiting': true,
                                                            'univAuth': [{authType: 'U', boardId:'total'}],
                                                            'clubAuth': []
                                                            })
                    .then(() => statusMessage(dispatch, 'loading', false).then(resolve));

            }).catch(reject);
    }).catch(async (err) => { await statusMessage(dispatch, 'loading', false); throw err; });
}


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
