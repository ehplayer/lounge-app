import React from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  FlatList,
  Image, Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View
} from 'react-native';
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
  Picker,
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
import ArrowDown from '../../images/arrow_down.png';
import ArrowUp from '../../images/arrow_up.png';
import PencilIcon from '../../images/pencil.png';
import ModalDropDown from 'react-native-modal-dropdown';


class UnivComponent extends React.Component {

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
      currentUnivId: undefined,
    };
  }
  static keyExtractor = item => String(item.toString());

  openArticle = (boardType, item) => {
    console.log(item)
    return Actions.notice({
      title: item.title,
      param: {
        universe:this.props.member.universe,
        currentUnivId:this.props.univ.currentUnivId,
        boardType: boardType,
        docId: item.docId}})
  };

  onChangeBoard = (board, isLast) => {
    if(isLast){
      return Actions.boardList();
    }
    this.setState({
      ...this.state,
      currentUnivId: board.docId,
    });
    this.props.reFetch(board.docId, this.props.member, true);
  }
  onRefresh = () => {
    console.log('refresh?')
  }

  renderRow(boardItem) {
    return (
      <TouchableHighlight>
        <View style={{backgroundColor: 'white', flexDirection: 'row', height: 50, alignItems: 'center', paddingLeft:'7%'}}>
          <Thumbnail source={{uri: boardItem.thumb}} style={{width:33, height:33, borderRadius: 16}}/>
          <Text style={{marginLeft:23}}>{boardItem.name}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  renderSeparator(sectionId, rowId, boardLength) {
    const isLast = rowId === (boardLength - 2 + '');
    return (<View style={{height: (isLast ? 10: 0.5), backgroundColor: isLast ? '#ededed': '#cccccc'}} key={'spr' + rowId}/>);
  }

  render() {
    const {error, loading, univ, member, moreFetch} = this.props;
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
        <FlatList
          numColumns={1}
          data={univ.articleList}
          ListHeaderComponent={
            <Content>
              <Card transparent style={{marginTop: 0, height:70}}>
                <CardItem>
                  <Thumbnail source={{uri: boardItem && boardItem.thumb}} style={{width:44, height:44, borderRadius: 22}}/>
                  <ModalDropDown ref="dropdown_2"
                                 style={{
                                   alignSelf: 'flex-end',
                                   width: '70%',
                                   right: 8,
                                   marginLeft:20,
                                   paddingLeft:0
                                 }}
                                 textStyle={{marginVertical: 10,
                                   marginHorizontal: 6,
                                   fontSize: 15,
                                   color: '#000000',
                                   fontWeight:'100',
                                   textAlign: 'left',
                                   textAlignVertical: 'center',}}
                                 dropdownStyle={{
                                   width: '100%',
                                   height: Dimensions.get('window').height,
                                   backgroundColor: "rgba(0, 0, 0, 0.5)",
                                   paddingBottom: Dimensions.get('window').height - 165,
                                 }}
                                 options={univ.boardList}
                                 defaultValue={boardItem && boardItem.name}
                                 renderButtonText={(rowData) => rowData.name}
                                 renderRow={this.renderRow.bind(this)}
                                 renderSeparator={(sectionID, rowID) => this.renderSeparator(sectionID, rowID, univ.boardList.length)}
                                 adjustFrame={(adjust) => {return {...adjust, left:0, top: adjust.top + (Platform.OS === 'ios' ? 25 : 0)};}}
                                 onSelect={(index, value) => this.onChangeBoard(value, index === univ.boardList.length - 1 + "")}
                  />
                  <Image
                    style={{width: 20, height: 20, marginLeft:0}}
                    resizeMode="contain"
                    source={ArrowDown}/>
                </CardItem>
              </Card>
              <Card transparent>
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
              <Card transparent style={{marginBottom:5}}>
                <CardItem style={{paddingBottom:0, marginBottom:0}}>
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
              <Card transparent style={{marginBottom:0}}>
                <CardItem style={{paddingBottom:0, marginBottom:0}}>
                  <Body>

                  <List>
                    <ListItem style={{height: 40, paddingLeft:0, marginLeft:0}}>
                      <Text style={{width: '100%', paddingLeft:0, marginLeft:0}}>게시글</Text>
                    </ListItem>
                  </List>
                  </Body>
                </CardItem>
              </Card>
            </Content>
          }
          renderItem={({item}) => (
            <ListItem key={item.articleId} style={{height: 70, paddingLeft:5, marginLeft:0, backgroundColor:'#ffffff'}} onPress={() => this.openArticle('article', item)}>
              <Left >
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
          onEndReachedThreshold={0.5}
          onEndReached={(info)=>{
            moreFetch(boardItem.docId, member, 'univ', univ.articleList[univ.articleList.length - 1]);
          }}
        />
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

export default UnivComponent;
