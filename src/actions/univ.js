import {Firebase, Firestore, FirebaseStorage} from '../lib/firebase';
import statusMessage from './status';
import moment from "moment";

export function createArticle(localState, props) {

    return dispatch => new Promise(async (resolve, reject) => {

        const currentUnivId = props.boardItem.docId;
        const now = Date.now();
        await statusMessage(dispatch, 'loading', true);
        const boardType = localState.isNotice || localState.isSchedule ? 'notice' : 'article'

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
            boardDocId: props.boardItem.docId,
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

        await Firestore.collection(props.boardType).doc(currentUnivId).collection(boardType).add(article).then(async documentSnapshot => {
            const homeArticle = {...article, docId: documentSnapshot.id};
            if (localState.isNotice) {
                Firestore.collection(props.member.universe + 'home').doc('notice').get()
                    .then(documentSnapshots => {
                        if (!documentSnapshots.exists) {
                            Firestore.collection(props.member.universe + 'home').doc('notice').set({[currentUnivId]: [homeArticle]});
                            return;
                        }
                        const data = documentSnapshots.data();
                        let resultArray = data[currentUnivId] || [];
                        resultArray.unshift(homeArticle);
                        if (resultArray.length > 5) {
                            resultArray.pop();
                        }
                        Firestore.collection(props.member.universe + 'home').doc('notice').set({[currentUnivId]: resultArray}, {merge: true});
                    });
            }
            if (localState.isSchedule) {
                Firestore.collection(props.member.universe + 'home').doc('schedule').get()
                    .then(documentSnapshots => {
                        if (!documentSnapshots.exists) {
                            Firestore.collection(props.member.universe + 'home').doc('schedule').set({[currentUnivId]: [homeArticle]});
                            return;
                        }
                        const data = documentSnapshots.data();
                        let resultArray = data[currentUnivId] || [];
                        resultArray.unshift(homeArticle);
                        if (resultArray.length > 5) {
                            resultArray.pop();
                        }
                        Firestore.collection(props.member.universe + 'home').doc('schedule').set({[currentUnivId]: resultArray}, {merge: true});
                    });
            }
            statusMessage(dispatch, 'loading', false);
            statusMessage(dispatch, 'needUpdate', true);
            return resolve();
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
    const staffMemberList = propsMember.staffMemberList;

    return dispatch => new Promise(async (resolve, reject) => {
        await statusMessage(dispatch, 'loading', true);
        const sectionAuthName = (isClub ? 'club' : 'univ') + 'Auth';
        let thumb = '#';
        if (imageUrl && imageBlob) {
            thumb = await FirebaseStorage.child('board/' + imageBlob._55._data.name)
                .put(imageBlob._55)
                .then(async snapshot => await snapshot.ref.getDownloadURL());
            thumb = thumb.replace(imageBlob._55._data.name, 'thumb_' + imageBlob._55._data.name)
        }

        //const docIdList = stepMemberList.map(item => item.docId);
        return Firestore.collection(member.universe + (isClub ? 'club' : 'univ')).add({
            name: boardName,
            thumb,
            staffMemberList: staffMemberList,
            sectionType: isClub ? 'club' : 'univ'
        })
            .then(async (docRef) => {
                if (staffMemberList && staffMemberList.length > 0) {
                    staffMemberList.forEach(item => {
                        item[sectionAuthName].push({authType: 'S', boardId: docRef.id});
                        Firestore.collection("users").doc(item.docId).set({
                            [sectionAuthName]: item[sectionAuthName],
                        }, {merge: true});
                    });
                }
                member[sectionAuthName].push({authType: 'S', boardId: docRef.id});
                await statusMessage(dispatch, 'loading', false);
                return resolve(dispatch({
                    type: 'USER_DETAILS_UPDATE',
                    data: {[sectionAuthName]: member[sectionAuthName]},
                }));
            }).catch(reject);

    }).catch(async (err) => {
        await statusMessage(dispatch, 'error', err.message);
        throw err.message;
    });
}

export function updateArticle(localState, props) {

    return dispatch => new Promise(async (resolve, reject) => {

        const universe = props.sectionType === 'hall' ? 'hall' : props.member.universe + props.sectionType;
        const currentUnivId = props.article.boardDocId;
        const now = Date.now();
        await statusMessage(dispatch, 'loading', true);
        const boardType = localState.isNotice || localState.isSchedule ? 'notice' : 'article'

        let article = {
            urlList:[],
            fileNameList:[],
            ...props.article,
            author: props.member,
            content: localState.content,
            updateDateTime: now,
            title: localState.title,
            isSchedule: localState.isSchedule,
            isNotice: localState.isNotice,
            isLimitMember: localState.isLimitMember,
            startDatetime: localState.startDatetime,
            startDatetimeLong: localState.startDatetimeLong,
            endDatetime: localState.endDatetime,
            endDatetimeLong: localState.endDatetimeLong,
            place: localState.place,
            joinMemberLimit: localState.joinMemberLimit,
            boardThumb: props.article.boardThumb,
            boardName: props.article.boardName,
            boardDocId: props.article.boardDocId,
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

            article.urlList = article.urlList.filter(url => url.indexOf('file:///') === -1).concat(urlArray);
            article.fileNameList = article.fileNameList.concat(localState.imageBlobList.map(image => now + image._55._data.name));
        }

        await Firestore.collection(universe).doc(currentUnivId).collection(boardType).doc(props.article.docId).set(article)
            .then(() => {
            if (localState.isNotice) {
                Firestore.collection(props.member.universe + 'home').doc('notice').get()
                    .then(documentSnapshots => {
                        const data = documentSnapshots.data();
                        let homeArticleArray = data[currentUnivId] || [];
                        const findIndex = homeArticleArray.findIndex(homeArticle => homeArticle.docId === props.article.docId);
                        if(findIndex >= 0){
                            homeArticleArray[findIndex] = article;
                            Firestore.collection(props.member.universe + 'home').doc('notice').set({[currentUnivId]: homeArticleArray}, {merge: true});
                        }
                    });
            }
            if (localState.isSchedule) {
                Firestore.collection(props.member.universe + 'home').doc('schedule').get()
                    .then(documentSnapshots => {
                        const data = documentSnapshots.data();
                        let homeArticleArray = data[currentUnivId] || [];
                        const findIndex = homeArticleArray.findIndex(homeArticle => homeArticle.docId === props.article.docId);
                        if(findIndex >= 0){
                            homeArticleArray[findIndex] = article;
                            Firestore.collection(props.member.universe + 'home').doc('schedule').set({[currentUnivId]: homeArticleArray}, {merge: true});
                        }
                    });
            }
            statusMessage(dispatch, 'loading', false);
            return resolve();
        }).catch(error => console.log(error));

    }).catch(async (err) => {
        await statusMessage(dispatch, 'error', err.message);
        throw err.message;
    });
}

export function adminDeleteArticle(localState, props) {

    return dispatch => new Promise(async (resolve, reject) => {
        const universe = props.param.sectionType === 'hall' ? 'hall' : props.member.universe + props.param.sectionType;
        const currentUnivId = props.article.boardDocId;
        const now = Date.now();
        await statusMessage(dispatch, 'loading', true);
        const boardType = localState.isNotice || localState.isSchedule ? 'notice' : 'article'

        let article = {
            ...localState,
            urlList:[],
            fileNameList:[],
            updateDateTime: now,
            content: '관리자에 의하여 삭제된 게시물입니다.',
            title: '관리자에 의하여 삭제된 게시물입니다.',
            isAdminDelete:true,
        };
        await Firestore.collection(universe).doc(currentUnivId).collection(boardType).doc(props.article.docId).set(article)
            .then(() => {
                if (article.isNotice) {
                    Firestore.collection(props.member.universe + 'home').doc('notice').get()
                        .then(documentSnapshots => {
                            const data = documentSnapshots.data();
                            let homeArticleArray = data[currentUnivId] || [];
                            const findIndex = homeArticleArray.findIndex(homeArticle => homeArticle.docId === props.article.docId);
                            if(findIndex >= 0){
                                homeArticleArray.splice(findIndex, 1);
                                Firestore.collection(props.member.universe + 'home').doc('notice').set({[currentUnivId]: homeArticleArray}, {merge: true});
                            }
                        });
                }
                if (article.isSchedule) {
                    Firestore.collection(props.member.universe + 'home').doc('schedule').get()
                        .then(documentSnapshots => {
                            const data = documentSnapshots.data();
                            let homeArticleArray = data[currentUnivId] || [];
                            const findIndex = homeArticleArray.findIndex(homeArticle => homeArticle.docId === props.article.docId);
                            if(findIndex >= 0){
                                homeArticleArray.splice(findIndex, 1);
                                Firestore.collection(props.member.universe + 'home').doc('schedule').set({[currentUnivId]: homeArticleArray}, {merge: true});
                            }
                        });
                }
                statusMessage(dispatch, 'loading', false);
                return resolve();
            }).catch(error => console.log(error));

    }).catch(async (err) => {
        await statusMessage(dispatch, 'error', err.message);
        throw err.message;
    });
}

export function deleteArticle(localState, props) {

    return dispatch => new Promise(async (resolve, reject) => {

        const universe = props.sectionType === 'hall' ? 'hall' : props.member.universe + props.sectionType;
        const currentUnivId = props.article.boardDocId;
        await statusMessage(dispatch, 'loading', true);
        const boardType = localState.isNotice || localState.isSchedule ? 'notice' : 'article'

        await Firestore.collection(universe).doc(currentUnivId).collection(boardType).doc(props.article.docId).delete()
            .then(() => {
                if (localState.isNotice) {
                    Firestore.collection(props.member.universe + 'home').doc('notice').get()
                        .then(documentSnapshots => {
                            const data = documentSnapshots.data();
                            let homeArticleArray = data[currentUnivId] || [];
                            const findIndex = homeArticleArray.findIndex(homeArticle => homeArticle.docId === props.article.docId);
                            if(findIndex >= 0){
                                homeArticleArray.splice(findIndex, 1);
                                Firestore.collection(props.member.universe + 'home').doc('notice').set({[currentUnivId]: homeArticleArray}, {merge: true});
                            }
                        });
                }
                if (localState.isSchedule) {
                    Firestore.collection(props.member.universe + 'home').doc('schedule').get()
                        .then(documentSnapshots => {
                            const data = documentSnapshots.data();
                            let homeArticleArray = data[currentUnivId] || [];
                            const findIndex = homeArticleArray.findIndex(homeArticle => homeArticle.docId === props.article.docId);
                            if(findIndex >= 0){
                                homeArticleArray.splice(findIndex, 1);
                                Firestore.collection(props.member.universe + 'home').doc('schedule').set({[currentUnivId]: homeArticleArray}, {merge: true});
                            }
                        });
                }
                statusMessage(dispatch, 'loading', false);
                return resolve();
            }).catch(error => console.log(error));

    }).catch(async (err) => {
        await statusMessage(dispatch, 'error', err.message);
        throw err.message;
    });
}

export function updateBoard(localState, staffMemberList) {
    const {
        currentBoardItem,
        imageBlob,
        member,
        removedStaffList
    } = localState;

    return dispatch => new Promise(async (resolve, reject) => {
        let thumb = currentBoardItem.thumb;
        if (currentBoardItem.imageUrl && currentBoardItem.imageBlob) {
            thumb = await FirebaseStorage.child('board/' + imageBlob._55._data.name)
                .put(imageBlob._55)
                .then(async snapshot => await snapshot.ref.getDownloadURL());
            thumb = thumb.replace(imageBlob._55._data.name, 'thumb_' + imageBlob._55._data.name)
        }
        // 1. 스탭 제외된사람 제외
        if (removedStaffList.length >= 0) {
            removedStaffList.forEach(removeMember => {
                Firestore.collection("users").doc(removeMember.docId).get()
                            .then(async documentSnapshots => {
                                const data = await documentSnapshots.data();
                                const authKey = currentBoardItem.sectionType + "Auth";
                                const authList = data[authKey] || [];
                                authList.splice(authList.indexOf(currentBoardItem.docId), 1);
                                let updateResult = {
                                    [authKey]: authList,
                                };
                                Firestore.collection("users").doc(removeMember.docId).update(updateResult)
                            }).catch(async (err) => {
                                await statusMessage(dispatch, 'error', err.message);
                                throw err.message;
                            })
            });
        }

        // 2. 스탭 추가된사람 추가
        if (staffMemberList.length >= 0) {
            staffMemberList.forEach(addedMember => {
                Firestore.collection("users").doc(addedMember.docId).get()
                    .then(async documentSnapshots => {
                        const data = await documentSnapshots.data();
                        const authKey = currentBoardItem.sectionType + "Auth";
                        const waitingKey = currentBoardItem.sectionType + "Waiting";
                        const authList = data[authKey] || [];
                        const waitingList = data[waitingKey] || [];
                        waitingList.splice(waitingList.indexOf(currentBoardItem.docId), 1);
                        authList.push({authType: 'S', boardId: currentBoardItem.docId});
                        let updateResult = {
                            [authKey]: authList,
                            [waitingKey]: waitingList,
                        };
                        Firestore.collection("users").doc(addedMember.docId).update(updateResult)
                    })
            });
        }

        // 3. board 정보 업데이트
        await Firestore.collection(member.universe + currentBoardItem.sectionType).doc(currentBoardItem.docId)
            .set({
                ...currentBoardItem,
                staffMemberList: currentBoardItem.staffMemberList.concat(staffMemberList),
                thumb: thumb,
            }, {merge: true})
        resolve();

    }).catch(async (err) => {
        await statusMessage(dispatch, 'error', err.message);
        throw err.message;
    });
}

export function updateBoardWaiting(localState) {
    const {
        currentBoardItem,
        member,
        approveMemberList,
        rejectMemberList,
        authWaiting
    } = localState;
    return dispatch => new Promise(async (resolve, reject) => {

        // 1. 승인된사람 auth 추가
        if (approveMemberList.length >= 0) {
            approveMemberList.forEach(approveMember => {
                Firestore.collection("users").doc(approveMember.docId).get()
                    .then(async documentSnapshots => {
                        const data = await documentSnapshots.data();
                        const authKey = currentBoardItem.sectionType + "Auth";
                        const waitingKey = currentBoardItem.sectionType + "Waiting";
                        const authList = data[authKey] || [];
                        const waitingList = data[waitingKey] || [];
                        waitingList.splice(waitingList.indexOf(currentBoardItem.docId), 1);
                        authList.push({authType: 'U', boardId: currentBoardItem.docId});
                        let updateResult = {
                            [authKey]: authList,
                            [waitingKey]: waitingList,
                        };
                        Firestore.collection("users").doc(approveMember.docId).update(updateResult)
                    }).catch(async (err) => {
                    await statusMessage(dispatch, 'error', err.message);
                    throw err.message;
                })
            });
        }

        // 2. 거절된사람 auth 제거
        if (rejectMemberList.length >= 0) {
            rejectMemberList.forEach(rejectMember => {
                Firestore.collection("users").doc(rejectMember.docId).get()
                    .then(async documentSnapshots => {
                        const data = await documentSnapshots.data();
                        const waitingKey = currentBoardItem.sectionType + "Waiting";
                        const waitingList = data[waitingKey] || [];
                        waitingList.splice(waitingList.indexOf(currentBoardItem.docId), 1);
                        let updateResult = {
                            [waitingKey]: waitingList,
                        };
                        Firestore.collection("users").doc(rejectMember.docId).update(updateResult)
                    })
            });
        }
        const authMember = currentBoardItem.authMember || []
        // 3. board 정보 업데이트
        await Firestore.collection(member.universe + currentBoardItem.sectionType).doc(currentBoardItem.docId)
            .set({
                ...currentBoardItem,
                authWaiting: authWaiting,
                authMember: authMember.concat(approveMemberList),
            }, {merge: true})
        resolve();

    }).catch(async (err) => {
        await statusMessage(dispatch, 'error', err.message);
        throw err.message;
    });
}

export function updateBoardMember(localState) {
    const {
        currentBoardItem,
        member,
        removedJoinMemberList,
    } = localState;
    return dispatch => new Promise(async (resolve, reject) => {
        // 1. 제외된사람 auth 제거
        if (removedJoinMemberList.length >= 0) {
            removedJoinMemberList.forEach(rejectMember => {
                Firestore.collection("users").doc(rejectMember.docId).get()
                    .then(async documentSnapshots => {
                        const data = await documentSnapshots.data();
                        const authKey = currentBoardItem.sectionType + "Auth";
                        const authList = data[authKey] || [];
                        authList.splice(authList.indexOf(currentBoardItem.docId), 1);
                        let updateResult = {
                            [authKey]: authList,
                        };
                        Firestore.collection("users").doc(rejectMember.docId).update(updateResult)
                    })
            });
        }
        // 2. board 정보 업데이트
        await Firestore.collection(member.universe + currentBoardItem.sectionType).doc(currentBoardItem.docId)
            .set({
                ...currentBoardItem,
                authMember: currentBoardItem.authMember,
            }, {merge: true})
        resolve();

    }).catch(async (err) => {
        await statusMessage(dispatch, 'error', err.message);
        throw err.message;
    });
}

export function getBoardList(currentUnivId, member, sectionType) {
    if (Firebase === null) return () => new Promise(resolve => resolve());

    const isUniv = sectionType === 'univ';
    const isHall = sectionType === 'hall';
    const isClub = sectionType === 'club';

    if (isClub && (!member.clubAuth || member.clubAuth.length === 0)) return () => new Promise(resolve => resolve());
    const universe = isHall ? 'hall' : member.universe + sectionType;

    return dispatch => new Promise(async resolve => {
        await statusMessage(dispatch, 'loading', true);
        let collectionReference = Firestore.collection(universe);
        let boardList = [];
        if (!isHall) {
            const boardListSnapshots = await collectionReference.get();
            member[sectionType + 'Auth'].map(auth => {
                boardListSnapshots.docs.forEach(doc => {
                    if (auth.boardId === doc.id) {
                        boardList.push({...doc.data(), docId: doc.id});
                    }
                });
            });
        } else {
            const boardListSnapshots = await collectionReference.doc('total').get();
            const data = boardListSnapshots.data();
            boardList.push({...data, docId: 'total'});
        }
        await statusMessage(dispatch, 'loading', false);
        await statusMessage(dispatch, 'needUpdate', false);
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
    const universe = isHall ? 'hall' : member.universe + sectionType;

    return dispatch => new Promise(async resolve => {

        if (!currentUnivId || currentUnivId === 'default') {
            currentUnivId = member[sectionType + 'Auth'][0].boardId;
        }

        const noticeDocument = await Firestore.collection(universe).doc(currentUnivId).collection("notice").where("isNotice", "==", true).orderBy("createDateTime", 'desc').limit(3).get();
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
    const universe = isHall ? 'hall' : member.universe + sectionType;

    return dispatch => new Promise(async resolve => {

        if (!currentUnivId || currentUnivId === 'default') {
            currentUnivId = member[sectionType + 'Auth'][0].boardId;
        }

        const scheduleDocument = await Firestore.collection(universe).doc(currentUnivId).collection("notice").where("isSchedule", "==", true).orderBy("createDateTime", 'desc').limit(1).get();
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

export function getArticleItem(param) {
    const { universe, currentUnivId, boardType, docId, sectionType } = param;
    if (Firebase === null) return () => new Promise(resolve => resolve());

    return dispatch => new Promise(async resolve => {
        await statusMessage(dispatch, 'loading', true);
        const documentSnapshots = await Firestore.collection(sectionType === 'hall' ? 'hall' : universe + sectionType)
            .doc(currentUnivId).collection(boardType)
            .doc(docId).get();
        await statusMessage(dispatch, 'loading', false);

        return resolve(dispatch({
            type: 'GET_ARTICLE_TOTAL',
            data: {
                article: {...documentSnapshots.data(), docId: documentSnapshots.id}
            }
        }));
    });
}

export function getArticleList(currentUnivId, member, sectionType) {
    if (Firebase === null) return () => new Promise(resolve => resolve());
    const isUniv = sectionType === 'univ';
    const isHall = sectionType === 'hall';
    const isClub = sectionType === 'club';
    const universe = isHall ? 'hall' : member.universe + sectionType;

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
            type: `GET_${sectionType.toUpperCase()}_ARTICLE_LIST`,
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

    const universe = isHall ? 'hall' : member.universe + sectionType;
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
            type: isUniv ? 'GET_UNIV_ARTICLE_LIST_MORE' : 'GET_CLUB_ARTICLE_LIST_MORE',
            data: {
                articleList: dataList,
                currentUnivId: currentUnivId,
            },
        }));
    });
}

export function getUnivNoticeList(member, boardItem) {
    if (Firebase === null) return () => new Promise(resolve => resolve());
    const universe = boardItem.sectionType === 'hall' ? 'hall' : member.universe + boardItem.sectionType;

    return dispatch => new Promise(async resolve => await Firestore.collection(universe).doc(boardItem.docId).collection("notice").where("isNotice", "==", true).orderBy("createDateTime", 'desc').limit(10)
        .get().then(function (documentSnapshots) {
            let dataList = [];
            documentSnapshots.docs.forEach(doc => {
                dataList.push({...doc.data(), docId: doc.id});
            });
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

export function getScheduleDetailList(member, boardItem) {
    if (Firebase === null) return () => new Promise(resolve => resolve());
    if (!member.univAuth || member.univAuth.length === 0) return () => new Promise(resolve => resolve());
    const universe = boardItem.sectionType === 'hall' ? 'hall' : member.universe + boardItem.sectionType;

    return dispatch => new Promise(async resolve => {
        await statusMessage(dispatch, 'loading', true);
        const scheduleDetailListData = await Firestore.collection(universe).doc(boardItem.docId).collection('notice').where("endDatetimeLong", ">", moment().subtract(7, 'days').valueOf()).where("isSchedule", "==", true).limit(10).get();
        let beforeScheduleList = [];
        let afterScheduleList = [];
        const now = Date.now();
        scheduleDetailListData.docs.forEach(article => {
            const articleData = article.data();
            if (articleData.startDatetimeLong > now) {
                afterScheduleList.push({...articleData, currentUnivId: boardItem.docId, sectionType: 'univ', docId:article.id})
            } else {
                beforeScheduleList.push({...articleData, currentUnivId: boardItem.docId, sectionType: 'univ', docId:article.id})
            }
        });

        beforeScheduleList.sort((a, b) => b.startDatetimeLong - a.startDatetimeLong);
        afterScheduleList.sort((a, b) => b.startDatetimeLong - a.startDatetimeLong);

        await statusMessage(dispatch, 'loading', false);
        return resolve(dispatch({
            type: 'UNIV_TOTAL',
            data: {
                beforeScheduleList: beforeScheduleList,
                afterScheduleList: afterScheduleList,
            },
        }));
    });
}

export function getJoiningBoardList(member) {
    if (Firebase === null) return () => new Promise(resolve => resolve());
    return dispatch => new Promise(async resolve => {
        await statusMessage(dispatch, 'loading', true);
        const documentSnapshots = await Firestore.collection(member.universe + 'univ').get().catch(error => {
            console.error(error);
        });

        let dataList = [];
        member.univAuth.map(auth => {
            documentSnapshots.docs.forEach(doc => {
                if(auth.boardId === 'total'){
                    return;
                }
                if (auth.boardId === doc.id && auth.authType === 'S') {
                    dataList.push({...doc.data(), docId: doc.id});
                }
            });
        });
        const clubDocumentSnapshots = await Firestore.collection(member.universe + 'club').get().catch(error => {
            console.error(error);
        });
        member.clubAuth.map(auth => {
            clubDocumentSnapshots.docs.forEach(doc => {
                if (auth.boardId === doc.id && auth.authType === 'S') {
                    dataList.push({...doc.data(), docId: doc.id});
                }
            });
        });
        await statusMessage(dispatch, 'loading', false);
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

        const universeSnapshots = await Firestore.collection(universe + "univ").get();
        let universeBoardList = [];
        universeSnapshots.docs.forEach(doc => {
            if(doc.id !== 'total'){
                universeBoardList.push({...doc.data(), docId: doc.id});
            }
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
        await Firestore.collection("users").doc(member.docId).set({[univType + 'Waiting']: univWaiting}, {merge: true});

        let authWaiting = boardItem.authWaiting || [];
        authWaiting.push(member);
        await Firestore.collection(member.universe + univType).doc(boardItem.docId).set({authWaiting}, {merge: true});

        const docRef = Firestore.collection("users").doc(member.docId);
        return docRef.get().then(doc => {
            return dispatch({
                type: 'USER_DETAILS_UPDATE',
                data: {...doc.data(), docId: doc.id},
            });
        });
    }).catch(async (err) => {
        await statusMessage(dispatch, 'error', err.message);
        throw err.message;
    });
}
export function outBoard(sectionType, boardItem, member) {

    return dispatch => new Promise(async (resolve, reject) => {
        let memberAuthWaiting = member[sectionType + 'Auth'] || [];
        memberAuthWaiting.splice(memberAuthWaiting.findIndex(auth => auth.docId === boardItem.docId), 1);
        await Firestore.collection("users").doc(member.docId).set({[sectionType + 'Auth']: memberAuthWaiting}, {merge: true});
        const docRef = Firestore.collection("users").doc(member.docId);
        return docRef.get().then(doc => {
            return dispatch({
                type: 'USER_DETAILS_UPDATE',
                data: {...doc.data(), docId: doc.id},
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

        const documentRef = await Firestore.collection(param.universe + param.sectionType).doc(param.currentUnivId).collection(param.boardType).doc(param.docId);
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
                article: {...boardItem, docId: documentSnapShat.id, comment: commentList}
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

        const documentRef = await Firestore.collection(param.universe + param.sectionType).doc(param.currentUnivId).collection(param.boardType).doc(param.docId);
        const documentSnapShat = await documentRef.get();
        const boardItem = documentSnapShat.data();
        const commentList = boardItem.comment;
        let removedCommentList = [];
        commentList.forEach(comment => {

            if (!(comment.docId === commentItem.docId) || !(comment.createDateTime === commentItem.createDateTime)) {
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
                article: {...boardItem, docId: documentSnapShat.id, comment: removedCommentList}
            }
        }));

    }).catch(async (err) => {
        await statusMessage(dispatch, 'error', err.message);
        throw err.message;
    });
}


export function addJoiner(param, member) {

    return dispatch => new Promise(async (resolve, reject) => {
        await statusMessage(dispatch, 'loading', true);
        const documentRef = await Firestore.collection(param.sectionType === 'hall' ? 'hall' : param.universe + param.sectionType).doc(param.currentUnivId).collection(param.boardType).doc(param.docId);
        const documentSnapShat = await documentRef.get();
        const boardItem = documentSnapShat.data();
        const joinerList = boardItem.joinerList || [];

        joinerList.push({
            docId: member.docId,
            name: member.name,
            thumb: member.thumb,
            createDateTime: Date.now()
        });

        await documentRef.update({
            joinerList: joinerList
        });
        await statusMessage(dispatch, 'loading', false);
        return resolve(dispatch({
            type: 'GET_ARTICLE_TOTAL',
            data: {
                article: {...boardItem, docId: documentSnapShat.id, joinerList: joinerList}
            }
        }));

    }).catch(async (err) => {
        await statusMessage(dispatch, 'error', err.message);
        throw err.message;
    });
}

export function removeJoiner(param, member) {

    return dispatch => new Promise(async (resolve, reject) => {
        await statusMessage(dispatch, 'loading', true);

        const documentRef = await Firestore.collection(param.sectionType === 'hall' ? 'hall' : param.universe + param.sectionType).doc(param.currentUnivId).collection(param.boardType).doc(param.docId);
        const documentSnapShat = await documentRef.get();
        const boardItem = documentSnapShat.data();
        const joinerList = boardItem.joinerList;
        let removedJoinerList = [];
        joinerList.forEach(joiner => {
            if (joiner.docId !== member.docId) {
                removedJoinerList.push(joiner);
            }
        });
        await documentRef.update({
            joinerList: removedJoinerList
        });
        await statusMessage(dispatch, 'loading', false);
        return resolve(dispatch({
            type: 'GET_ARTICLE_TOTAL',
            data: {
                article: {...boardItem, docId: documentSnapShat.id, joinerList: removedJoinerList}
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
        return dispatch({type: 'UNIV_RESET'});
    }).catch(async (err) => {
        await statusMessage(dispatch, 'error', err.message);
        throw err.message;
    });
}
export function menuLogout() {
    return dispatch => new Promise((resolve, reject) => {
        return dispatch({type: 'MENU_RESET'});
    }).catch(async (err) => {
        await statusMessage(dispatch, 'error', err.message);
        throw err.message;
    });
}


