import {Firebase, Firestore, FirebaseStorage} from '../lib/firebase';
import statusMessage from './status';
import {Actions} from 'react-native-router-flux';

export function createArticle(localState, props) {

  return dispatch => new Promise(async (resolve, reject) => {

    const currentUnivId = props.boardItem.docId;
    const now = Date.now();
    await statusMessage(dispatch, 'loading', true);
    const articleType = localState.isNotice ? 'notice' : localState.isSchedule ? 'schedule' : 'article'

    let article = {
      author: props.member,
      comment: [],
      content: localState.content,
      createDateTime: now,
      title: localState.title,
      urlList: [],
      fileNameList: [],
      isSchedule: localState.isSchedule,
      isNotice: localState.isNotice,
      isLimitMember: localState.isLimitMember,
      startDatetime: localState.startDatetime,
      startDatetimeLong: localState.startDatetimeLong,
      endDatetime: localState.endDatetime,
      endDatetimeLong: localState.endDatetimeLong,
      place: localState.place,
      joinMemberLimit: localState.joinMemberLimit,
      boardThumb: props.boardItem.thumb,
      boardName: props.boardItem.name,
    };

    if (localState.imageBlobList && localState.imageBlobList.length !== 0) {
      const urlArray = [];
      const filePrefix = props.boardType + '/' + currentUnivId + '/' + now;

      urlArray.push(await FirebaseStorage.child(filePrefix + localState.imageBlobList[0]._55._data.name)
        .put(localState.imageBlobList[0]._55)
        .then(async snapshot => await snapshot.ref.getDownloadURL()));

      if (localState.imageBlobList.length > 1) {
        urlArray.push(await FirebaseStorage.child(filePrefix + localState.imageBlobList[1]._55._data.name)
          .put(localState.imageBlobList[1]._55)
          .then(async snapshot => await snapshot.ref.getDownloadURL()));
      }
      if (localState.imageBlobList.length > 2) {
        urlArray.push(await FirebaseStorage.child(filePrefix + localState.imageBlobList[2]._55._data.name)
          .put(localState.imageBlobList[2]._55)
          .then(async snapshot => await snapshot.ref.getDownloadURL()));
      }
      if (localState.imageBlobList.length > 3) {
        urlArray.push(await FirebaseStorage.child(filePrefix + localState.imageBlobList[3]._55._data.name)
          .put(localState.imageBlobList[3]._55)
          .then(async snapshot => await snapshot.ref.getDownloadURL()));
      }
      if (localState.imageBlobList.length > 4) {
        urlArray.push(await FirebaseStorage.child(filePrefix + localState.imageBlobList[4]._55._data.name)
          .put(localState.imageBlobList[4]._55)
          .then(async snapshot => await snapshot.ref.getDownloadURL()));
      }

      article.urlList = urlArray;
      article.fileNameList = localState.imageBlobList.map(image => now + image._55._data.name);

    }
    if(localState.isSchedule){
      Firestore.collection(props.boardType).doc(currentUnivId).collection('schedule').add(article).then(async documentSnapshot => {
        const homeArticle = {...article,docId:documentSnapshot.id};
        Firestore.collection(props.member.universe + 'home').doc("schedule").get()
          .then(documentSnapshats =>{
            if(!documentSnapshats.exists){
              Firestore.collection(props.member.universe + 'home').doc("schedule").set({[currentUnivId]:[homeArticle]});
              return;
            }
            const data = documentSnapshats.data();
            let resultArray = data[currentUnivId] || [];
            resultArray.unshift(homeArticle);
            if(resultArray.length > 3) {
              resultArray.pop();
            }
            Firestore.collection(props.member.universe + 'home').doc("schedule").set({[currentUnivId]:resultArray}, {merge : true});
          });
      }).catch(error => console.log(error));
    }

    await Firestore.collection(props.boardType).doc(currentUnivId).collection(localState.isSchedule ? 'notice' : articleType).add(article).then(async documentSnapshot => {
      const homeArticle = {...article,docId:documentSnapshot.id};
      if(localState.isNotice || localState.isSchedule){
        Firestore.collection(props.member.universe + 'home').doc("notice").get()
          .then(documentSnapshots =>{
            if(!documentSnapshots.exists){
              Firestore.collection(props.member.universe + 'home').doc("notice").set({[currentUnivId]:[homeArticle]});
              return;
            }
            const data = documentSnapshots.data();
            let resultArray = data[currentUnivId] || [];
            resultArray.unshift(homeArticle);
            if(resultArray.length > 3) {
              resultArray.pop();
            }
            Firestore.collection(props.member.universe + 'home').doc("notice").set({[currentUnivId]:resultArray}, {merge : true});
          });
      }

      let documentReference = Firestore.collection(props.member.universe).doc(currentUnivId);
      const documentSnapshots = await documentReference.collection("article").orderBy("createDateTime", 'desc').limit(10).get()
        .catch(error => {
          console.error(error);
        });

      let dataList = [];
      documentSnapshots.docs.forEach(doc => {
        dataList.push({...doc.data(), docId: doc.id});
      });
      statusMessage(dispatch, 'loading', false);
      Actions.pop();
      return resolve(dispatch({
        type: 'GET_UNIV_ARTICLE_LIST',
        data: {
          articleList: dataList,
        },
      }));
    }).catch(error => console.log(error));

  }).catch(async (err) => {
    await statusMessage(dispatch, 'error', err.message);
    throw err.message;
  });
}
export function createBoard(localState, propsMember) {
  const {
    boardName,
    isClub,
    isUniv,
    imageUrl,
    imageBlob,
    member,
  } = localState;
  const stepMemberList = propsMember.stepMemberList;

  return dispatch => new Promise(async (resolve, reject) => {
    await statusMessage(dispatch, 'loading', true);
    const sectionAuthName = (isClub ? 'club' : 'univ') + 'Auth';
    let thumb = '#';
    if(imageUrl && imageBlob){
      thumb = await FirebaseStorage.child('board/' + imageBlob._55._data.name)
        .put(imageBlob._55)
        .then(async snapshot => await snapshot.ref.getDownloadURL());
      thumb = thumb.replace(imageBlob._55._data.name, 'thumb_' + imageBlob._55._data.name)
    }

    //const docIdList = stepMemberList.map(item => item.docId);
    return Firestore.collection(member.universe + (isClub ? 'club' : '')).add({ name : boardName, thumb, stepMemberList:stepMemberList, sectionType: isClub ? 'club' : 'univ'})
      .then(async (docRef) => {
        if(stepMemberList && stepMemberList.length > 0){
          stepMemberList.forEach(item => {
            item[sectionAuthName].push({authType:'S', boardId: docRef.id});
            Firestore.collection("users").doc(item.docId).set({
              [sectionAuthName]: item[sectionAuthName],
            }, {merge:true});
          });
        }
        member[sectionAuthName].push({authType:'S', boardId: docRef.id});
        await statusMessage(dispatch, 'loading', false);
        return resolve(dispatch({
          type: 'USER_DETAILS_UPDATE',
          data: {[sectionAuthName] : member[sectionAuthName]},
        }));
      }).catch(reject);

  }).catch(async (err) => {
    await statusMessage(dispatch, 'error', err.message);
    throw err.message;
  });
}

