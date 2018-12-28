import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class TermsContainer extends Component {
  static propTypes = {
    Layout: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({}),
    }),
  };

  render = () => {
    const { Layout, member, univ, param } = this.props;
    return (
      <Layout
        document={univ.article}
        member={member}
        param={param}
      />
    );
  }
}

const mapStateToProps = state => ({
  member: state.member || {},
  univ: state.univ || {},
});

export default connect(mapStateToProps)(TermsContainer);
