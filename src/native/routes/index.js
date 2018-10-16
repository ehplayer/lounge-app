import React from 'react';
import {Drawer, Scene, Stack} from 'react-native-router-flux';

import UnivContainer from '../../containers/Univ';
import UnivComponent from '../components/Univ';
import BoardComponent from '../components/Board';

import HallContainer from '../../containers/Hall';
import HallComponent from '../components/Hall';

import ClubContainer from '../../containers/Club';
import ClubComponent from '../components/Club';

import LoginContainer from '../../containers/Login';
import LoginComponent from '../components/Login';
import TermsContainer from '../../containers/Terms';
import TermsComponent from '../components/Terms';

import NoticeContainer from '../../containers/Notice';
import NoticeComponent from '../components/Notice';
import NoticeListContainer from '../../containers/NoticeList';
import NoticeListComponent from '../components/NoticeList';
import HomeNoticeListContainer from '../../containers/HomeNoticeList';
import HomeNoticeListComponent from '../components/HomeNoticeList';
import ScheduleListContainer from '../../containers/ScheduleList';
import ScheduleListComponent from '../components/ScheduleList';
import HomeScheduleListContainer from '../../containers/HomeScheduleList';
import HomeScheduleListComponent from '../components/HomeScheduleList';

import ForgotPasswordContainer from '../../containers/ForgotPassword';
import ForgotPasswordComponent from '../components/ForgotPassword';

import UpdateProfileContainer from '../../containers/UpdateProfile';
import UpdateProfileComponent from '../components/UpdateProfile';

import SignUpContainer from '../../containers/SignUp';
import SignUpComponent from '../components/SignUp';

import SchedulerContainer from '../../containers/Scheduler';
import SchedulerComponent from '../components/Scheduler';

import SchedulerSearchContainer from '../../containers/SchedulerSearch';
import SchedulerSearchComponent from '../components/SchedulerSearch';

import MemberSearchContainer from '../../containers/MemberSearch';
import MemberSearchComponent from '../components/MemberSearch';

import CreateArticleContainer from '../../containers/CreateArticle';
import CreateArticleComponent from '../components/CreateArticle';

import CreateBoardContainer from '../../containers/CreateBoard';
import CreateBoardComponent from '../components/CreateBoard';

import ManageBoardContainer from '../../containers/ManageBoard';
import ManageBoardComponent from '../components/ManageBoard';

import BoardListContainer from '../../containers/BoardList';
import BoardListComponent from '../components/BoardList';

import MemberContainer from '../../containers/Member';
import ProfileContainer from '../../containers/Profile';
import ProfileComponent from '../components/Profile';
import HomeComponent from '../components/Home';
import HomeContainer from '../../containers/Home';
import AuthWatingComponent from '../components/AuthWating';

import DrawerContent from '../components/DrawerContent';

import MenuNavBar from '../components/navBar/MenuNavBar';
import SchedulerSearchNavBar from '../components/navBar/SchedulerSearchNavBar';
import SchedulerNavBar from '../components/navBar/SchedulerNavBar';
import ScheduleNavBar from '../components/navBar/SchduleNavBar';

import CreateArticleNavBar from '../components/navBar/CreateArticleNavBar';
import TextNavBar from '../components/navBar/TextNavBar';
import OnlyLogoNavBar from '../components/navBar/OnlyLogoNavBar';
import MenuIcon from '../../images/menu_burger.png'

