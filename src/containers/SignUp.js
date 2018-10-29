import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { logout, createProfile } from '../actions/member';

const CreateProfile = ({
                           Layout,
                           createProfile,
                           member,
                           isLoading,
                           errorMessage,
                           successMessage,
                           logout,
                            param
                       }) => (
    <Layout
        member={member}
        loading={isLoading}
        error={errorMessage}
        success={successMessage}
        createProfile={createProfile}
        logout={logout}
        param={param}
    />
);

CreateProfile.propTypes = {
    Layout: PropTypes.func.isRequired,
    member: PropTypes.shape({}).isRequired,
    isLoading: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string,
    successMessage: PropTypes.string,
};

CreateProfile.defaultProps = {
    errorMessage: null,
    successMessage: null,
};

const mapStateToProps = state => ({
    member: state.member || {},
    isLoading: state.status.loading || false,
    errorMessage: state.status.error || null,
    successMessage: state.status.success || null,
});

const mapDispatchToProps = {
    createProfile,
    logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateProfile);