export function updateBoard(localState) {
  const {
    currentBoardItem,
    originalBoardItem,
    imageBlob,
    member,
  } = localState;

  return dispatch => new Promise(async (resolve, reject) => {
    let thumb = currentBoardItem.thumb;
    if(currentBoardItem.imageUrl && currentBoardItem.imageBlob){
      thumb = await FirebaseStorage.child('board/' + imageBlob._55._data.name)
        .put(imageBlob._55)
        .then(async snapshot => await snapshot.ref.getDownloadURL());
      thumb = thumb.replace(imageBlob._55._data.name, 'thumb_' + imageBlob._55._data.name)
    }
    // 1. 원우 추가된사람 auth 추가
    if(currentBoardItem.addedJoinMemberList){
      currentBoardItem.addedJoinMemberList.forEach(member => {
          Firestore.collection("users").doc(member.docId).get()
            .then(async documentSnapshots => {
              const data = await documentSnapshots.data();
              const authKey = currentBoardItem.sectionType + "Auth";
              const waitingKey = currentBoardItem.sectionType + "Waiting";
              const authList = data[authKey] || [];
              const waitingList = data[waitingKey] || [];
              waitingList.splice(waitingList.indexOf(currentBoardItem.docId), 1);
              authList.push({authType:'N', boardId: currentBoardItem.docId});
              let updateResult = {
                [authKey]: authList,
                [waitingKey]: waitingList,
              };
              Firestore.collection("users").doc(member.docId).update(updateResult)
            })
      });
    }
    // 원우 제외된사람 제외
    if(currentBoardItem.removedJoinMemberList){
      currentBoardItem.removedJoinMemberList.forEach(member => {
        Firestore.collection("users").doc(member.docId).get()
          .then(async documentSnapshots => {
            const data = await documentSnapshots.data();
            const authKey = currentBoardItem.sectionType + "Auth";
            const authList = data[authKey] || [];
            authList.splice(authList.indexOf(currentBoardItem.docId), 1);
            let updateResult = {
              [authKey]: authList,
            };
            Firestore.collection("users").doc(member.docId).update(updateResult)
          })
      });
    }

    // 2. 스탭 추가된사람 추가, 제외된사람 제외
    if((!originalBoardItem.stepMemberList && currentBoardItem.stepMemberList)
      || (originalBoardItem.stepMemberList && currentBoardItem.stepMemberList && originalBoardItem.stepMemberList.length > currentBoardItem.stepMemberList.length)){
      originalBoardItem.stepMemberList.forEach(member => {
        console.log(currentBoardItem.stepMemberList.find(member))
      });
    }

    await Firestore.collection(member.universe + (currentBoardItem.sectionType === 'univ' ? '' : currentBoardItem.sectionType)).doc(currentBoardItem.docId)
              .set({...currentBoardItem,
                     thumb: thumb,
                    removedJoinMemberList:[],
                    addedJoinMemberList:[],
                    }, {merge:true})

    resolve();

  }).catch(async (err) => {
    await statusMessage(dispatch, 'error', err.message);
    throw err.message;
  });
}

