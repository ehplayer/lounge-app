import React from 'react';
import PropTypes from 'prop-types';
import {
  Body,
  Button,
  CheckBox,
  Container,
  Content,
  Form,
  Input,
  Left,
  ListItem,
  Right,
  Text,
  Thumbnail
} from 'native-base';
import checkedIcon from '../../images/checkO.png'
import uncheckedIcon from '../../images/checkX.png'
import {Actions} from 'react-native-router-flux';

import Loading from './Loading';
import {Image} from "react-native";

class ProfileHome extends React.Component {
  static propTypes = {
    error: PropTypes.string,
    success: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    onFormSubmit: PropTypes.func.isRequired,
    member: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      thumb: PropTypes.string,
      mbaType: PropTypes.string,
      isSingle: PropTypes.boolean,
      isProfileOpen: PropTypes.boolean,
    }),
  };
  static defaultProps = {
    error: null,
    success: null,
  };

  componentWillReceiveProps (nextProps) {
    if (!nextProps.member.name) {
      Actions.login();
    }
  }

  render() {
    const {loading, error, success, member, logout} = this.props;
    // Loading
    if (loading) return <Loading/>;
    return (
      <Container>
        <Content style={{backgroundColor: '#ffffff'}}>
          <ListItem>
            <Body style={{alignItems: 'center'}}>
            <Thumbnail large
                       source={{uri: member.thumb}}/>
            <Text style={{fontSize:20, paddingTop:10}}>{this.props.member.name}</Text>
            </Body>
          </ListItem>
          <Form>
            <ListItem noBorder>
              <Left style={{alignItems:'center'}}>
                <Text style={{paddingLeft: '5%', width: '25%'}}>ID</Text>
                <Body style={{flexDirection: 'row'}}>
                  <Text>{member.email}</Text>
                </Body>
                <Button transparent onPress={logout}
                        style={{borderWidth:1,borderColor:'#cccccc', width:75, height:30, justifyContent:'center'}}>
                  <Text style={{fontSize:12, color:'#999999', margin:0, padding:0, }}>로그아웃</Text>
                </Button>
              </Left>
            </ListItem>
            <ListItem noBorder>
              <Left>
                <Text style={{paddingLeft: '5%', width: '25%'}}>핸드폰</Text>
                <Body style={{flexDirection: 'row'}}>
                <Text>{member.phone && member.phone.slice(0,3) + ' - '}</Text>
                <Text >{member.phone && member.phone.slice(3,7) + ' - '}</Text>
                <Text >{member.phone && member.phone.slice(7,11)}</Text>
                </Body>
              </Left>
            </ListItem>
            <ListItem noBorder>
              <Left>
                <Text style={{paddingLeft: '5%', width: '25%'}}>학번</Text>
                <Body style={{flexDirection: 'row'}}>
                <Text>{member.studentNum}</Text>
                </Body>
              </Left>
            </ListItem>
            <ListItem noBorder>
              <Left>
                <Text style={{paddingLeft: '5%', width: '25%'}}>기수</Text>
                <Body style={{flexDirection: 'row'}}>
                <Text >{member.className}</Text>
                </Body>
              </Left>
            </ListItem>
            <ListItem noBorder>
              <Left>
                <Text style={{paddingLeft: '5%', width: '25%'}}>MBA과정</Text>
                <Body style={{flexDirection: 'row'}}>
                <Text>{member.mbaType}</Text>
                </Body>
              </Left>
            </ListItem>
            <ListItem noBorder>
              <Left>
                <Text style={{paddingLeft: '5%', width: '25%'}}>직장</Text>
                <Body style={{flexDirection: 'row'}}>
                <Text >{member.company}</Text>
                </Body>
              </Left>
            </ListItem>
            <ListItem noBorder>
              <Left>
                <Text style={{paddingLeft: '5%', height:45, width: '25%'}}>싱글여부</Text>
                <Body>
                <Button transparent >
                  <Image
                    style={{width: 28, height: 28, marginRight:10}}
                    resizeMode="contain"
                    source={member.isSingle ? checkedIcon : uncheckedIcon}
                  />
                </Button>
                <Text style={{color:'#999999', fontSize:13}}> * 싱글여부는 비공개이며</Text>
                <Text style={{color:'#999999', fontSize:13}}> 추후 관련 이벤트 진행 시 사용됩니다.</Text>
                </Body>
              </Left>
            </ListItem>
            <ListItem noBorder>
              <Left>
                <Text style={{paddingLeft: '5%', height:45, width: '25%'}}>공개여부</Text>
                <Body>
                <Button transparent >
                    <Image
                      style={{width: 28, height: 28, marginRight:10}}
                      resizeMode="contain"
                      source={member.isProfileOpen ? checkedIcon : uncheckedIcon}
                    />
                  </Button>
                  <Text style={{color:'#999999', fontSize:13}}> * 싱글여부는 비공개이며</Text>
                  <Text style={{color:'#999999', fontSize:13}}> 추후 관련 이벤트 진행 시 사용됩니다.</Text>
                </Body>
              </Left>
            </ListItem>
            <Body style={{alignItems: 'center'}}>
            <Button style={{width:100, justifyContent:'center', backgroundColor:'#394eb7'}} onPress={Actions.updateProfile}>
              <Text>수정</Text>
            </Button>
            </Body>
          </Form>
        </Content>
      </Container>
    );
  }
}

export default ProfileHome;
