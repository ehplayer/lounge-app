import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Actions} from 'react-native-router-flux';
import { setError, getUnivTotal, getUnivNoticeList} from '../actions/univ';
class NoticeList extends React.Component {
  static propTypes = {
    Layout: PropTypes.func.isRequired,
    univ: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      error: PropTypes.object,
      univNotice: PropTypes.arrayOf(PropTypes.shape()),
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({}),
    }),
    univBoardList: PropTypes.array,
    getUnivTotal: PropTypes.func.isRequired,
    getUnivNoticeList: PropTypes.func.isRequired,
    setError: PropTypes.func.isRequired,
  }

  static defaultProps = {
    match: null,
  };
  constructor(props) {
    super(props);
    this.props.getUnivNoticeList(props.univ, props.member, 'univ');

  };

  componentWillReceiveProps (nextProps){
    if(!nextProps.member.name){
      Actions.login();
      return;
    }
  }

  /**
    * Fetch Data from API, saving to Redux
    */
  fetchUniv = (currentUnivId, member) => {

    return this.props.getUnivTotal(currentUnivId, member, 'univ')
      .catch((err) => {
        console.log(`Error: ${err}`);
        return this.props.setError(err);
      });
  }

  render = () => {
    const { Layout, univ, sectionType, member, status} = this.props;
    return (
      <Layout
        error={univ.error}
        loading={status.loading}
        univ={univ}
        member={member}
        reFetch={this.fetchUniv}
        sectionType={sectionType}
      />
    );
  }
}

const mapStateToProps = state => ({
  univ: state.univ || {},
  status: state.status || {},
  member: state.member || {},
});
const mapDispatchToProps = {
  getUnivTotal,
  getUnivNoticeList,
  setError,
};

export default connect(mapStateToProps, mapDispatchToProps)(NoticeList);