export function getUnivTotal(currentUnivId, member, sectionType) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const isUniv = sectionType === 'univ';
  const isHall = sectionType === 'hall';
  const isClub = sectionType === 'club';

  if (isClub && (!member.clubAuth || member.clubAuth.length === 0)) return () => new Promise(resolve => resolve());
  const universe = isHall ? 'hall' : member.universe + (isUniv ? '' : 'club');

  return dispatch => new Promise(async resolve => {
    await statusMessage(dispatch, 'loading', true);
    let collectionReference = Firestore.collection(universe);

    let boardList = [];
    if(!isHall) {
      const boardListSnapshots = await collectionReference.get();
      member[sectionType + 'Auth'].map(auth => {
        boardListSnapshots.docs.forEach(doc => {
          if (auth.boardId === doc.id) {
            boardList.push({...doc.data(), docId: doc.id});
          }
        });
      });
    } else {
      currentUnivId = 'total';
      boardList.push({docId: 'total'})
    }

    if(boardList.length === 0){
      await statusMessage(dispatch, 'loading', false);
      return resolve();
    }
    if (!currentUnivId || currentUnivId === 'default') currentUnivId = boardList[0].docId;
    let documentReference = collectionReference.doc(currentUnivId);

    const noticeDocument = await documentReference.collection("notice").orderBy("createDateTime", 'desc').limit(3).get();
    let noticeList = [];
    noticeDocument.docs.forEach(doc => {
      noticeList.push({...doc.data(), docId: doc.id});
    });
    const scheduleDocument = await documentReference.collection("schedule").orderBy("createDateTime", 'desc').limit(1).get();
    let scheduleList = [];
    scheduleDocument.docs.forEach(doc => {
      scheduleList.push({...doc.data(), docId: doc.id});
    });
    await statusMessage(dispatch, 'loading', false);
    return resolve(dispatch({
      type: sectionType.toUpperCase() + '_TOTAL',
      data: {
        boardList: boardList,
        noticeList: noticeList,
        scheduleList: scheduleList,
        currentUnivId: currentUnivId,
      },
    }));
  });
}

