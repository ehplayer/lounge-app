import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import {getUnivNoticeList, setError} from '../actions/univ';

class NoticeList extends React.Component {
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
        getUnivNoticeList: PropTypes.func.isRequired,
        setError: PropTypes.func.isRequired,
    }

    static defaultProps = {
        match: null,
    };

    constructor(props) {
        super(props);
        this.props.getUnivNoticeList(props.member, props.boardItem);

    };

    componentWillReceiveProps(nextProps) {
        if (!nextProps.member.name) {
            Actions.login();
            return;
        }
    }

    render = () => {
        const {Layout, univ, sectionType, member, status} = this.props;
        return (
            <Layout
                error={univ.error}
                loading={status.loading}
                univ={univ}
                member={member}
                sectionType={sectionType}
            />
        );
    }
}

const mapStateToProps = state => ({
    univ: state.univ || {},
    status: state.status || {},
    member: state.member || {},
});
const mapDispatchToProps = {
    getUnivNoticeList,
    setError,
};

export default connect(mapStateToProps, mapDispatchToProps)(NoticeList);
