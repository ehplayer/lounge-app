import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {getArticleItem, addComment, removeComment, addJoiner, removeJoiner, adminDeleteArticle} from '../actions/univ';

class Notice extends Component {
    static propTypes = {
        Layout: PropTypes.func.isRequired,
        match: PropTypes.shape({
            params: PropTypes.shape({}),
        }),
    };

    static defaultProps = {
        match: null,
    };

    constructor(props) {
        super(props);
        this.props.getArticleItem(props.param)
    }

    render = () => {
        const {Layout, member, univ, addComment, param, removeComment, status, addJoiner, removeJoiner, adminDeleteArticle} = this.props;
        return (
            <Layout
                article={univ.article}
                loading={status.loading}
                member={member}
                addComment={addComment}
                removeComment={removeComment}
                addJoiner={addJoiner}
                removeJoiner={removeJoiner}
                param={param}
                adminDeleteArticle={adminDeleteArticle}
            />
        );
    }
}

const mapStateToProps = state => ({
    member: state.member || {},
    univ: state.univ || {},
    status: state.status || {},
});
const mapDispatchToProps = {
    getArticleItem,
    addComment,
    removeComment,
    addJoiner,
    removeJoiner,
    adminDeleteArticle
};

export default connect(mapStateToProps, mapDispatchToProps)(Notice);