export function getBoardList(currentUnivId, member, sectionType) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const isUniv = sectionType === 'univ';
  const isHall = sectionType === 'hall';
  const isClub = sectionType === 'club';

  if (isClub && (!member.clubAuth || member.clubAuth.length === 0)) return () => new Promise(resolve => resolve());
  const universe = isHall ? 'hall' : member.universe + (isUniv ? '' : 'club');

  return dispatch => new Promise(async resolve => {
    await statusMessage(dispatch, 'loading', true);
    let collectionReference = Firestore.collection(universe);

    let boardList = [];
    if(!isHall) {
      const boardListSnapshots = await collectionReference.get();
      member[sectionType + 'Auth'].map(auth => {
        boardListSnapshots.docs.forEach(doc => {
          if (auth.boardId === doc.id) {
            boardList.push({...doc.data(), docId: doc.id});
          }
        });
      });
    } else {
      currentUnivId = 'total';
      boardList.push({docId: 'total'})
    }

    await statusMessage(dispatch, 'loading', false);
    return resolve(dispatch({
      type: sectionType.toUpperCase() + '_TOTAL',
      data: {
        boardList: boardList,
      },
    }));
  });
}

export function getNoticeList(currentUnivId, member, sectionType) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const isUniv = sectionType === 'univ';
  const isHall = sectionType === 'hall';
  const isClub = sectionType === 'club';

  if (isClub && (!member.clubAuth || member.clubAuth.length === 0)) return () => new Promise(resolve => resolve());
  const universe = isHall ? 'hall' : member.universe + (isUniv ? '' : 'club');

  return dispatch => new Promise(async resolve => {

    if (!currentUnivId || currentUnivId === 'default') {
      currentUnivId = member[sectionType + 'Auth'][0].boardId;
    }

    const noticeDocument = await Firestore.collection(universe).doc(currentUnivId).collection("notice").orderBy("createDateTime", 'desc').limit(3).get();
    let noticeList = [];
    noticeDocument.docs.forEach(doc => {
      noticeList.push({...doc.data(), docId: doc.id});
    });

    return resolve(dispatch({
      type: sectionType.toUpperCase() + '_TOTAL',
      data: {
        noticeList: noticeList,
      },
    }));
  });
}

export function getScheduleList(currentUnivId, member, sectionType) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const isUniv = sectionType === 'univ';
  const isHall = sectionType === 'hall';
  const isClub = sectionType === 'club';

  if (isClub && (!member.clubAuth || member.clubAuth.length === 0)) return () => new Promise(resolve => resolve());
  const universe = isHall ? 'hall' : member.universe + (isUniv ? '' : 'club');

  return dispatch => new Promise(async resolve => {

    if (!currentUnivId || currentUnivId === 'default') {
      currentUnivId = member[sectionType + 'Auth'][0].boardId;
    }

    const scheduleDocument = await Firestore.collection(universe).doc(currentUnivId).collection("schedule").orderBy("createDateTime", 'desc').limit(1).get();
    let scheduleList = [];
    scheduleDocument.docs.forEach(doc => {
      scheduleList.push({...doc.data(), docId: doc.id});
    });

    return resolve(dispatch({
      type: sectionType.toUpperCase() + '_TOTAL',
      data: {
        scheduleList: scheduleList,
      },
    }));
  });
}

