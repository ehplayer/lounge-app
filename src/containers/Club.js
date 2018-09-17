import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Actions} from 'react-native-router-flux';
import { getArticleList, getBoardList, getUnivSchedule, setError, getUnivTotal, getUnivNoticeList} from '../actions/univ';
class ClubContainer extends React.Component {
  static propTypes = {
    Layout: PropTypes.func.isRequired,
    club: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      error: PropTypes.object,
      univNotice: PropTypes.arrayOf(PropTypes.shape()),
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({}),
    }),
    univBoardList: PropTypes.array,
    getUnivSchedule: PropTypes.func.isRequired,
    getBoardList: PropTypes.func.isRequired,
    getUnivTotal: PropTypes.func.isRequired,
    getUnivNoticeList: PropTypes.func.isRequired,
    setError: PropTypes.func.isRequired,
  }

  static defaultProps = {
    match: null,
  };
  constructor(props) {
    super(props);
    let isInitialized = false;
    if(props.member.name){
      this.fetchUniv(null, props.member);
      isInitialized = true;
    };

    this.state = {
      isInitialized: isInitialized
    };
  };

  componentWillReceiveProps (nextProps){
    if(!nextProps.member.name){
      Actions.login();
      return;
    }

    if(!this.state.isInitialized){
      this.setState({
        ...this.state,
        isInitialized: true,
      });
      //this.fetchUniv(nextProps.currentUnivId, nextProps.member);
    }
  }

  /**
   * Fetch Data from API, saving to Redux
   */
  fetchUniv = (currentUnivId, member) => {
    this.props.getUnivTotal(currentUnivId, member, 'club')
      .catch((err) => {
        console.log(`Error: ${err}`);
        return this.props.setError(err);
      });
    return this.props.getArticleList(currentUnivId, member, 'club');
  }

  render = () => {
    const { Layout, club, match, member, status} = this.props;
    const id = (match && match.params && match.params.id) ? match.params.id : null;
    return (
      <Layout
        recipeId={id}
        error={club.error}
        loading={status.loading}
        univ={club}
        member={member}
        reFetch={this.fetchUniv}
      />
    );
  }
}

const mapStateToProps = state => ({
  club: state.club || {},
  status: state.status || {},
  member: state.member || {},
  currentUnivId: state.currentUnivId || '',
});
const mapDispatchToProps = {
  getUnivTotal,
  getUnivNoticeList,
  getUnivSchedule,
  getBoardList,
  getArticleList,
  setError,
};

export default connect(mapStateToProps, mapDispatchToProps)(ClubContainer);
