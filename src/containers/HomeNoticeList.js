import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import {getHomeNotice} from '../actions/home';
import {setError} from '../actions/univ';

class HomeNoticeList extends React.Component {
  static propTypes = {
    Layout: PropTypes.func.isRequired,
    home: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      error: PropTypes.object,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({}),
    }),
    univBoardList: PropTypes.array,
    setError: PropTypes.func.isRequired,
  }

  static defaultProps = {
    match: null,
  };
  constructor(props) {
    super(props);
    this.props.getHomeNotice(props.member)
  };

  componentWillReceiveProps (nextProps){
    if(!nextProps.member.name){
      Actions.login();
      return;
    }
  }

  render = () => {
    const { Layout, home, match, member, status} = this.props;

    return (
      <Layout
        error={home.error}
        loading={status.loading}
        univ={home}
        member={member}
        reFetch={this.props.getHomeNotice}
      />
    );
  }
}

const mapStateToProps = state => ({
  home: state.home || {},
  status: state.status || {},
  member: state.member || {},
});
const mapDispatchToProps = {
  setError,
  getHomeNotice,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeNoticeList);
