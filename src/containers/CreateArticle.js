import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { createArticle } from '../actions/univ';
class CreateArticle extends Component {
  static propTypes = {
    Layout: PropTypes.func.isRequired,
    member: PropTypes.shape({}).isRequired,
    createArticle: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string,
  };

  static defaultProps = {
    errorMessage: null,
    successMessage: null,
  };

  render(){
    const {
      Layout,
      createArticle,
      member,
      isLoading,
      errorMessage,
      boardType,
      boardItem,
    } = this.props;

    return (<Layout
      boardType={boardType}
      sectionType={this.props.sectionType}
      boardItem={boardItem}
      member={member}
      loading={isLoading}
      error={errorMessage}
      createArticle={createArticle}
    />);
  }
}

const mapStateToProps = state => ({
  member: state.member || {},
  recipes: state.recipes || {},
  isLoading: state.status.loading || false,
  errorMessage: state.status.error || null,
  successMessage: state.status.success || null,
});

const mapDispatchToProps = {
  createArticle,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateArticle);