export function getArticleItem(universe, sectionId, boardType, docId) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(async resolve => {
    await statusMessage(dispatch, 'loading', true);
    const documentSnapshots = await Firestore.collection(universe)
                                      .doc(sectionId).collection(boardType)
                                      .doc(docId).get();
    await statusMessage(dispatch, 'loading', false);

    return resolve(dispatch({
      type: 'GET_ARTICLE_TOTAL',
      data: {
        article: {...documentSnapshots.data(), docId:documentSnapshots.id}
      }
    }));
  });
}

export function getArticleList(currentUnivId, member, sectionType) {
  if (Firebase === null) return () => new Promise(resolve => resolve());
  const isUniv = sectionType === 'univ';
  const isHall = sectionType === 'hall';
  const isClub = sectionType === 'club';

  const universe = member.universe + (isUniv ? '' : sectionType);
  return dispatch => new Promise(async resolve => {
    if (!currentUnivId || currentUnivId === 'default') currentUnivId = member[sectionType + 'Auth'][0].boardId;
    let documentReference = Firestore.collection(universe).doc(currentUnivId);
    const documentSnapshots = await documentReference.collection("article").orderBy("createDateTime", 'desc').limit(15).get()
      .catch(error => console.error(error));

    let dataList = [];
    documentSnapshots.docs.forEach(doc => {
      dataList.push({...doc.data(), docId: doc.id});
    });

    return resolve(dispatch({
      type: isUniv ? 'GET_UNIV_ARTICLE_LIST': 'GET_CLUB_ARTICLE_LIST',
      data: {
        articleList: dataList,
        currentUnivId: currentUnivId,
      },
    }));
  });
}
export function getArticleListMore(currentUnivId, member, sectionType, lastUnivArticle) {
  if (Firebase === null) return () => new Promise(resolve => resolve());
  const isUniv = sectionType === 'univ';
  const isHall = sectionType === 'hall';
  const isClub = sectionType === 'club';

  const universe = member.universe + (isUniv ? '' : sectionType);
  return dispatch => new Promise(async resolve => {
    if (!currentUnivId || currentUnivId === 'default') currentUnivId = member[sectionType + 'Auth'][0].boardId;
    let documentReference = Firestore.collection(universe).doc(currentUnivId);
    const documentSnapshots = await documentReference.collection("article").orderBy("createDateTime", 'desc').where('createDateTime', '<', lastUnivArticle.createDateTime).limit(15).get()
      .catch(error => console.error(error));

    let dataList = [];
    documentSnapshots.docs.forEach(doc => {
      dataList.push({...doc.data(), docId: doc.id});
    });

    return resolve(dispatch({
      type: isUniv ? 'GET_UNIV_ARTICLE_LIST_MORE': 'GET_CLUB_ARTICLE_LIST_MORE',
      data: {
        articleList: dataList,
        currentUnivId: currentUnivId,
      },
    }));
  });
}

export function getUnivNoticeList(univ, member) {
  if (Firebase === null) return () => new Promise(resolve => resolve());
  return dispatch => new Promise(async resolve => await Firestore.collection(member.universe).doc(univ.currentUnivId).collection("notice").orderBy("createDateTime", 'desc').limit(10)
    .get().then(function (documentSnapshots) {
      let dataList = [];
      documentSnapshots.docs.forEach(doc => {
        dataList.push({...doc.data(), docId: doc.id});
      });
      console.log(dataList)
      return resolve(dispatch({
        type: 'NOTICE_LIST_REPLACE',
        data: {
          dataList: dataList,
        },
      }));
    }).catch(error => {
      console.error(error);
    }));
}

