import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {getTotalBoardList, applyBoard, outBoard} from '../actions/univ';

class BoardList extends React.Component {
  static propTypes = {
    Layout: PropTypes.func.isRequired,
    match: PropTypes.shape({
      universe: PropTypes.string,
    }),
    univBoardList: PropTypes.array,
  }

  static defaultProps = {
    match: null,
  };

  constructor(props) {
    super(props);
    this.fetchBoardList(props.member.universe);
  };

  /**
    * Fetch Data from API, saving to Redux
    */
  fetchBoardList = (universe) => {
    return this.props.getTotalBoardList(universe)
      .catch((err) => {
        console.log(`Error: ${err}`);
        return this.props.setError(err);
      });
  }

  render = () => {
    const { Layout, match, member, menu, applyBoard, outBoard} = this.props;
    const id = (match && match.params && match.params.id) ? match.params.id : null;
    return (
      <Layout
        recipeId={id}
        error={menu.error}
        loading={menu.loading}
        member={member}
        applyBoard={applyBoard}
        outBoard={outBoard}
        {...menu}
      />
    );
  }
}

const mapStateToProps = state => ({
  member: state.member || {},
  menu: state.menu || {},
});
const mapDispatchToProps = {
  getTotalBoardList,
  applyBoard,
  outBoard,
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardList);
