import {Firebase, Firestore} from '../lib/firebase';
import statusMessage from './status';


export function getHomeNotice(member) {
  if (Firebase === null) return () => new Promise(resolve => resolve());
  if(!member.univAuth || member.univAuth.length === 0) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(async resolve => {
    await statusMessage(dispatch, 'loading', true);
    const homeNoticeListData = await Firestore.collection(member.universe + 'home').doc('notice').get();
    const homeNotice = homeNoticeListData.data() || {};
    let noticeList = [];

    member.univAuth.forEach(auth =>{
      if(homeNotice[auth.boardId]){
        homeNotice[auth.boardId].forEach(article => noticeList.push({...article,currentUnivId:auth.boardId, sectionType:'univ'}))
      }

    });
    member.clubAuth.forEach(auth =>{
      if(homeNotice[auth.boardId]){
        homeNotice[auth.boardId].forEach(article => noticeList.push({...article,currentUnivId:auth.boardId, sectionType:'club'}))
      }
    });
    if(homeNotice['hall']){
      homeNotice['hall'].forEach(article => noticeList.push({...article,currentUnivId:auth.boardId, sectionType:'hall'}))
    }
    noticeList.sort((a,b) => b.createDateTime - a.createDateTime);

    await statusMessage(dispatch, 'loading', false);
    return resolve(dispatch({
      type: 'HOME_TOTAL',
      data: {
        noticeList: noticeList,
      },
    }));
  });
}

export function getHomeSchedule(member) {
    if (Firebase === null) return () => new Promise(resolve => resolve());
    if(!member.univAuth || member.univAuth.length === 0) return () => new Promise(resolve => resolve());

    return dispatch => new Promise(async resolve => {
        const homeScheduleListData = await Firestore.collection(member.universe + 'home').doc('schedule').get();
        const homeSchedule = homeScheduleListData.data() || {};
        let scheduleList = [];
        const now = Date.now();

        member.univAuth.forEach(auth =>{
            if(homeSchedule[auth.boardId]){
                homeSchedule[auth.boardId].forEach(article => {
                    if(article.startDatetimeLong > now)
                        scheduleList.push({...article, currentUnivId:auth.boardId, sectionType:'univ'})
                });
            }
        });
        member.clubAuth.forEach(auth =>{
            if(homeSchedule[auth.boardId]){
                homeSchedule[auth.boardId].forEach(article => {
                    if(article.startDatetimeLong > now)
                        scheduleList.push({...article,currentUnivId:auth.boardId, sectionType:'club'})
                });
            }
        });
        if(homeSchedule['hall']){
            homeSchedule['hall'].forEach(article => {
                if(article.startDatetimeLong > now)
                    scheduleList.push({...article, currentUnivId:auth.boardId, sectionType:'hall'})
            });
        }
        scheduleList.sort((a,b) => a.startDatetimeLong - b.startDatetimeLong);

        return resolve(dispatch({
            type: 'HOME_TOTAL',
            data: {
                scheduleList: scheduleList,
            },
        }));
    });
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
        afterScheduleList.sort((a,b) => a.startDatetimeLong - b.startDatetimeLong);

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

