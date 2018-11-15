import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

class JoinUserList extends Component {
  static propTypes = {
    Layout: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.string,
  }

  constructor(props) {
    super(props);
  };

  render = () => {
    const { Layout, document } = this.props;
    return <Layout document={document}/>;
  }
}

const mapStateToProps = state => ({
  loading: state.loading || false,
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(JoinUserList);
