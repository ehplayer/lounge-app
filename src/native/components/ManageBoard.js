import React from 'react';
import PropTypes from 'prop-types';
import {
  Body,
  Button,
  Card, CardItem,
  Container,
  Content,
  Input,
  Left, List,
  ListItem, Picker,
  Right,
  Separator,
  Text,
  Thumbnail
} from 'native-base';
import {Actions} from 'react-native-router-flux';
import Loading from './Loading';
import checkedIcon from '../../images/checkO.png'
import uncheckedIcon from '../../images/checkX.png'
import {FlatList, Image} from "react-native";
import {ImagePicker, Permissions} from "expo";
import Icon from 'react-native-vector-icons/Entypo';

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
      stepList: [],
    };
    this.getBoardItemByBoardId = this.getBoardItemByBoardId.bind(this);

    this.handleChange = this.handleChange.bind(this);
    this.changeItem = this.changeItem.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.removeStepMemberList = this.removeStepMemberList.bind(this);
  }
  componentWillReceiveProps (nextProps){
    if(nextProps.menu.boardList && !this.state.currentBoardItem){
      this.setState({
        ...this.state,
        currentBoardItem: nextProps.menu.boardList[0],
        originalBoardItem: nextProps.menu.boardList[0],
      });
    }

    if(this.state.currentBoardItem){
      let authUserList = this.state.currentBoardItem.authUserList || []
      this.state.stepList = authUserList.concat(nextProps.member.stepMemberList);
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
  removeStepMemberList = (index) => {
    const authUserList = this.state.currentBoardItem.authUserList;
    if(authUserList.length < index + 1){
      this.props.removeStepMemberList(index - authUserList.length)
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

  }

  render() {
    const { loading, error, success, member, menu} = this.props;
    let {currentBoardItem, stepList} = this.state;
    if (loading || !currentBoardItem) return <Loading/>;

    return (
      <Container>
        <Content style={{backgroundColor:'#ffffff'}}>
          <List transparent>
            <ListItem header style={{height:60}}>
              {currentBoardItem.thumb && currentBoardItem.thumb !== '#' ?
                <Thumbnail small
                  source={{uri: currentBoardItem.thumb}}
                />
                :
                <Button style={{width:50, height:50, borderRadius: 30, backgroundColor:'#cccccc'}}/>
              }
              <Body>
              <Picker
                placeholder={currentBoardItem.name}
                textStyle={{ color: "#333333" }}
                itemStyle={{
                  marginLeft: 0,
                }}
                note={false}
                style={{ width: '93%' }}
                selectedValue={currentBoardItem.name}
                onValueChange={boardId => this.changeItem(this.getBoardItemByBoardId(boardId))}>
                {menu.boardList && menu.boardList.map(item =>
                  <Picker.Item key={item.docId} label={item.name ? item.name : ''} value={item.docId} />
                )}
              </Picker>
              </Body>
              <Right>
                <Icon name="chevron-thin-down" size={25} style={{color:'gray', paddingRight:10}}/>
              </Right>
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
            data={stepList}
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
              <ListItem avatar style={{height:70, marginLeft:10, marginRight:10, borderBottomWidth:(index === stepList.length -1 ? 0 : 1), borderBottomColor:'#dddddd'}}>
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
                <Button transparent  onPress={() => this.removeStepMemberList(index)}
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