export function getHomeScheduleList(member) {
  if (Firebase === null) return () => new Promise(resolve => resolve());
  if(!member.univAuth || member.univAuth.length === 0) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(async resolve => {
    await statusMessage(dispatch, 'loading', true);
    const homeScheduleListData = await Firestore.collection(member.universe + 'home').doc('schedule').get();
    const homeSchedule = homeScheduleListData.data();
    let beforeScheduleList = [];
    let afterScheduleList = [];
    const now = Date.now();

    member.univAuth.forEach(auth =>{
      if(homeSchedule[auth.boardId]){
        homeSchedule[auth.boardId].forEach(article => {
          if(article.startDatetimeLong > now){
            afterScheduleList.push({...article, currentUnivId:auth.boardId, sectionType:'univ'})
          } else {
            beforeScheduleList.push({...article, currentUnivId:auth.boardId, sectionType:'univ'})
          }
        });
      }
    });
    member.clubAuth.forEach(auth =>{
      if(homeSchedule[auth.boardId]){
        homeSchedule[auth.boardId].forEach(article => {
          if(article.startDatetimeLong > now){
              afterScheduleList.push({...article, currentUnivId:auth.boardId, sectionType:'club'})
          } else {
            beforeScheduleList.push({...article, currentUnivId:auth.boardId, sectionType:'club'})
          }
        });
      }
    });
    if(homeSchedule['hall']){
      homeSchedule['hall'].forEach(article => {
        if(article.startDatetimeLong > now){
          afterScheduleList.push({...article, currentUnivId:auth.boardId, sectionType:'hall'})
        } else {
          beforeScheduleList.push({...article, currentUnivId:auth.boardId, sectionType:'hall'})
        }
      });
    }
    beforeScheduleList.sort((a,b) => b.startDatetimeLong - a.startDatetimeLong);
    afterScheduleList.sort((a,b) => b.startDatetimeLong - a.startDatetimeLong);

    await statusMessage(dispatch, 'loading', false);
    return resolve(dispatch({
      type: 'HOME_SCHEDULE_LIST',
      data: {
        beforeScheduleList: beforeScheduleList,
        afterScheduleList: afterScheduleList,
      },
    }));
  });
}

export function getUnivSchedule(currentUnivId, limit) {
  if (Firebase === null) return () => new Promise(resolve => resolve());
  if (currentUnivId === 'default') currentUnivId = '전체';

  return dispatch => new Promise(async resolve => await Firestore.collection("연세대").doc(currentUnivId).collection("schedule").orderBy("createDateTime", 'desc').limit(20)
    .get().then(function (documentSnapshots) {
      let dataList = [];
      documentSnapshots.docs.forEach(doc => {
        dataList.push(doc.data());
      });
      return resolve(dispatch({
        type: 'SCHEDULE_REPLACE',
        data: {
          dataList: dataList,
        },
      }));
    }).catch(error => {
      console.error(error);
    }));
}

export function getJoiningBoardList(member) {
  if (Firebase === null) return () => new Promise(resolve => resolve());
  return dispatch => new Promise(async resolve => {
    const documentSnapshots = await Firestore.collection(member.universe).get().catch(error => {
      console.error(error);
    });
    let dataList = [];
    member.univAuth.map(auth => {
      documentSnapshots.docs.forEach(doc => {
        if (auth.boardId === doc.id && auth.authType === 'S') {
          dataList.push({...doc.data(), docId: doc.id});
        }
      });
    });
    const clubDocumentSnapshots = await Firestore.collection(member.universe + '_club').get().catch(error => {
      console.error(error);
    });
    member.clubAuth.map(auth => {
      clubDocumentSnapshots.docs.forEach(doc => {
        if (auth.boardId === doc.id && auth.authType === 'S') {
          dataList.push({...doc.data(), docId: doc.id});
        }
      });
    });

    return resolve(dispatch({
      type: 'JOINING_BOARD_REPLACE',
      boardList: dataList,
    }));
  });
}

