import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { logout, getOtherUserData } from '../actions/member';

class OtherProfile extends Component {
  static propTypes = {
    Layout: PropTypes.func.isRequired,
    memberLogout: PropTypes.func.isRequired,
  getOtherUserData: PropTypes.func.isRequired,
    member: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      error: PropTypes.string,
    }).isRequired,
  }

  constructor(props) {
      super(props);
      this.props.getOtherUserData(props.docId);
  }

  render = () => {
    const { Layout, member, memberLogout, title} = this.props;

    return <Layout member={member} logout={memberLogout} title={title}/>;
  }
}

const mapStateToProps = state => ({
  member: state.member || {},
});

const mapDispatchToProps = {
    memberLogout: logout,
    getOtherUserData,
};

export default connect(mapStateToProps, mapDispatchToProps)(OtherProfile);
