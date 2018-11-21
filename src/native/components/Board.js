import React from 'react';
import PropTypes from 'prop-types';
import {Dimensions, FlatList, Image, Platform, RefreshControl, TouchableOpacity,TouchableHighlight, View} from 'react-native';
import {
    Body,
    Button,
    Card,
    CardItem,
    Container,
    Left,
    List,
    ListItem,
    Right,
    Separator,
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
import PencilIcon from '../../images/pencil.png';
import ModalDropDown from 'react-native-modal-dropdown';
import loungeStyle from "../constants/loungeStyle";


class BoardComponent extends React.Component {

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
  this.showDropDown = this.showDropDown.bind(this);
  }
  static keyExtractor = item => String(item.toString());

  openArticle = (boardType, item) => {
    return Actions.notice({
      title: item.title,
      param: {
        sectionType: this.props.sectionType,
        universe:this.props.member.universe,
        currentUnivId:this.props.document.currentUnivId,
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
  onRefresh = (currentBoardId) => {
      this.props.reFetch(currentBoardId, this.props.member, true);
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
  showDropDown(){
      this.refs.dropdown.show();
  }

  render() {
    const {error, loading, document, member, moreFetch, sectionType, boardColor, hideBoardSelectMenu, menu} = this.props;
    const boardItem = document.boardList && (!this.state.currentUnivId ? document.boardList[0] : document.boardList.filter(item => item.docId === this.state.currentUnivId)[0])
    const now = moment().format("MM.DD");

    if(document.boardList && document.boardList.length > 0 && document.boardList[document.boardList.length - 1].name !== '게시판 가입하기..') {
      document.boardList.push({name:'게시판 가입하기..', thumb:'#'});
    }
    if (loading) return <Loading/>;
    if (error) return <Error content={error}/>;

    if(!boardItem) {
        return <Container>
            <Card transparent style={{marginTop: 0, paddingTop:0}}>

                <CardItem style={{paddingTop:130, paddingBottom:0, marginBottom:0}}>
                    <Left style={{alignContent:'center', justifyContent:'center'}}>
                        <Text style={{paddingLeft:0, marginLeft:0, color:'#cccccc', fontSize:15}}>가입하신 Club이 없습니다.</Text>
                    </Left>

                </CardItem>
                <CardItem style={{paddingTop:40, paddingBottom:0, marginBottom:0}} >
                    <TouchableOpacity onPress={Actions.boardList}>
                        <Left style={{alignContent:'center', justifyContent:'center'}} >
                            <Text style={{paddingLeft:0, marginLeft:0, color:'#000000', height:20}}>Univ./Club 가입화면으로 이동</Text>
                            <Image
                                style={{width: 17, height: 17, marginLeft:5}}
                                resizeMode="contain"
                                source={ArrowRight}/>
                        </Left>
                    </TouchableOpacity>
                </CardItem>
            </Card>
        </Container>;
    }

    return (
      <Container>
        <List style={{backgroundColor:'#ffffff'}}>
        <FlatList
          numColumns={1}
          data={document.articleList}
          ListHeaderComponent={
              <View>
                  {!hideBoardSelectMenu &&
                  <Card transparent style={{marginBottom: 0, paddingBottom: 0, height: 70}}>
                      <TouchableOpacity onPress={this.showDropDown}>
                          <CardItem style={{margin: 0, paddingBottom: 0}}>
                                <Thumbnail source={{uri: boardItem && boardItem.thumb}} style={{width: 44, height: 44, borderRadius: 22}}/>
                              <ModalDropDown ref="dropdown"
                                             style={{
                                                 alignSelf: 'flex-end',
                                                 width: '70%',
                                                 right: 8,
                                                 marginLeft: 20,
                                                 paddingLeft: 0,
                                             }}
                                             textStyle={{
                                                 marginVertical: 10,
                                                 marginHorizontal: 6,
                                                 fontSize: 15,
                                                 color: '#000000',
                                                 fontWeight: '100',
                                                 textAlign: 'left',
                                                 textAlignVertical: 'center',
                                             }}
                                             dropdownStyle={{
                                                 width: '100%',
                                                 height: Dimensions.get('window').height,
                                                 backgroundColor: "rgba(0, 0, 0, 0.5)",
                                                 paddingBottom: Dimensions.get('window').height - 165,
                                             }}
                                             options={document.boardList}
                                             defaultValue={boardItem && boardItem.name}
                                             renderButtonText={(rowData) => rowData.name}
                                             renderRow={this.renderRow.bind(this)}
                                             renderSeparator={(sectionID, rowID) => this.renderSeparator(sectionID, rowID, document.boardList.length)}
                                             adjustFrame={(adjust) => {
                                                 return {
                                                     ...adjust,
                                                     left: 0,
                                                     top: adjust.top + (Platform.OS === 'ios' ? 25 : 0)
                                                 };
                                             }}
                                             onSelect={(index, value) => this.onChangeBoard(value, index === document.boardList.length - 1 + "")}
                              />
                              <Image
                                  style={loungeStyle.listHeaderListItem_Image}
                                  resizeMode="contain"
                                  source={ArrowDown}/>
                          </CardItem>
                      </TouchableOpacity>
                  </Card>
                  }
                  {!hideBoardSelectMenu &&  <Separator style={{height: 10}}/>}

                  <Card transparent style={{marginBottom: 0, paddingBottom:0}}>
                      <CardItem style={{paddingBottom:0}}>
                          <Body>
                          <List>
                              <ListItem style={loungeStyle.listHeaderListItem}>
                                  <Text style={loungeStyle.listHeaderListItem_Text} onPress={item => Actions.noticeList({title: '공지사항', sectionType:sectionType})}>공지사항</Text>
                                  <Image
                                      style={loungeStyle.listHeaderListItem_Image}
                                      resizeMode="contain"
                                      source={ArrowRight}/>
                              </ListItem>
                              <FlatList
                                  numColumns={1}
                                  data={document.noticeList && document.noticeList.length > 3 ? document.noticeList.slice(0,3) : document.noticeList}
                                  renderItem={({item, index}) => (
                                      <ListItem noBorder={index === 2 || index === document.noticeList.length - 1} key={item.articleId} onPress={() => this.openArticle('notice', item)} style={{height: 50, paddingLeft:0, marginLeft:0, marginRight:0}}>
                                          <Left style={{marginLeft:0}}>
                                              <Body style={{marginLeft:0}}><Text numberOfLines={1} style={{fontWeight:'normal', color:'#555555'}}>{item.title}</Text></Body>
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
                  <Separator style={{height: 10}}/>
                  <Card transparent style={{marginBottom: 0, paddingBottom:0}}>
                      <CardItem style={{paddingBottom:0, marginBottom:0}}>
                          <Body>

                          <List>
                              <ListItem style={loungeStyle.listHeaderListItem} onPress={() => Actions.scheduleList({boardItem})}>
                                  <Text style={loungeStyle.listHeaderListItem_Text}>일정</Text>
                                  <Image
                                      style={loungeStyle.listHeaderListItem_Image}
                                      resizeMode="contain"
                                      source={ArrowRight}/>
                              </ListItem>
                              {document.scheduleList && document.scheduleList[0] &&
                              <ListItem noBorder style={{marginLeft:0,height:75}} onPress={() => this.openArticle('notice', document.scheduleList[0])}>
                                  <Button transparent style={{
                                      marginTop: 15,
                                      marginLeft:0,
                                      height: 29,
                                      backgroundColor: '#ffffff',
                                      borderColor: boardColor,
                                      borderWidth: 0.5,
                                      borderRadius: 15,
                                  }} disabled>
                                      <Text style={{fontSize: 14, color: boardColor, paddingLeft: 5, paddingRight: 5}}>{moment(document.scheduleList[0].startDatetimeLong).format('MM / DD')}</Text>
                                  </Button>
                                  <Left>
                                      <Body style={{alignContent: "center", marginTop: 10, paddingLeft:10}}>
                                      <Text style={{fontSize: 15, fontWeight:'100', color:'#555555'}}>{document.scheduleList[0].title}</Text>
                                      <Text note style={{paddingTop: 5, color:boardColor, fontSize:13}}>
                                          {'참석 ' + (document.scheduleList[0].joinerList && document.scheduleList[0].joinerList.length !== 0 ? document.scheduleList[0].joinerList.length : 0)}
                                          {document.scheduleList[0].comment && document.scheduleList[0].comment.length !== 0? ' / 댓글 ' + document.scheduleList[0].comment.length : ''}
                                      </Text>
                                      </Body>
                                  </Left>
                              </ListItem>
                              }
                          </List>
                          </Body>
                      </CardItem>
                  </Card>
                  <Separator style={{height: 10}}/>
                  <Card transparent style={{marginBottom:0}}>
                      <CardItem style={{paddingBottom:0, marginBottom:0}}>
                          <Body>
                          <List>
                              <ListItem style={loungeStyle.listHeaderListItem}>
                                  <Text style={{width: '100%', paddingLeft:0, marginLeft:0, color: '#000000'}}>게시글</Text>
                              </ListItem>
                          </List>
                          </Body>
                      </CardItem>
                  </Card>
              </View>
          }
          renderItem={({item, index}) => (
            <ListItem key={item.articleId} style={{height: 70,  backgroundColor:'#ffffff', width:'92%'}} onPress={() => this.openArticle('article', item)}>
              <Left style={{marginLeft:0,paddingLeft:0}}>
                <Body style={{marginLeft:0,paddingLeft:0,marginTop:5}}>
                <Text numberOfLines={2} style={{fontWeight:'100', color:'#555555'}}>{item.title}</Text>
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
              onRefresh={() => this.onRefresh(boardItem.docId)}
            />
          }
          onEndReachedThreshold={0.5}
          onEndReached={(info)=>{
            moreFetch(boardItem.docId, member, sectionType, document.articleList[document.articleList.length - 1]);
          }}
        />
        </List>
        <ActionButton
          buttonColor={boardColor}
          onPress={() => Actions.createArticle({boardType: sectionType === 'hall' ? 'hall' : member.universe + sectionType, boardItem: boardItem, sectionType: sectionType})}
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

export default BoardComponent;
