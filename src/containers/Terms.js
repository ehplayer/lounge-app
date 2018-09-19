import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addComment} from '../actions/univ';

class TermsContainer extends Component {
  static propTypes = {
    Layout: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({}),
    }),
  };

  static defaultProps = {
    match: null,
  };
  constructor(props) {
    super(props);
  }

  render = () => {
    const { Layout, member, univ, addComment, param } = this.props;
    return (
      <Layout
        document={univ.article}
        member={member}
        addComment={addComment}
        param={param}
      />
    );
  }
}

const mapStateToProps = state => ({
  member: state.member || {},
  univ: state.univ || {},
});
const mapDispatchToProps = {
  addComment,
};

export default connect(mapStateToProps, mapDispatchToProps)(TermsContainer);
