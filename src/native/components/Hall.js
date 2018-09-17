import React from 'react';
import PropTypes from 'prop-types';
import {Platform, Dimensions, FlatList, Image, RefreshControl, TouchableHighlight, View} from 'react-native';
import {
  Body,
  Button,
  Card,
  CardItem,
  Container,
  Content,
  Left,
  List,
  ListItem,
  Right,
  Text,
  Thumbnail
} from 'native-base';
import {Actions} from 'react-native-router-flux';
import Loading from './Loading';
import Error from './Error';
import ActionButton from 'react-native-action-button';
import moment from "moment/moment";
import ArrowRight from '../../images/arrow_right_gray.png';
import PencilIcon from '../../images/pencil.png';
import ArrowDown from '../../images/arrow_down.png';
import ModalDropDown from 'react-native-modal-dropdown';

class HallComponent extends React.Component {

  static propTypes = {
    error: PropTypes.object,
    loading: PropTypes.bool.isRequired,
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
  openArticle = (boardType, item) => {
    console.log(item)
    return Actions.notice({
      title: item.title,
      param: {
        universe: 'hall',
        currentUnivId: 'total',
        boardType: boardType,
        docId: item.docId}})
  };

  handleChange = (currentUnivId) => {
    this.setState({
      ...this.state,
      currentUnivId: currentUnivId,
    });
    this.props.reFetch(currentUnivId, this.props.member, true);
  }
  onRefresh = () => {
    console.log('refresh?')
  }

  render() {
    const {error, loading, univ, member} = this.props;
    const boardItem = univ.boardList && (!this.state.currentUnivId ? univ.boardList[0] : univ.boardList.filter(item => item.docId === this.state.currentUnivId)[0])
    const now = moment().format("MM.DD");
    const boardColor = '#2867ae';
    if(univ.boardList && univ.boardList[univ.boardList.length - 1].name !== '게시판 가입하기..') {
      univ.boardList.push({name:'게시판 가입하기..', thumb:'#'});
    }


    if (loading) return <Loading/>;
    if (error) return <Error content={error}/>;

    return (
      <Container>
        <Content >
          <Card transparent style={{marginTop:0}}>
            <CardItem style={{paddingBottom:0}}>
              <Body>
              <List>
                <ListItem style={{height: 40, paddingLeft:0, marginLeft:0, alignItems:'center'}}>
                  <Text style={{width: '90%', paddingLeft:0, marginLeft:0}}
                        onPress={item => Actions.noticeList({title: '공지사항'})}>공지사항</Text>
                  <Image
                    style={{width: 20, height: 20, marginLeft:10}}
                    resizeMode="contain"
                    source={ArrowRight}/>
                </ListItem>
                <FlatList
                  numColumns={1}
                  data={univ.noticeList && univ.noticeList.length > 3 ? univ.noticeList.slice(0,3) : univ.noticeList}
                  renderItem={({item}) => (
                    <ListItem key={item.articleId} onPress={() => this.openArticle('notice', item)} style={{height: 50, paddingLeft:0, marginLeft:0, marginRight:0}}>
                      <Left style={{marginLeft:0}}>
                        <Body style={{marginLeft:0}}><Text numberOfLines={1} style={{fontWeight:'100'}}>{item.title}</Text></Body>
                      </Left>
                      <Right><Text note>{moment(item.createDateTime).format("MM.DD") === now ? '오늘' : moment(item.createDateTime).format("MM.DD")}</Text></Right>
                    </ListItem>
                  )}
                  keyExtractor={(item, index) => index + item.toString()}
                />
              </List>
              </Body>
            </CardItem>
          </Card>
          <Card transparent>
            <CardItem style={{paddingBottom:0}}>
              <Body>

              <List>
                <ListItem style={{height: 40, paddingLeft:0, marginLeft:0}} onPress={Actions.scheduleList}>
                  <Text style={{width: '90%', paddingLeft:0, marginLeft:0}}>일정</Text>
                  <Image
                    style={{width: 20, height: 20, marginLeft:10}}
                    resizeMode="contain"
                    source={ArrowRight}/>
                </ListItem>
                {univ.scheduleList && univ.scheduleList[0] &&
                <ListItem style={{marginLeft:0,height:75}} onPress={() => this.openArticle('schedule', univ.scheduleList[0])}>
                  <Button transparent style={{
                    marginTop: 15,
                    marginLeft:0,
                    height: 29,
                    backgroundColor: '#ffffff',
                    borderColor: boardColor,
                    borderWidth: 0.5,
                    borderRadius: 15,
                  }} disabled>
                    <Text style={{fontSize: 14, color: boardColor, paddingLeft: 5, paddingRight: 5}}>{moment(univ.scheduleList[0].startDatetimeLong).format('MM / DD')}</Text>
                  </Button>
                  <Left>
                    <Body style={{alignContent: "center", marginTop: 10, paddingLeft:10}}>
                    <Text style={{fontSize: 15, fontWeight:'100', marginBottom:5}}>{univ.scheduleList[0].title}</Text>
                    <Text note style={{paddingTop: 5, color:boardColor, fontSize:13}}>{'참석 16'} {univ.scheduleList[0].comment && univ.scheduleList[0].comment.length !== 0? '댓글 ' + univ.scheduleList[0].comment.length : ''}</Text>
                    </Body>
                  </Left>
                </ListItem>
                }
              </List>
              </Body>
            </CardItem>
          </Card>

          <Card transparent>
            <CardItem>
              <Body >
              <List>
                <ListItem style={{height: 40, paddingLeft:0, marginLeft:0}}>
                  <Text style={{width: '95%', paddingLeft:0, marginLeft:10}}>게시글</Text>
                </ListItem>
                <FlatList
                  numColumns={1}
                  data={univ.articleList}
                  renderItem={({item}) => (
                    <ListItem key={item.articleId} style={{height: 70, paddingLeft:0, marginLeft:0}} onPress={() => this.openArticle('article', item)}>
                      <Left>
                        <Body style={{marginTop:5}}>
                        <Text numberOfLines={2} style={{fontSize:15, fontWeight:'100'}}>{item.title}</Text>
                        <Text note style={{marginTop:3}}>
                          <Text note style={{fontSize:13}}>{item.author.name} </Text>
                          <Text note style={{fontSize:13}}> {moment(item.createDateTime).format("MM.DD") === now ? '오늘' : moment(item.createDateTime).format("MM.DD")} </Text>
                          <Text style={{color:boardColor, fontSize:13}}> {item.comment && item.comment.length !== 0 ? '댓글 ' + item.comment.length : ''}</Text>
                        </Text>
                        </Body>
                        {item.urlList && item.urlList.length > 0 && <Thumbnail square source={{ uri: (item.urlList && item.fileNameList && item.urlList[0].replace(item.fileNameList[0], 'thumb_' + item.fileNameList[0])) }} />}
                      </Left>
                    </ListItem>
                  )}
                  keyExtractor={(item, index) => index + item.toString()}
                  refreshControl={
                    <RefreshControl
                      refreshing={loading}
                      onRefresh={this.onRefresh}
                    />
                  }
                />
              </List>
              </Body>
            </CardItem>
          </Card>
        </Content>
        <ActionButton
          buttonColor={boardColor}
          onPress={() => Actions.createArticle({boardType: member.universe + '', boardItem: boardItem})}
          renderIcon={() => <Image
            style={{width: 28, height: 28}}
            resizeMode="contain"
            source={PencilIcon}
          />}
        />
      </Container>
    );
  }

};


export default HallComponent;
