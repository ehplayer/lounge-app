import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {addStaffMemberList, getSearchMemberList} from '../actions/member';

class MemberSearch extends Component {
  static propTypes = {
    Layout: PropTypes.func.isRequired,
    getSearchMemberList: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      initialize: false,
    };
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      ...this.state,
      initialize: true,
    });
  }


  render = () => {
    const { Layout, searchUserList, getSearchMemberList, addStaffMemberList, member} = this.props;
    return <Layout searchUserList={this.state.initialize ? searchUserList : []} addStaffMemberList={addStaffMemberList} getSearchMemberList={getSearchMemberList}/>;
  }
}

const mapStateToProps = state => ({
  searchUserList: state.member.searchUserList || [],
  member: state.member,
  loading: state.loading || false,
});

const mapDispatchToProps = {
  getSearchMemberList,
  addStaffMemberList
};

export default connect(mapStateToProps, mapDispatchToProps)(MemberSearch);
