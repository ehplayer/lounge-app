import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {updateArticle, deleteArticle} from '../actions/univ';

class UpdateArticle extends Component {
    static propTypes = {
        Layout: PropTypes.func.isRequired,
        member: PropTypes.shape({}).isRequired,
        updateArticle: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        errorMessage: PropTypes.string,
        successMessage: PropTypes.string,
    };

    static defaultProps = {
        errorMessage: null,
        successMessage: null,
    };

    render() {
        const {
            Layout,
            updateArticle,
            deleteArticle,
            member,
            isLoading,
            errorMessage,
            successMessage,
            article,
            sectionType,
        } = this.props;

        return (<Layout
            sectionType={sectionType}
            article={article}
            member={member}
            loading={isLoading}
            error={errorMessage}
            success={successMessage}
            updateArticle={updateArticle}
            deleteArticle={deleteArticle}
        />);
    }
}

const mapStateToProps = state => ({
    member: state.member || {},
    isLoading: state.status.loading || false,
    errorMessage: state.status.error || null,
    successMessage: state.status.success || null,
});

const mapDispatchToProps = {
    updateArticle,
    deleteArticle
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateArticle);
