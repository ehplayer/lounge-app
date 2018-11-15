import React from 'react';
import PropTypes from 'prop-types';
import {FlatList} from 'react-native';
import {Body, Container, Content, Left, List, ListItem, Text, Thumbnail} from 'native-base';
import {Actions} from 'react-native-router-flux';
import Loading from './Loading';
import Error from './Error';
import moment from "moment/moment";


class NoticeList extends React.Component {

  static propTypes = {
    error: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    univNotice: PropTypes.arrayOf(PropTypes.shape()),
    reFetch: PropTypes.func,
  };

  static defaultProps = {
    error: null,
    reFetch: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      currentUnivId: undefined
    };
  }
  static keyExtractor = item => String(item.toString());
  onPress = item => Actions.notice({match: {item: item}});

  handleChange = (currentUnivId, val) => {
    this.setState({
      ...this.state,
      currentUnivId: currentUnivId,
    });
    this.props.reFetch(currentUnivId);
  };
  openArticle = (boardType, item) => {
    return Actions.notice({
      title: item.title,
      param: {
        sectionType: this.props.sectionType,
        universe:this.props.member.universe,
        currentUnivId:this.props.univ.currentUnivId,
        boardType: boardType,
        docId: item.docId}})
  };

  render() {
    // Loading
    if (loading) return <Loading/>;
    // Error
    if (error) return <Error content={error}/>;
    const {error, loading, univ} = this.props;
    return (
      <Container>
        <Content style={{backgroundColor:'#ffffff'}}>
          <List>
            <FlatList
              numColumns={1}
              data={univ.noticeList}
              renderItem={({item}) => (
                <ListItem key={item.articleId} onPress={() => this.openArticle('notice', item)} >
                  <Left>
                    <Body>
                    <Text style={{paddingTop:10}}>{item.title}</Text>
                    <Text note style={{paddingTop:10}}>{item.author.name} {moment(item.createDateTime).format('YY.MM.DD.')}
                    <Text color='#4a90e2'>{item.comment && item.comment.length !== 0 ? ' 댓글 ' + item.comment.length : ''}</Text></Text>
                    </Body>
                    <Thumbnail source={{ uri: item.author.thumb}} />
                  </Left>
                </ListItem>
              )}
              keyExtractor={(item, index) => index + item.toString()}
            />
          </List>
        </Content>
      </Container>
    );
  }


};


export default NoticeList;
