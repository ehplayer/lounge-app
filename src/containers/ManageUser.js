import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getMemberListData, logout, getAuthRequestMemberListData} from '../actions/member';

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
    const { Layout, userList, memberLogout, ownerList } = this.props;
    return <Layout userList={userList} logout={memberLogout} ownerList={ownerList}/>;
  }
}

const mapStateToProps = state => ({
  ownerList: state.member.ownerList || [],
  userList: state.member.userList || [],
  member: state.member || [],
  loading: state.loading || false,
});

const mapDispatchToProps = {
  memberLogout: logout,
  getAuthRequestMemberListData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Scheduler);
