import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getHomeScheduleList } from '../actions/home';
import {Actions} from "react-native-router-flux";
class HomeScheduleList extends React.Component {
  static propTypes = {
    Layout: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({}),
    }),
    univBoardList: PropTypes.array,
  }

  static defaultProps = {
    match: null,
  };
  constructor(props) {
    super(props);
    this.props.getHomeScheduleList(props.member)
  };

  componentWillReceiveProps (nextProps){
    if(!nextProps.member.name){
      Actions.login();
    }
  }

  render = () => {
    const { Layout, home, match, member, status} = this.props;

    return (
      <Layout
        error={home.error}
        loading={status.loading}
        home={home}
        member={member}
        reFetch={this.props.getHomeNotice}
      />
    );
  }
}

const mapStateToProps = state => ({
  home: state.home || {},
  status: state.status || {},
  member: state.member || {},
});
const mapDispatchToProps = {
  getHomeScheduleList,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScheduleList);
