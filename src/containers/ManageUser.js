import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {approveUser, logout, getAuthRequestMemberListData} from '../actions/member';

class Scheduler extends Component {
  static propTypes = {
    Layout: PropTypes.func.isRequired,
    getAuthRequestMemberListData: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.props.getAuthRequestMemberListData(props.member);
  };

  render = () => {
    const { Layout, authRequestUserList, approveUser } = this.props;
    return <Layout authRequestUserList={authRequestUserList} approveUser={approveUser}/>;
  }
}

const mapStateToProps = state => ({
  authRequestUserList: state.member.authRequestUserList || [],
  member: state.member || [],
  loading: state.loading || false,
});

const mapDispatchToProps = {
  memberLogout: logout,
  getAuthRequestMemberListData,
  approveUser
};

export default connect(mapStateToProps, mapDispatchToProps)(Scheduler);
