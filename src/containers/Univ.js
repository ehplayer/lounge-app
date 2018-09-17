import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Actions} from 'react-native-router-flux';
import { getArticleList, getBoardList, getNoticeList, getScheduleList, setError, getUnivTotal, getArticleListMore} from '../actions/univ';
class UnivContainer extends React.Component {
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
    getScheduleList: PropTypes.func.isRequired,
    getBoardList: PropTypes.func.isRequired,
    getUnivTotal: PropTypes.func.isRequired,
    getNoticeList: PropTypes.func.isRequired,
    setError: PropTypes.func.isRequired,
  }

  static defaultProps = {
    match: null,
  };
  constructor(props) {
    super(props);
    if(props.member.name){
      console.log(props)
      this.fetchUniv(null, props.member);
    };
  };

  componentWillReceiveProps (nextProps){
    if(!nextProps.member.name){
      Actions.login();
    }
  }

  /**
    * Fetch Data from API, saving to Redux
    */
  fetchUniv = (currentUnivId, member) => {
    this.props.getBoardList(currentUnivId, member, 'univ').catch((err) => console.log(`Error: ${err}`));
    this.props.getNoticeList(currentUnivId, member, 'univ').catch((err) => console.log(`Error: ${err}`));
    this.props.getScheduleList(currentUnivId, member, 'univ').catch((err) => console.log(`Error: ${err}`));
    return this.props.getArticleList(currentUnivId, member, 'univ');
  }

  render = () => {
    const { Layout, univ, match, member, status} = this.props;
    const id = (match && match.params && match.params.id) ? match.params.id : null;
    return (
      <Layout
        recipeId={id}
        error={univ.error}
        loading={status.loading}
        univ={univ}
        member={member}
        reFetch={this.fetchUniv}
        moreFetch={this.props.getArticleListMore}
      />
    );
  }
}

const mapStateToProps = state => ({
  univ: state.univ || {},
  status: state.status || {},
  member: state.member || {},
  currentUnivId: state.currentUnivId || '',
});
const mapDispatchToProps = {
  getUnivTotal,
  getNoticeList,
  getScheduleList,
  getBoardList,
  getArticleList,
  getArticleListMore,
  setError,
};

export default connect(mapStateToProps, mapDispatchToProps)(UnivContainer);
