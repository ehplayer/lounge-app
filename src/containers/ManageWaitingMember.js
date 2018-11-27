import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {setError, updateBoardWaiting} from '../actions/univ';
import {removeStaffMemberList} from '../actions/member';

class ManageWaitingMember extends React.Component {
  static propTypes = {
    Layout: PropTypes.func.isRequired,
    univBoardList: PropTypes.array,
    setError: PropTypes.func.isRequired,
  }

  static defaultProps = {
    match: null,
  };
  constructor(props) {
    super(props);
  };

  render = () => {
    const { Layout, menu, member, status, updateBoardWaiting, boardItem} = this.props;
    return (
      <Layout
        error={menu.error}
        loading={status.loading}
        menu={menu}
        member={member}
        updateBoardWaiting={updateBoardWaiting}
        removeStaffMemberList={removeStaffMemberList}
        boardItem={boardItem}
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
  updateBoardWaiting,
  setError,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageWaitingMember);
