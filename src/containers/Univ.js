import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import {getArticleList, getArticleListMore, getBoardList, getNoticeList, getScheduleList} from '../actions/univ';
import {updateUserData} from '../actions/member';

class UnivContainer extends React.Component {
    static propTypes = {
        Layout: PropTypes.func.isRequired,
        univ: PropTypes.shape({
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
        sectionType: 'univ',
    };

    constructor(props) {
        super(props);
        if (this.props.member && (!this.props.member.loadTime || this.props.member.loadTime < (new Date().getTime() - 600000))) {
            this.props.updateUserData(this.props.member);
        }
        if (props.member.name) {
            this.fetchData(null, props.member);
        }

    };

    componentWillReceiveProps(nextProps) {
        if(nextProps.status.needUpdate){
            this.fetchData(nextProps.univ.currentUnivId, nextProps.member);
        }
        if (!nextProps.member.name) {
            Actions.home();
        }
    }

    fetchData = (currentUnivId, member) => {
        this.props.getBoardList(currentUnivId, member, this.props.sectionType).catch((err) => console.log(`Error: ${err}`));
        this.props.getNoticeList(currentUnivId, member, this.props.sectionType).catch((err) => console.log(`Error: ${err}`));
        this.props.getScheduleList(currentUnivId, member, this.props.sectionType).catch((err) => console.log(`Error: ${err}`));
        return this.props.getArticleList(currentUnivId, member, this.props.sectionType);

    }

    render = () => {
        const {Layout, univ, match, member, status, sectionType} = this.props;
        const id = (match && match.params && match.params.id) ? match.params.id : null;
        return (
            <Layout
                recipeId={id}
                error={univ.error}
                loading={status.loading}
                document={univ}
                sectionType={sectionType}
                boardColor={'#2867ae'}
                member={member}
                reFetch={this.fetchData}
                moreFetch={this.props.getArticleListMore}
            />
        );
    }
}

const mapStateToProps = state => ({
    univ: state.univ || {},
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
    updateUserData,
};

export default connect(mapStateToProps, mapDispatchToProps)(UnivContainer);
