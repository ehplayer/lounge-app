import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {login, findEmail, clearFindEmail, resetPassword} from '../actions/member';
import {Actions} from "react-native-router-flux";

class LoginContainer extends React.Component {
    static propTypes = {
        Layout: PropTypes.func.isRequired,
        member: PropTypes.shape({}).isRequired,
        onFormSubmit: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        infoMessage: PropTypes.string,
        errorMessage: PropTypes.string,
        successMessage: PropTypes.string,
    };

    static defaultProps = {
        infoMessage: null,
        errorMessage: null,
        successMessage: null,
    };

    constructor(props) {
        super(props);
    };

    render = () => {
        const { Layout, onFormSubmit, isLoading, member, infoMessage, errorMessage, successMessage, findEmail, clearFindEmail, resetPassword} = this.props;

        return <Layout
            member={member}
            loading={isLoading}
            info={infoMessage}
            error={errorMessage}
            success={successMessage}
            onFormSubmit={onFormSubmit}
            findEmail={findEmail}
            clearFindEmail={clearFindEmail}
            resetPassword={resetPassword}
        />
    }
}

const mapStateToProps = state => ({
    member: state.member || {},
    isLoading: state.status.loading || false,
    infoMessage: state.status.info || null,
    errorMessage: state.status.error || null,
    successMessage: state.status.success || null,
});

const mapDispatchToProps = {
    onFormSubmit: login,
    findEmail,
    clearFindEmail,
    resetPassword
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
