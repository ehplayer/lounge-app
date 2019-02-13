import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import {getArticleList, getArticleListMore, getBoardList, getNoticeList, getScheduleList, getTotalBoardList} from '../actions/univ';

class ClubContainer extends React.Component {
  static propTypes = {
    Layout: PropTypes.func.isRequired,
    club: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      error: PropTypes.object,
      univNotice: PropTypes.arrayOf(PropTypes.shape()),
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({}),
    }),
    univBoardList: PropTypes.array,
  }

  static defaultProps = {
    match: null,
    sectionType:'club',
  };
  constructor(props) {
      super(props);
      if(props.member.name){
          this.fetchData(null, props.member);
      };
  };

  componentWillReceiveProps (nextProps){
      if(nextProps.status.needUpdate){
          this.fetchData(nextProps.club.currentUnivId, nextProps.member);
      }
      if(!nextProps.member.name){
          Actions.login();
      }
  }

  fetchData = (currentUnivId, member) => {
      this.props.getBoardList(currentUnivId, member, this.props.sectionType).catch((err) => console.log(`Error: ${err}`));
      if(!member.clubAuth || member.clubAuth.length === 0){
          return;
      }

      this.props.getNoticeList(currentUnivId, member, this.props.sectionType).catch((err) => console.log(`Error: ${err}`));
      this.props.getScheduleList(currentUnivId, member, this.props.sectionType).catch((err) => console.log(`Error: ${err}`));
      return this.props.getArticleList(currentUnivId, member, this.props.sectionType);

  }

  render = () => {
      const { Layout, club, match, member, status, sectionType, menu} = this.props;
      return (
          <Layout
              menu={menu}
              error={club.error}
              loading={status.loading}
              document={club}
              sectionType={sectionType}
              boardColor={'#a64235'}
              member={member}
              reFetch={this.fetchData}
              moreFetch={this.props.getArticleListMore}
          />
      );
  }
}

const mapStateToProps = state => ({
  club: state.club || {},
    menu: state.menu || {},
  status: state.status || {},
  member: state.member || {},
  currentUnivId: state.currentUnivId || '',
});
const mapDispatchToProps = {
    getNoticeList,
    getScheduleList,
    getBoardList,
    getArticleList,
    getArticleListMore,
    getTotalBoardList,
};

export default connect(mapStateToProps, mapDispatchToProps)(ClubContainer);
