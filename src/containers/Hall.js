import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import {getArticleList, getArticleListMore, getBoardList, getNoticeList, getScheduleList} from '../actions/univ';

class HallContainer extends React.Component {
    static propTypes = {
        Layout: PropTypes.func.isRequired,
        hall: PropTypes.shape({
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
        sectionType:'hall',
    };

    constructor(props) {
        super(props);
        if(props.member.name){
            this.fetchData('total', props.member);
        };
    };

    componentWillReceiveProps (nextProps){
        if(!nextProps.member.name){
            Actions.login();
        }
    }

    fetchData = (currentUnivId, member) => {
        this.props.getBoardList(currentUnivId, member, this.props.sectionType).catch((err) => console.log(`Error: ${err}`));
        this.props.getNoticeList(currentUnivId, member, this.props.sectionType).catch((err) => console.log(`Error: ${err}`));
        this.props.getScheduleList(currentUnivId, member, this.props.sectionType).catch((err) => console.log(`Error: ${err}`));
        return this.props.getArticleList(currentUnivId, member, this.props.sectionType);

    }

    render = () => {
        const { Layout, hall, match, member, status, sectionType} = this.props;
        const id = (match && match.params && match.params.id) ? match.params.id : null;
        return (
            <Layout
                recipeId={id}
                error={hall.error}
                loading={status.loading}
                document={hall}
                sectionType={sectionType}
                boardColor={'#2867ae'}
                member={member}
                hideBoardSelectMenu={true}
                reFetch={this.fetchData}
                moreFetch={this.props.getArticleListMore}
            />
        );
    }
}

const mapStateToProps = state => ({
    hall: state.hall || {},
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
};

export default connect(mapStateToProps, mapDispatchToProps)(HallContainer);