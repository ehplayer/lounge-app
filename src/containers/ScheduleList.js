import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getScheduleDetailList } from '../actions/univ';
class ScheduleList extends React.Component {
  static propTypes = {
    Layout: PropTypes.func.isRequired,
    univBoardList: PropTypes.array,
  }

  constructor(props) {
    super(props);
    this.props.getScheduleDetailList(props.member, props.boardItem)
  };

  render = () => {
    const { Layout, univ, member} = this.props;
    return (
      <Layout
        univ={univ}
        member={member}
        reFetch={(currentUnivId) => this.fetchUniv(currentUnivId)}
      />
    );
  }
}

const mapStateToProps = state => ({
  member: state.member || {},
  univ: state.univ || {},
  univBoardList: state.univBoardList || [],
});
const mapDispatchToProps = {
  getScheduleDetailList,
};

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleList);
