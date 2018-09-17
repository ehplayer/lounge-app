import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {createBoard} from '../actions/univ';
import {resetStepMemberList, removeStepMemberList} from "../actions/member";

class CreateBoard extends React.Component {
  static propTypes = {
    Layout: PropTypes.func.isRequired,
    member: PropTypes.shape({}).isRequired,
    onFormSubmit: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string,
    successMessage: PropTypes.string,
  };
  static defaultProps = {
    errorMessage: null,
    successMessage: null,
  };
  constructor(props){
    super(props);
    this.props.resetStepMemberList();
  }

  render() {
    const {
      Layout,
      onFormSubmit,
      member,
      isLoading,
      errorMessage,
      successMessage,
      removeStepMemberList
    } = this.props;

    return <Layout
      member={member}
      loading={isLoading}
      error={errorMessage}
      success={successMessage}
      onFormSubmit={onFormSubmit}
      removeStepMemberList={removeStepMemberList}
    />
  }
}


const mapStateToProps = state => ({
  member: state.member || {},
  isLoading: state.status.loading || false,
  errorMessage: state.status.error || null,
  successMessage: state.status.success || null,
});

const mapDispatchToProps = {
  onFormSubmit: createBoard,
  resetStepMemberList: resetStepMemberList,
  removeStepMemberList: removeStepMemberList,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateBoard);
