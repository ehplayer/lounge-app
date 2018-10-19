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
    const { Layout, userList, approveUser } = this.props;
    return <Layout userList={userList} approveUser={approveUser}/>;
  }
}

const mapStateToProps = state => ({
  userList: state.member.userList || [],
  member: state.member || [],
  loading: state.loading || false,
});

const mapDispatchToProps = {
  memberLogout: logout,
  getAuthRequestMemberListData,
  approveUser
};

export default connect(mapStateToProps, mapDispatchToProps)(Scheduler);
