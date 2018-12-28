import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getMemberListData, getMemberListMoreData} from '../actions/member';

class Scheduler extends Component {
  static propTypes = {
    Layout: PropTypes.func.isRequired,
    getMemberListData: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.props.getMemberListData(props.member);
  };

  render = () => {
    const { Layout, userList, memberLogout, ownerList, loading, getMemberListMoreData} = this.props;
    return <Layout userList={userList} logout={memberLogout} ownerList={ownerList} loading={loading} getMemberListMoreData={getMemberListMoreData}/>;
  }
}

const mapStateToProps = state => ({
  ownerList: state.member.ownerList || [],
  userList: state.member.userList || [],
  member: state.member || [],
  loading: state.loading || false,
});

const mapDispatchToProps = {
  getMemberListData,
  getMemberListMoreData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Scheduler);
