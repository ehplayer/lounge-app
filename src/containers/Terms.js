import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updateTerms} from '../actions/member';

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
    const { Layout, member, univ, updateTerms, param } = this.props;
    return (
      <Layout
        document={univ.article}
        member={member}
        updateTerms={updateTerms}
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
    updateTerms,
};

export default connect(mapStateToProps, mapDispatchToProps)(TermsContainer);
