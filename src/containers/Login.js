import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {login, findEmail, clearFindEmail, resetPassword} from '../actions/member';

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

    render = () => {
        const { Layout, onFormSubmit, isLoading, member, infoMessage, errorMessage, successMessage, findEmail, clearFindEmail, resetPassword, backPressSubscriptions} = this.props;

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
            backPressSubscriptions={backPressSubscriptions}
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
