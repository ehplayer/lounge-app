import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logout, getMemberData } from '../actions/member';
import { univLogout } from '../actions/univ';

class Profile extends Component {
  static propTypes = {
    Layout: PropTypes.func.isRequired,
    memberLogout: PropTypes.func.isRequired,
    getMemberData: PropTypes.func.isRequired,
    member: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      error: PropTypes.string,
    }).isRequired,
  }

  componentDidMount = () => {
    this.props.getMemberData();
  }

  logout = () => {
    this.props.univLogout();
    this.props.memberLogout();
  };

  render = () => {
    const { Layout, member, title} = this.props;
    return <Layout member={member} logout={this.logout} title={title}/>;
  }
}

const mapStateToProps = state => ({
  member: state.member || {},
});

const mapDispatchToProps = {
  memberLogout: logout,
  univLogout: univLogout,
  getMemberData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
