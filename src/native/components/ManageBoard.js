import React from 'react';
import PropTypes from 'prop-types';
import {
    Body,
    Button,
    Container,
    Content,
    Input,
    Left,
    List,
    ListItem,
    Picker,
    Right,
    Separator,
    Text,
    Thumbnail
} from 'native-base';
import {Actions} from 'react-native-router-flux';
import Loading from './Loading';
import {Dimensions, FlatList, Image, TouchableHighlight, View, Platform} from "react-native";
import {ImagePicker, Permissions} from "expo";
import ArrowDown from '../../images/arrow_down.png';
import ModalDropDown from 'react-native-modal-dropdown';

class ManageBoard extends React.Component {
  static propTypes = {
    error: PropTypes.string,
    success: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    member: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      email: PropTypes.string,
    }).isRequired,
  }

  static defaultProps = {
    error: null,
    success: null,
  }

  constructor(props) {
    super(props);
    this.state = {
        member: props.member,
        staffList: props.menu.boardList[0].staffMemberList || [],
        currentBoardItem: props.menu.boardList[0] || {},
    };

    this.getBoardItemByBoardId = this.getBoardItemByBoardId.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.changeItem = this.changeItem.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.removeStaffMemberList = this.removeStaffMemberList.bind(this);
  }
  componentWillReceiveProps (nextProps){
    if(nextProps.menu.boardList && !this.state.currentBoardItem){
      this.setState({
        ...this.state,
        currentBoardItem: nextProps.menu.boardList[0] || {},
        originalBoardItem: nextProps.menu.boardList[0],
      });
    }

    if(this.state.currentBoardItem){
      let authUserList = this.state.currentBoardItem.authUserList || []
      this.state.staffList = authUserList.concat(nextProps.member.staffMemberList);
    }
  }

  getBoardItemByBoardId = boardId => this.props.menu.boardList.find(item => item.docId === boardId);

  changeItem = (val) => {
    this.setState({
      ...this.state,
      currentBoardItem: val,
      originalBoardItem: val,
    });
  };
  handleChange = (name, val) => {
    let item = this.state.currentBoardItem;
    item[name] = val;
    this.setState({
      ...this.state,
      currentBoardItem: item,
    });
  };
  pickImage = async () => {
    await Permissions.askAsync(Permissions.CAMERA);
    await Permissions.askAsync(Permissions.CAMERA_ROLL);

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      const response = await fetch(result.uri);
      const blob = response.blob();
      this.handleChange('thumb', result.uri);
      this.handleChange('imageUrl', result.uri);
      this.handleChange('imageBlob', blob);
    }
  };
  handleSubmit = () => {
    this.props.updateBoard(this.state)
      .then(() => Actions.pop())
      .catch(e => console.log(`Error: ${e}`));
  }
  removeStaffMemberList = (index) => {
    const authUserList = this.state.currentBoardItem.authUserList;
    if(authUserList.length < index + 1){
      this.props.removeStaffMemberList(index - authUserList.length)
    } else {
      authUserList.splice(index, 1);
      this.handleChange('authUserList', authUserList)
    }
  }

  handleAuthWaiting = (index, isApprove) => {
    if(isApprove){
      let joinMemberList = this.state.currentBoardItem.joinMemberList || [];
      joinMemberList.push(this.state.currentBoardItem.authWaiting[index]);
      this.handleChange('joinMemberList', joinMemberList);

      let addedJoinMemberList = this.state.currentBoardItem.addedJoinMemberList || [];
      addedJoinMemberList.push(this.state.currentBoardItem.authWaiting[index]);
      this.handleChange('addedJoinMemberList', addedJoinMemberList);
    }

    const authWaiting = this.state.currentBoardItem.authWaiting;
    authWaiting.splice(index, 1);
    this.handleChange('authWaiting', authWaiting)
  }
  removeJoinMember = (index) => {
    const joinMemberList = this.state.currentBoardItem.joinMemberList;
    const removedJoinMemberList = this.state.currentBoardItem.removedJoinMemberList || [];
    removedJoinMemberList.push(joinMemberList[index]);
    this.handleChange('removedJoinMemberList', removedJoinMemberList)

    joinMemberList.splice(index, 1);
    this.handleChange('joinMemberList', joinMemberList);

  };

  onChangeBoard = (index, value) => {
      this.setState({
          ...this.state,
          currentBoardItem: this.props.menu.boardList[index]
      });
  };

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
    const { loading, error, success, member, menu} = this.props;
    let {currentBoardItem, staffList} = this.state;
    if (loading ) return <Loading/>;
    return (
      <Container>
        <Content style={{backgroundColor:'#ffffff'}}>
          <List transparent>
            <ListItem header style={{height:65}}>
                <Thumbnail source={{uri: currentBoardItem && currentBoardItem.thumb}} style={{width:44, height:44, borderRadius: 22}}/>
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
                               options={menu.boardList}
                               defaultValue={currentBoardItem && currentBoardItem.name}
                               renderButtonText={(rowData) => rowData.name}
                               renderRow={this.renderRow.bind(this)}
                               renderSeparator={(sectionID, rowID) => this.renderSeparator(sectionID, rowID, menu.boardList.length)}
                               adjustFrame={(adjust) => {return {...adjust, left:0, top: adjust.top + (Platform.OS === 'ios' ? 25 : 0)};}}
                               onSelect={(index, value) => this.onChangeBoard(index, value)}
                />
                <Image
                    style={{width: 20, height: 20, marginLeft:0}}
                    resizeMode="contain"
                    source={ArrowDown}/>
            </ListItem>
          </List>
          <Separator style={{height: 10}}/>
          <List transparent >
            <ListItem>
              <Left>
                <Text style={{width: '30%'}}>게시판명</Text>
                <Left style={{flexDirection: 'row', alignItems:'center'}}>
                  <Input inlineLabel onChangeText={v => this.handleChange('name', v)} style={{borderBottomWidth:1}} value={currentBoardItem.name}/>
                </Left>
              </Left>
            </ListItem>
            <ListItem>
              <Left>
                <Text style={{width: '30%'}}>대표사진</Text>
                <Left style={{flexDirection: 'row', alignItems:'center'}}>
                  {currentBoardItem.thumb && currentBoardItem.thumb !== '#' ?
                    <Thumbnail
                      source={{uri: currentBoardItem.thumb}}
                    />
                    :
                    <Button style={{width:50, height:50, borderRadius: 30, backgroundColor:'#cccccc'}}/>
                  }
                </Left>
                <Button transparent style={{borderWidth:1, borderColor:'#cccccc', marginLeft:10, marginTop:10, width:90, padding:0, height:35, justifyContent:'center'}}
                        onPress={this.pickImage}><Text style={{color:'#333333'}}>사진선택</Text></Button>
              </Left>
            </ListItem>
          </List>
          <Separator style={{height: 10}}/>
          <FlatList
            data={staffList}
            ListHeaderComponent={() => <ListItem>
              <Left>
                <Text style={{width: '30%'}}>스탭 관리</Text>
                <Left style={{flexDirection: 'row', alignItems:'center'}}>
                  <Input inlineLabel onChangeText={v => this.handleChange('searchName', v)} style={{borderBottomWidth:1}} value={this.state.searchName} placeholder={'이름으로 검색'}/>
                </Left>
                <Button transparent onPress={() => Actions.memberSearch({searchName: this.state.searchName})}
                        style={{borderWidth:1, borderColor:'#cccccc', marginLeft:20, marginTop:10, width:70, padding:0, height:35, justifyContent:'center'}}>
                  <Text style={{color:'#333333'}}>검색</Text>
                </Button>
              </Left>
            </ListItem>}
            ListEmptyComponent={() =>
              <ListItem noBorder style={{height:70, justifyContent:'center'}}>
                <Text style={{color:'#cccccc'}}>검색결과가 없습니다.</Text>
              </ListItem> }
            renderItem={({item, index}) => (
              <ListItem avatar style={{height:70, marginLeft:10, marginRight:10, borderBottomWidth:(index === staffList.length -1 ? 0 : 1), borderBottomColor:'#dddddd'}}>
                <Left style={{borderBottomWidth:0}}>
                  <Thumbnail small source={{uri: item.thumb}}/>
                </Left>
                <Body style={{borderBottomWidth:0, justifyContent:'center', width:'25%'}}>
                <Text>{item.name}</Text>
                </Body>
                <Body style={{borderBottomWidth:0, margin:0}}>
                <Text note>{item.className}</Text>
                </Body>
                <Right style={{borderBottomWidth:0,width:'30%'}}>
                  <Body>
                  <Text note numberOfLines={1} ellipsizeMode='tail'>{item.mbaType}</Text>
                  <Text note numberOfLines={1} ellipsizeMode='tail'>{item.company}</Text>
                  </Body>
                </Right>
                <Button transparent  onPress={() => this.removeStaffMemberList(index)}
                        style={{borderWidth:1, borderColor:'#cccccc', marginLeft:5, marginTop:10, width:60, padding:0, height:35, justifyContent:'center'}}>
                  <Text style={{color:'#333333'}}>취소</Text>
                </Button>
              </ListItem>
            )}
            keyExtractor={(item) => item.docId}
          />
          <Separator style={{height: 10}}/>
          <FlatList
            data={currentBoardItem.joinMemberList}
            ListHeaderComponent={() => <ListItem>
              <Left>
                <Text style={{width: '30%'}}>원우 관리</Text>
              </Left>
            </ListItem>}
            ListEmptyComponent={() =>
              <ListItem noBorder style={{height:70, justifyContent:'center'}}>
                <Text style={{color:'#cccccc'}}>검색결과가 없습니다.</Text>
              </ListItem> }
            renderItem={({item, index}) => (
              <ListItem avatar style={{height:70, marginLeft:10, marginRight:10, borderBottomWidth:(index === currentBoardItem.joinMemberList.length -1 ? 0 : 1), borderBottomColor:'#dddddd'}}>
                <Left style={{borderBottomWidth:0}}>
                  <Thumbnail small source={{uri: item.thumb}}/>
                </Left>
                <Body style={{borderBottomWidth:0, justifyContent:'center', width:'25%'}}>
                <Text>{item.name}</Text>
                </Body>
                <Body style={{borderBottomWidth:0, margin:0}}>
                <Text note>{item.className}</Text>
                </Body>
                <Right style={{borderBottomWidth:0,width:'30%'}}>
                  <Body>
                  <Text note numberOfLines={1} ellipsizeMode='tail'>{item.mbaType}</Text>
                  <Text note numberOfLines={1} ellipsizeMode='tail'>{item.company}</Text>
                  </Body>
                </Right>
                <Button transparent  onPress={() => this.removeJoinMember(index)}
                        style={{borderWidth:1, borderColor:'#cccccc', marginLeft:5, marginTop:10, width:60, padding:0, height:35, justifyContent:'center'}}>
                  <Text style={{color:'#333333'}}>제외</Text>
                </Button>
              </ListItem>
            )}
            keyExtractor={(item) => item.docId}
          />
          <Separator style={{height: 10}}/>
          <FlatList
            data={currentBoardItem.authWaiting}
            ListHeaderComponent={() => <ListItem>
              <Left>
                <Text style={{width: '30%'}}>원우 승인 관리</Text>
              </Left>
            </ListItem>}
            ListEmptyComponent={() =>
              <ListItem noBorder style={{height:70, justifyContent:'center'}}>
                <Text style={{color:'#cccccc'}}>검색결과가 없습니다.</Text>
              </ListItem> }
            renderItem={({item, index}) => (
              <ListItem avatar style={{height:70, marginLeft:10, marginRight:10, borderBottomWidth:(index === currentBoardItem.authWaiting.length -1 ? 0 : 1), borderBottomColor:'#dddddd'}}>
                <Left style={{borderBottomWidth:0}}>
                  <Thumbnail small source={{uri: item.thumb}}/>
                </Left>
                <Body style={{borderBottomWidth:0, justifyContent:'center', width:'25%'}}>
                <Text>{item.name}</Text>
                </Body>
                <Right style={{borderBottomWidth:0,width:'30%'}}>
                  <Body>
                  <Text note numberOfLines={1} ellipsizeMode='tail'>{item.mbaType}</Text>
                  <Text note numberOfLines={1} ellipsizeMode='tail'>{item.company}</Text>
                  </Body>
                </Right>
                <Button transparent  onPress={() => this.handleAuthWaiting(index, true)}
                        style={{borderWidth:1, borderColor:'#cccccc', marginLeft:5, marginTop:10, width:60, padding:0, height:35, justifyContent:'center'}}>
                  <Text style={{color:'#333333'}}>승인</Text>
                </Button>
                <Button transparent  onPress={() => this.handleAuthWaiting(index, false)}
                        style={{borderWidth:1, borderColor:'#cccccc', marginLeft:5, marginTop:10, width:60, padding:0, height:35, justifyContent:'center'}}>
                  <Text style={{color:'#333333'}}>거절</Text>
                </Button>
              </ListItem>
            )}
            keyExtractor={(item) => item.docId}
          />
          <Body style={{alignItems: 'center', flexDirection:'row', marginTop:20}}>
          <Button style={{width:100, justifyContent:'center', backgroundColor:'#999999', marginRight:5}} onPress={Actions.pop}>
            <Text>취소</Text>
          </Button>
          <Button style={{width:100, justifyContent:'center', backgroundColor:'#394eb7', marginLeft:5}} onPress={this.handleSubmit}>
            <Text>확인</Text>
          </Button>
          </Body>
        </Content>
      </Container>
    );
  }
}

export default ManageBoard;
