import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import {setError, getJoiningBoardList, updateBoard} from '../actions/univ';
import {removeStepMemberList, resetStepMemberList} from '../actions/member';

class ManageBoard extends React.Component {
  static propTypes = {
    Layout: PropTypes.func.isRequired,
    univBoardList: PropTypes.array,
    getJoiningBoardList: PropTypes.func.isRequired,
    setError: PropTypes.func.isRequired,
  }

  static defaultProps = {
    match: null,
  };
  constructor(props) {
    super(props);
    if(!props.member.name){
      Actions.login();
      return;
    }
    this.props.resetStepMemberList();
    this.fetchBoardData(props.member);
  };

  fetchBoardData = (member) => {
    return this.props.getJoiningBoardList(member)
      .catch((err) => {
        console.log(`Error: ${err}`);
        return this.props.setError(err);
      });
  }

  render = () => {
    const { Layout, menu, member, status, removeStepMemberList, updateBoard} = this.props;
    console.log(menu)
    return (
      <Layout
        error={menu.error}
        loading={status.loading}
        menu={menu}
        member={member}
        updateBoard={updateBoard}
        removeStepMemberList={removeStepMemberList}
      />
    );
  }
}

const mapStateToProps = state => ({
  menu: state.menu || {},
  status: state.status || {},
  member: state.member || {},
  currentUnivId: state.currentUnivId || '전체',
});
const mapDispatchToProps = {
  updateBoard: updateBoard,
  getJoiningBoardList,
  removeStepMemberList,
  resetStepMemberList,
  setError,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageBoard);
