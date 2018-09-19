import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getArticleItem, addComment, removeComment} from '../actions/univ';
class Notice extends Component {
  static propTypes = {
    Layout: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({}),
    }),
    setError: PropTypes.func.isRequired,
  };

  static defaultProps = {
    match: null,
  };
  constructor(props) {
    super(props);
    this.props.getArticleItem(props.param.universe, props.param.currentUnivId, props.param.boardType, props.param.docId)
  }

  render = () => {
    const { Layout, member, univ, addComment, param, removeComment, status} = this.props;
    return (
      <Layout
        document={univ.article}
        loading={status.loading}
        member={member}
        addComment={addComment}
        removeComment={removeComment}
        param={param}
      />
    );
  }
}

const mapStateToProps = state => ({
  member: state.member || {},
  univ: state.univ || {},
  status: state.status || {},
});
const mapDispatchToProps = {
  getArticleItem,
  addComment,
  removeComment,
};

export default connect(mapStateToProps, mapDispatchToProps)(Notice);
