import React from 'react';
import PropTypes from 'prop-types';
import {Body, Button, Container, Content, Input, Left, ListItem, Right, Separator, Text, Thumbnail} from 'native-base';
import {Actions} from 'react-native-router-flux';
import Loading from './Loading';
import checkedIcon from '../../images/checkO.png'
import uncheckedIcon from '../../images/checkX.png'
import {FlatList, Image} from "react-native";
import {ImagePicker, Permissions} from "expo";

class CreateBoard extends React.Component {
  static propTypes = {
    error: PropTypes.string,
    success: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    onFormSubmit: PropTypes.func.isRequired,
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
      staffMemberList: props.member.staffMemberList,
      boardName: '',
      isUniv:true,
      isClub:false,
      imageUrl: '#',
      searchName:''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (name, val) => {
    this.setState({
      ...this.state,
      [name]: val,
    });
  };
  handleChangeType = (name, val) => {
    this.setState({
      ...this.state,
      [name]: val,
      [name === 'isUniv' ? 'isClub': 'isUniv']: false,
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
      this.handleChange('imageUrl', result.uri);
      this.handleChange('imageBlob', blob);
    }
  };
  handleSubmit = () => {
    this.props.onFormSubmit(this.state, this.props.member)
      .then(() => {

        return Actions.pop();
      })
      .catch(e => console.log(`Error: ${e}`));
  }

  render() {
    const { loading, error, success, member} = this.props;
    if (loading) return <Loading/>;
    console.log(member)
    return (
      <Container>
        <Content style={{backgroundColor:'#ffffff'}}>
          <ListItem>
            <Left>
              <Text style={{width: '30%'}}>게시판 선택</Text>
              <Left style={{flexDirection:'row', alignItems:'center'}} >
                <Button transparent onPress={() => this.handleChangeType('isUniv', true)}>
                  <Image
                    style={{width: 28, height: 28, marginRight:10}}
                    resizeMode="contain"
                    source={this.state.isUniv ? checkedIcon : uncheckedIcon}
                  />
                </Button>
              <Text onPress={() => this.handleChangeType('isUniv', !this.state.isUniv)}>Univ.</Text>
              </Left>
              <Left style={{flexDirection:'row', alignItems:'center'}}>
                <Button transparent onPress={() => this.handleChangeType('isClub', true)}>
                  <Image
                    style={{width: 28, height: 28, marginRight:10}}
                    resizeMode="contain"
                    source={this.state.isClub ? checkedIcon : uncheckedIcon}
                  />
                </Button>
                <Text onPress={() => this.handleChangeType('isClub', !this.state.isClub)}>Club</Text>
              </Left>
            </Left>
          </ListItem>
          <ListItem>
            <Left>
              <Text style={{width: '30%'}}>게시판명</Text>
              <Left style={{flexDirection: 'row', alignItems:'center'}}>
                <Input inlineLabel onChangeText={v => this.handleChange('boardName', v)} style={{borderBottomWidth:1}} value={this.state.boardName}/>
              </Left>
            </Left>
          </ListItem>
          <ListItem>
            <Left>
              <Text style={{width: '30%'}}>대표사진</Text>
              <Left style={{flexDirection: 'row', alignItems:'center'}}>
                {this.state.imageUrl && this.state.imageUrl !== '#' ?
                  <Thumbnail
                    source={{uri: this.state.imageUrl}}
                    />
                  :
                  <Button style={{width:50, height:50, borderRadius: 30, backgroundColor:'#cccccc'}}/>
                }
              </Left>
              <Button transparent style={{borderWidth:1, borderColor:'#cccccc', marginLeft:10, marginTop:10, width:90, padding:0, height:35, justifyContent:'center'}}
                      onPress={this.pickImage}><Text style={{color:'#333333'}}>사진선택</Text></Button>
            </Left>
          </ListItem>
          <Separator style={{height: 10}}/>
          <ListItem>
            <Left>
              <Text style={{width: '30%'}}>스탭추가</Text>
              <Left style={{flexDirection: 'row', alignItems:'center'}}>
                <Input inlineLabel onChangeText={v => this.handleChange('searchName', v)} style={{borderBottomWidth:1}} value={this.state.searchName} placeholder={'이름으로 검색'}/>
              </Left>
              <Button transparent onPress={() => Actions.memberSearch({searchName: this.state.searchName})}
                      style={{borderWidth:1, borderColor:'#cccccc', marginLeft:20, marginTop:10, width:70, padding:0, height:35, justifyContent:'center'}}>
                <Text style={{color:'#333333'}}>검색</Text>
              </Button>
            </Left>
          </ListItem>
          <FlatList
            data={member.staffMemberList}
            ListEmptyComponent={() =>
              <ListItem noBorder style={{height:70, justifyContent:'center'}}>
                <Text style={{color:'#cccccc'}}>검색결과가 없습니다.</Text>
              </ListItem> }
            renderItem={({item, index}) => (
              <ListItem avatar style={{height:70, marginLeft:10, marginRight:10, borderBottomWidth:(index === member.staffMemberList.length -1 ? 0 : 1), borderBottomColor:'#dddddd'}}>
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
                <Button transparent  onPress={() => this.props.removeStaffMemberList(index)}
                        style={{borderWidth:1, borderColor:'#cccccc', marginLeft:5, marginTop:10, width:60, padding:0, height:35, justifyContent:'center'}}>
                  <Text style={{color:'#333333'}}>취소</Text>
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

export default CreateBoard;
