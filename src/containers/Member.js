import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logout, getMemberData } from '../actions/member';
import {Actions} from "react-native-router-flux";

class Member extends Component {
  static propTypes = {
    Layout: PropTypes.func.isRequired,
    memberLogout: PropTypes.func.isRequired,
    getMemberData: PropTypes.func.isRequired,
    member: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      error: PropTypes.string,
    }),
  }
  constructor(props){
    super(props);
    if (!props.member.name) {
      Actions.login();
    }
  }

  componentDidMount = () => {
    this.props.getMemberData();
    if(this.props.member.auth){
      //Actions.home();
    }
  }
  componentWillReceiveProps (nextProps) {
    if (!nextProps.member.name) {
      Actions.login();
    }
  }
  render = () => {
    const { Layout, member, memberLogout } = this.props;
    return <Layout member={member} logout={memberLogout} />;
  }
}

const mapStateToProps = state => ({
  member: state.member || {},
});

const mapDispatchToProps = {
  memberLogout: logout,
  getMemberData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Member);
