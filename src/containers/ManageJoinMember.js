import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import {setError, updateBoardMember} from '../actions/univ';

class ManageJoinMember extends React.Component {
    static propTypes = {
        Layout: PropTypes.func.isRequired,
        setError: PropTypes.func.isRequired,
    }

    static defaultProps = {
        match: null,
    };

    constructor(props) {
        super(props);
        if (!props.member.name) {
            Actions.login();
            return;
        }
    };

    render = () => {
        const {Layout, menu, member, status, updateBoardMember, boardItem} = this.props;
        return (
            <Layout
                error={menu.error}
                loading={status.loading}
                menu={menu}
                member={member}
                updateBoardMember={updateBoardMember}
                boardItem={boardItem}
            />
        );
    }
}

const mapStateToProps = state => ({
    menu: state.menu || {},
    status: state.status || {},
    member: state.member || {},
    currentUnivId: state.currentUnivId || '전체',
});
const mapDispatchToProps = {
    updateBoardMember,
    setError,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageJoinMember);
