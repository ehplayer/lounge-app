import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { logout, updateProfile, deleteUser} from '../actions/member';

const UpdateProfile = ({
  Layout,
  onFormSubmit,
  member,
  isLoading,
  errorMessage,
  successMessage,
  logout,
  deleteUser
}) => (
  <Layout
    member={member}
    loading={isLoading}
    error={errorMessage}
    success={successMessage}
    onFormSubmit={onFormSubmit}
    logout={logout}
    deleteUser={deleteUser}
  />
);

UpdateProfile.propTypes = {
  Layout: PropTypes.func.isRequired,
  member: PropTypes.shape({}).isRequired,
  onFormSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
  successMessage: PropTypes.string,
};

UpdateProfile.defaultProps = {
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
  onFormSubmit: updateProfile,
  logout: logout,
  deleteUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfile);