const Index = (
  <Stack key="root">
    <Scene
      hideNavBar
      initial
      key="login"
      back={false}
      component={LoginContainer}
      Layout={LoginComponent}
    />
    <Scene
      key="terms"
      navBar={OnlyLogoNavBar}
      component={TermsContainer}
      Layout={TermsComponent}
    />

    <Scene
    //initial
      key="signup"
      title="회원가입"
      titleColorArray={['#394eb7','#6965dc']}
      navBar={TextNavBar}
      component={SignUpContainer}
      Layout={SignUpComponent}
    />

    <Scene
        key="authWaiting"
        title=""
        titleColorArray={['#394eb7','#4a57ba']}
        navBar={TextNavBar}
        component={MemberContainer}
        Layout={AuthWatingComponent}/>


    <Scene
      back
      key="forgotPassword"
      title="FORGOT PASSWORD"
      component={ForgotPasswordContainer}
      Layout={ForgotPasswordComponent}
    />
    <Scene
      back
      key="updateProfile"
      title="내 프로필 수정"
      titleColorArray={['#394eb7','#6965dc']}
      navBar={TextNavBar}
      component={UpdateProfileContainer}
      Layout={UpdateProfileComponent}
    />

    <Scene
      back
      key="profileHome"
      title="내 프로필 확인"
      titleColorArray={['#394eb7','#6965dc']}
      navBar={TextNavBar}
      component={UpdateProfileContainer} Layout={ProfileComponent}/>

    <Scene
      back
      key="scheduler"
      title="원우수첩"
      titleColorArray={['#394eb7','#6965dc']}
      navBar={SchedulerNavBar}
      component={SchedulerContainer} Layout={SchedulerComponent}/>
    <Scene
      back
      key="schedulerSearch"
      titleColorArray={['#394eb7','#6965dc']}
      navBar={SchedulerSearchNavBar}
      component={SchedulerSearchContainer} Layout={SchedulerSearchComponent}/>

    <Scene
      back
      key="memberSearch"
      titleColorArray={['#394eb7','#6965dc']}
      navBar={SchedulerSearchNavBar}
      component={MemberSearchContainer} Layout={MemberSearchComponent}/>

    <Drawer
      key="drawer"
      //initial
      hideNavBar
      contentComponent={DrawerContent}
      drawerImage={MenuIcon}
    >
      <Scene key="hall" navBar={MenuNavBar} component={HallContainer} Layout={BoardComponent}/>
      <Scene initial key="home" navBar={MenuNavBar} component={HomeContainer} Layout={HomeComponent}/>
      <Scene  key="univ" navBar={MenuNavBar} component={UnivContainer} Layout={BoardComponent}/>
      <Scene key="club" navBar={MenuNavBar} component={ClubContainer} Layout={BoardComponent}/>
    </Drawer>
    <Scene
      back
      key="schedule" navBar={ScheduleNavBar} component={UnivContainer} Layout={UnivComponent}/>
    <Scene
      back
      key="noticeList"
      titleColorArray={['#2867ae', '#2867ae']}
      navBar={TextNavBar} component={NoticeListContainer} Layout={NoticeListComponent}/>

    <Scene
      back
      key="homeNoticeList"
      titleColorArray={['#394eb7','#6965dc']}
      navBar={TextNavBar} component={HomeNoticeListContainer} Layout={HomeNoticeListComponent}/>

    <Scene
      back
      key="scheduleList"
      titleColorArray={['#2867ae', '#2867ae']}
      navBar={TextNavBar} component={ScheduleListContainer} Layout={ScheduleListComponent}/>
    <Scene
      back
      key="homeScheduleList"
      titleColorArray={['#394eb7','#6965dc']}
      navBar={TextNavBar} component={HomeScheduleListContainer} Layout={HomeScheduleListComponent}/>

    <Scene
      back
      key="createBoard"
      title="Univ. / Club 만들기"
      titleColorArray={['#394eb7','#6965dc']}
      navBar={TextNavBar}
      component={CreateBoardContainer}
      Layout={CreateBoardComponent}
    />
    <Scene
      back
      key="manageBoard"
      title="Univ. / Club 관리"
      //initial
      titleColorArray={['#394eb7','#6965dc']}
      navBar={TextNavBar}
      component={ManageBoardContainer}
      Layout={ManageBoardComponent}
    />

    <Scene
      back
      key="boardList"
      title="Univ. / Club 목록"
      titleColorArray={['#394eb7','#6965dc']}
      navBar={TextNavBar} component={BoardListContainer} Layout={BoardListComponent}/>
    <Scene

      back
      navBar={CreateArticleNavBar}
      key="createArticle"
      component={CreateArticleContainer}
      Layout={CreateArticleComponent}
    />

    <Scene
      back
      key="notice"
      navBar={CreateArticleNavBar}
      component={NoticeContainer}
      Layout={NoticeComponent}
    />
  </Stack>
);

export default Index;
