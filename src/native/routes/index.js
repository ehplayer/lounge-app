import React from 'react';
import {Drawer, Scene, Stack} from 'react-native-router-flux';

import UnivContainer from '../../containers/Univ';
import UnivComponent from '../components/Univ';
import BoardComponent from '../components/Board';

import HallContainer from '../../containers/Hall';

import ClubContainer from '../../containers/Club';

import LoginContainer from '../../containers/Login';
import LoginComponent from '../components/Login';
import TermsContainer from '../../containers/Terms';
import TermsComponent from '../components/Terms';
import TermsServiceComponent from '../components/TermsService';
import TermsUserComponent from '../components/TermsUser';

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

import UpdateProfileContainer from '../../containers/UpdateProfile';
import UpdateProfileComponent from '../components/UpdateProfile';

import SignUpContainer from '../../containers/SignUp';
import SignUpComponent from '../components/SignUp';

import SchedulerContainer from '../../containers/Scheduler';
import SchedulerComponent from '../components/Scheduler';

import JoinUserListContainer from '../../containers/JoinUserList';
import JoinUserListComponent from '../components/JoinUserList';

import SchedulerSearchContainer from '../../containers/SchedulerSearch';
import SchedulerSearchComponent from '../components/SchedulerSearch';

import MemberSearchContainer from '../../containers/MemberSearch';
import MemberSearchComponent from '../components/MemberSearch';

import CreateArticleContainer from '../../containers/CreateArticle';
import CreateArticleComponent from '../components/CreateArticle';

import UpdateArticleContainer from '../../containers/UpdateArticle';
import UpdateArticleComponent from '../components/UpdateArticle';

import CreateBoardContainer from '../../containers/CreateBoard';
import CreateBoardComponent from '../components/CreateBoard';

import ManageBoardContainer from '../../containers/ManageBoard';
import ManageBoardComponent from '../components/ManageBoard';

import ManageJoinMemberContainer from '../../containers/ManageJoinMember';
import ManageJoinMemberComponent from '../components/ManageJoinMember';

import ManageWaitingMemberContainer from '../../containers/ManageWaitingMember';
import ManageWaitingMemberComponent from '../components/ManageWaitingMember';

import ManageUserContainer from '../../containers/ManageUser';
import ManageUserComponent from '../components/ManageUser';

import BoardListContainer from '../../containers/BoardList';
import BoardListComponent from '../components/BoardList';

import MemberContainer from '../../containers/Member';
import ProfileComponent from '../components/Profile';

import OtherProfileContainer from '../../containers/OtherProfile';
import OtherProfileComponent from '../components/OtherProfile';

