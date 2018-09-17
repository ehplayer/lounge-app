import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { logout, getSearchMemberList } from '../actions/member';

class Scheduler extends Component {
  static propTypes = {
    Layout: PropTypes.func.isRequired,
    getSearchMemberList: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      initialize: false,
    };
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      ...this.state,
      initialize: true,
    });
  }

  render = () => {
    const { Layout, searchUserList, memberLogout, getSearchMemberList} = this.props;
    return <Layout searchUserList={this.state.initialize ? searchUserList : []} logout={memberLogout} getSearchMemberList={getSearchMemberList}/>;
  }
}

const mapStateToProps = state => ({
  searchUserList: state.member.searchUserList || [],
  loading: state.loading || false,
});

const mapDispatchToProps = {
  getSearchMemberList,
};

export default connect(mapStateToProps, mapDispatchToProps)(Scheduler);