export function getTotalBoardList(universe) {
  if (Firebase === null) return () => new Promise(resolve => resolve());
  return dispatch => new Promise(async resolve => {
    await statusMessage(dispatch, 'loading', true);

    const universeSnapshots = await Firestore.collection(universe).get();
    let universeBoardList = [];
    universeSnapshots.docs.forEach(doc => {
      universeBoardList.push({...doc.data(), docId: doc.id});
    });
    const clubSnapshots = await Firestore.collection(universe + "club").get();
    let clubBoardList = [];
    clubSnapshots.docs.forEach(doc => {
      clubBoardList.push({...doc.data(), docId: doc.id});
    });

    await statusMessage(dispatch, 'loading', false);
    return resolve(dispatch({
      type: 'TOTAL_BOARD_REPLACE',
      universeBoardList,
      clubBoardList,
    }));

  });
}


export function applyBoard(univType, boardItem, member) {

  return dispatch => new Promise(async (resolve, reject) => {
    await statusMessage(dispatch, 'loading', true);
    let univWaiting = member[univType + 'Waiting'] || [];
    univWaiting.push(boardItem.docId);
    await Firestore.collection("users").doc(member.docId).set({[univType + 'Waiting'] : univWaiting}, {merge:true});

    let authWaiting = boardItem.authWaiting || [];
    authWaiting.push(member);
    await Firestore.collection(member.universe + (univType === 'club' ? '동아리' : '')).doc(boardItem.docId).set({authWaiting}, {merge:true});

    const docRef = Firestore.collection("users").doc(member.docId);
    return docRef.get().then(doc => {
      return dispatch({
        type: 'USER_DETAILS_UPDATE',
        data: {...doc.data(),docId:doc.id},
      });
    });
  }).catch(async (err) => {
    await statusMessage(dispatch, 'error', err.message);
    throw err.message;
  });
}

export function addComment(param, commentText, member) {

  return dispatch => new Promise(async (resolve, reject) => {
    await statusMessage(dispatch, 'loading', true);

    const documentRef = await Firestore.collection(param.universe).doc(param.currentUnivId).collection(param.boardType).doc(param.docId);
    const documentSnapShat = await documentRef.get();
    const boardItem = documentSnapShat.data();
    const commentList = boardItem.comment;
    commentList.push({
      docId: member.docId,
      name: member.name,
      thumb: member.thumb,
      commentText: commentText,
      createDateTime: Date.now()
    });

    await documentRef.update({
     comment: commentList
    });
    await statusMessage(dispatch, 'loading', false);
    return resolve(dispatch({
      type: 'GET_ARTICLE_TOTAL',
      data: {
        article: {...boardItem, docId:documentSnapShat.id, comment: commentList}
      }
    }));

  }).catch(async (err) => {
    await statusMessage(dispatch, 'error', err.message);
    throw err.message;
  });
}
export function removeComment(commentItem, param) {

  return dispatch => new Promise(async (resolve, reject) => {
    await statusMessage(dispatch, 'loading', true);

    const documentRef = await Firestore.collection(param.universe).doc(param.currentUnivId).collection(param.boardType).doc(param.docId);
    const documentSnapShat = await documentRef.get();
    const boardItem = documentSnapShat.data();
    const commentList = boardItem.comment;
    let removedCommentList = [];
    commentList.forEach(comment => {

      if(!(comment.docId === commentItem.docId) || !(comment.createDateTime === commentItem.createDateTime)){
        removedCommentList.push(comment);
      }
    })

    await documentRef.update({
      comment: removedCommentList
    });
    await statusMessage(dispatch, 'loading', false);
    return resolve(dispatch({
      type: 'GET_ARTICLE_TOTAL',
      data: {
        article: {...boardItem, docId:documentSnapShat.id, comment: removedCommentList}
      }
    }));

  }).catch(async (err) => {
    await statusMessage(dispatch, 'error', err.message);
    throw err.message;
  });
}

/**
 * Set an Error Message
 */
export function setError(message) {
  return dispatch => new Promise(resolve => resolve(dispatch({
    type: 'RECIPES_ERROR',
    data: message,
  })));
}

export function univLogout() {
  return dispatch => new Promise((resolve, reject) => {
       return dispatch({ type: 'UNIV_RESET' });
  }).catch(async (err) => { await statusMessage(dispatch, 'error', err.message); throw err.message; });
}


