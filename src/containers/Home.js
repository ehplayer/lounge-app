import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import {getHomeNotice, getHomeSchedule} from '../actions/home';

class HomeContainer extends React.Component {
  static propTypes = {
    Layout: PropTypes.func.isRequired,
    home: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      error: PropTypes.object,
      noticeList: PropTypes.arrayOf(PropTypes.shape()),
      scheduleList: PropTypes.arrayOf(PropTypes.shape()),
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({}),
    }),
    getHomeNotice: PropTypes.func.isRequired,
    getHomeSchedule: PropTypes.func.isRequired,
  }

  static defaultProps = {
    match: null,
  };
  constructor(props) {
    super(props);

    if(!props.member.name){
      return Actions.login();
    }

   this.fetchTotalHome(props.member);
  };

  componentWillReceiveProps (nextProps){
    if(!nextProps.member.name){
      Actions.login();
    }
  }

  /**
    * Fetch Data from API, saving to Redux
    */
  fetchTotalHome = (member) => {
    return this.props.getHomeNotice(member)
      .then(() => this.props.getHomeSchedule(member))
      .catch((err) => {
        console.log(`Error: ${err}`);
        return this.props.setError(err);
      });
  }

  render = () => {
    const { Layout, home, match, member, status} = this.props;
    const id = (match && match.params && match.params.id) ? match.params.id : null;
    return (
      <Layout
        recipeId={id}
        error={home.error}
        loading={status.loading}
        home={home}
        member={member}
        reFetch={this.fetchTotalHome}
      />
    );
  }
}

const mapStateToProps = state => ({
  home: state.home || {},
  status: state.status || {},
  member: state.member || {},
  currentUnivId: state.currentUnivId || '전체',
});
const mapDispatchToProps = {
  getHomeNotice,
  getHomeSchedule,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);
