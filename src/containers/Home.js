import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import {getHomeNotice, getHomeSchedule} from '../actions/home';
import {clearFindEmail, findEmail, login, resetPassword, updatePushNotiAllow} from '../actions/member';
import {Notifications, Permissions} from "expo";
import Login from "../native/components/Login";

class HomeContainer extends React.Component {
    static propTypes = {
        Layout: PropTypes.func.isRequired,
        home: PropTypes.shape({
            loading: PropTypes.bool.isRequired,
            error: PropTypes.object,
            noticeList: PropTypes.arrayOf(PropTypes.shape()),
            scheduleList: PropTypes.arrayOf(PropTypes.shape()),
        }).isRequired,
        match: PropTypes.shape({
            params: PropTypes.shape({}),
        }),
        getHomeNotice: PropTypes.func.isRequired,
        getHomeSchedule: PropTypes.func.isRequired,
    }

    static defaultProps = {
        match: null,
    };

    constructor(props) {
        super(props);

        this.state = {
            memberEmail : this.props.member.email,
        };

    };
    componentDidMount() {
        if (!this.props.member.name) {
            return;
        }

        this.registerForPushNotificationsAsync()
        this.fetchTotalHome(this.props.member);
    }

    registerForPushNotificationsAsync = async () => {
        const { existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

        let finalStatus = existingStatus;

        // only ask if permissions have not already been determined, because
        // iOS won't necessarily prompt the user a second time.
        if (existingStatus !== 'granted') {
            // Android remote notification permissions are granted during the app
            // install, so this will only ask on iOS
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }
        if (finalStatus === 'undetermined'){
            return;
        }

        if (finalStatus !== 'granted') {
            this.props.updatePushNotiAllow(finalStatus, false);
            return finalStatus;
        }

        // Get the token that uniquely identifies this device
        let token = await Notifications.getExpoPushTokenAsync();
        this.props.updatePushNotiAllow(finalStatus, token);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.status.needUpdate){
            this.fetchTotalHome(this.props.member);
        }
    }

    /**
     * Fetch Data from API, saving to Redux
     */
    fetchTotalHome = (member) => {
        return this.props.getHomeNotice(member)
            .then(() => this.props.getHomeSchedule(member))
            .catch((err) => {
                console.log(`Error: ${err}`);
                return this.props.setError(err);
            });
    }

    render = () => {
        const {Layout, home, member, status, login, findEmail, clearFindEmail, resetPassword} = this.props;
        if (!member || !member.name || member.authWaiting) {
            return <Login
                member={member}
                loading={status.loading}
                error={status.error}
                login={login}
                findEmail={findEmail}
                clearFindEmail={clearFindEmail}
                resetPassword={resetPassword}
                fromLogin={true}
            />;
        }

        return (
            <Layout
                error={status.error}
                loading={status.loading}
                home={home}
                member={member}
                reFetch={this.fetchTotalHome}
            />
        );
    }
}

const mapStateToProps = state => ({
    home: state.home || {},
    status: state.status || {},
    member: state.member || {},
    currentUnivId: state.currentUnivId || '전체',
});
const mapDispatchToProps = {
    getHomeNotice,
    getHomeSchedule,
    updatePushNotiAllow,
    login,
    findEmail,
    clearFindEmail,
    resetPassword
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);