import HomeComponent from '../components/Home';
import HomeContainer from '../../containers/Home';
import AuthWaitingComponent from '../components/AuthWating';

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
            //initial
            key="login"
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
            key="termsService"
            title="서비스 이용약관"
            navBar={TextNavBar}
            component={TermsContainer}
            Layout={TermsServiceComponent}
        />

        <Scene
            key="termsUser"
            title="개인정보 제공 및 이용"
            navBar={TextNavBar}
            component={TermsContainer}
            Layout={TermsUserComponent}
        />

        <Scene
            key="signUp"
            title="회원가입"
            titleColorArray={['#394eb7', '#6965dc']}
            navBar={TextNavBar}
            component={SignUpContainer}
            Layout={SignUpComponent}
        />

        <Scene
            key="authWaiting"
            title=""
            titleColorArray={['#394eb7', '#4a57ba']}
            navBar={TextNavBar}
            component={MemberContainer}
            Layout={AuthWaitingComponent}/>

        <Scene
            back
            key="updateProfile"
            title="내 프로필 수정"
            titleColorArray={['#394eb7', '#6965dc']}
            navBar={TextNavBar}
            component={UpdateProfileContainer}
            Layout={UpdateProfileComponent}
        />

        <Scene
            back
            key="profileHome"
            title="내 프로필 확인"
            titleColorArray={['#394eb7', '#6965dc']}
            navBar={TextNavBar}
            component={UpdateProfileContainer} Layout={ProfileComponent}/>

        <Scene
            back
            key="otherProfile"
            title="프로필"
            titleColorArray={['#394eb7', '#6965dc']}
            navBar={TextNavBar}
            component={OtherProfileContainer} Layout={OtherProfileComponent}/>

        <Scene
            back
            key="scheduler"
            title="원우수첩"
            titleColorArray={['#394eb7', '#6965dc']}
            navBar={SchedulerNavBar}
            component={SchedulerContainer} Layout={SchedulerComponent}/>
        <Scene
            back
            key="schedulerSearch"
            titleColorArray={['#394eb7', '#6965dc']}
            navBar={SchedulerSearchNavBar}
            component={SchedulerSearchContainer} Layout={SchedulerSearchComponent}/>

        <Scene
            back
            key="memberSearch"
            titleColorArray={['#394eb7', '#6965dc']}
            navBar={SchedulerSearchNavBar}
            component={MemberSearchContainer} Layout={MemberSearchComponent}/>


        <Drawer
            key="drawer"
            initial
            hideNavBar
            contentComponent={DrawerContent}
            drawerImage={MenuIcon}
        >
            <Scene key="hall" navBar={MenuNavBar} component={HallContainer} Layout={BoardComponent}/>
            <Scene initial key="home" navBar={MenuNavBar} component={HomeContainer} Layout={HomeComponent}/>
            <Scene key="univ" navBar={MenuNavBar} component={UnivContainer} Layout={BoardComponent}/>
            <Scene key="club" navBar={MenuNavBar} component={ClubContainer} Layout={BoardComponent}/>
        </Drawer>
        <Scene
            back
            key="noticeList"
            titleColorArray={['#2867ae', '#2867ae']}
            navBar={CreateArticleNavBar} component={NoticeListContainer} Layout={NoticeListComponent}/>

        <Scene
            back
            key="joinUserList"
            title="참석 원우 목록"
            navBar={CreateArticleNavBar} component={JoinUserListContainer} Layout={JoinUserListComponent}/>

        <Scene
            back
            key="homeNoticeList"
            titleColorArray={['#394eb7', '#6965dc']}
            navBar={TextNavBar} component={HomeNoticeListContainer} Layout={HomeNoticeListComponent}/>

        <Scene
            back
            key="scheduleList"
            titleColorArray={['#2867ae', '#2867ae']}
            title="일정"
            navBar={CreateArticleNavBar} component={ScheduleListContainer} Layout={ScheduleListComponent}/>

        <Scene
            back
            key="homeScheduleList"
            titleColorArray={['#394eb7', '#6965dc']}
            navBar={TextNavBar} component={HomeScheduleListContainer} Layout={HomeScheduleListComponent}/>

        <Scene
            back
            key="createBoard"
            //initial
            title="Univ. / Club 생성"
            titleColorArray={['#394eb7', '#6965dc']}
            navBar={TextNavBar}
            component={CreateBoardContainer}
            Layout={CreateBoardComponent}
        />
        <Scene
            key="manageBoard"
            //initial
            title="Univ. / Club 관리"
            titleColorArray={['#394eb7', '#6965dc']}
            navBar={TextNavBar}
            component={ManageBoardContainer}
            Layout={ManageBoardComponent}
        />

        <Scene
            back
            key="manageWaitingMember"
            title="가입 승인 관리"
            titleColorArray={['#394eb7', '#6965dc']}
            navBar={TextNavBar}
            component={ManageWaitingMemberContainer}
            Layout={ManageWaitingMemberComponent}
        />

        <Scene
            back
            key="manageJoinMember"
            title="원우 관리"
            titleColorArray={['#394eb7', '#6965dc']}
            navBar={TextNavBar}
            component={ManageJoinMemberContainer}
            Layout={ManageJoinMemberComponent}
        />

        <Scene
            back
            key="approveBoard"
            title="Univ. / Club 승인"
            titleColorArray={['#394eb7', '#6965dc']}
            navBar={TextNavBar}
            component={ManageUserContainer}
            Layout={ManageUserComponent}
        />

        <Scene
            back
            key="manageUser"
            title="서비스 사용 승인"
            titleColorArray={['#394eb7', '#6965dc']}
            navBar={TextNavBar}
            component={ManageUserContainer}
            Layout={ManageUserComponent}
        />

        <Scene
            back
            key="boardList"
            title="Univ. / Club 목록"
            titleColorArray={['#394eb7', '#6965dc']}
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
            navBar={CreateArticleNavBar}
            key="updateArticle"
            component={UpdateArticleContainer}
            Layout={UpdateArticleComponent}
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
