import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getBoardList, getUnivSchedule, setError, getUnivTotal, getUnivNoticeList} from '../actions/univ';
class RecipeListing extends React.Component {
  static propTypes = {
    Layout: PropTypes.func.isRequired,
    recipes: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      error: PropTypes.object,
      recipes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
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
    this.state = {
      isInitialized: false
    };
  };

  componentWillReceiveProps (nextProps){
    if(!this.state.isInitialized){
      this.setState({
        ...this.state,
        isInitialized: true,
      });
      this.fetchUniv(nextProps.currentUnivId);
    }
  }

  /**
    * Fetch Data from API, saving to Redux
    */
  fetchUniv = (currentUnivId) => {
    return this.props.getUnivSchedule(currentUnivId, 20)
      .catch((err) => {
        console.log(`Error: ${err}`);
        return this.props.setError(err);
      });
  }

  render = () => {
    const { Layout, recipes, match, member} = this.props;
    const id = (match && match.params && match.params.id) ? match.params.id : null;
    return (
      <Layout
        recipeId={id}
        error={recipes.error}
        loading={recipes.loading}
        recipes={recipes.recipes}
        member={member}
        univNotice={recipes.univNotice}
        univBoardList={recipes.univBoardList}
        univScheduleList={recipes.univScheduleList}
        reFetch={(currentUnivId) => this.fetchUniv(currentUnivId)}
      />
    );
  }
}

const mapStateToProps = state => ({
  recipes: state.recipes || {},
  member: state.member || {},
  currentUnivId: state.currentUnivId || '전체',
  univBoardList: state.univBoardList || [],
});
const mapDispatchToProps = {
  getUnivTotal,
  getUnivNoticeList,
  getUnivSchedule,
  getBoardList,
  setError,
};

export default connect(mapStateToProps, mapDispatchToProps)(RecipeListing);
