import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {FlatList, Image, StyleSheet, TouchableOpacity, ViewPropTypes} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {getMemberData, logout} from '../../actions/member';
import schedulerIcon from '../../images/menu_scheduler.png'
import listIcon from '../../images/menu_list.png'
import newIcon from '../../images/menu_new.png'
import manageIcon from '../../images/menu_manage.png'
import approveIcon from '../../images/menu_approve.png'
import serviceApproveIcon from '../../images/menu_service_approve.png'

import {
  Body,
  Button,
  Container,
  Content,
  Left,
  List,
  ListItem,
  Right,
  Separator,
  Text,
  Thumbnail,
  View
} from 'native-base';
import Icon from 'react-native-vector-icons/EvilIcons';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'red',
  },
});

class DrawerContent extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    sceneStyle: ViewPropTypes.style,
    title: PropTypes.string,
  }


  static contextTypes = {
    drawer: PropTypes.object,
  }

  componentDidMount() {
    getMemberData();
  };

  render() {

    return (
      <Container>
        <Content>
          <List numColumns={2}>
            <ListItem onPress={Actions.profileHome}>
              <Left>
                <Thumbnail source={{uri: this.props.member.thumb}}/>
                <Body>
                <Text>{this.props.member.name}</Text>
                <Text note>{this.props.member.email}</Text>
                <Text note>{this.props.member.company}</Text>
                </Body>
              </Left>
            </ListItem>
            <Separator style={{height: 10}}/>
            <ListItem style={{borderBottomWidth:1, paddingLeft:0, marginLeft:0}}>
              <Left>
                <Button transparent style={{width:'100%'}} onPress={Actions.scheduler}>
                  <Body style={{alignItems: 'center'}}>
                  <Image
                    style={{height:45, width:'100%'}}
                    resizeMode="contain"
                    source={schedulerIcon}
                  />
                  </Body>
                </Button>
              </Left>
              <Left onPress={Actions.createBoard} style={{borderLeftWidth:1, borderColor:'#cccccc'}}>
                <Button transparent style={{width:'100%'}} onPress={Actions.boardList}>
                  <Body style={{alignItems: 'center', margin: 0, padding:0}}>
                  <Image
                    style={{height:45, width:'100%'}}
                    resizeMode="contain"
                    source={listIcon}
                  />
                  </Body>
                </Button>
              </Left>
            </ListItem>
            <ListItem style={{borderBottomWidth:1, paddingLeft:0, marginLeft:0}}>
              <Left>
                <Button transparent style={{width:'100%'}} onPress={Actions.createBoard}>
                <Body style={{alignItems: 'center'}}>
                  <Image
                    style={{height:45, width:'100%'}}
                    resizeMode="contain"
                    source={newIcon}
                  />
                </Body>
                </Button>
              </Left>
              <Left style={{borderLeftWidth:1, borderColor:'#cccccc'}}>
                <Button transparent style={{width:'100%'}} onPress={Actions.manageBoard}>
                <Body style={{alignItems: 'center', margin: 0, padding:0}}>
                  <Image
                    style={{height:45, width:'100%'}}
                    resizeMode="contain"
                    source={manageIcon}
                  />
                </Body>
                </Button>
              </Left>
            </ListItem>
            <ListItem style={{borderBottomWidth:1, paddingLeft:0, marginLeft:0}}>
              <Left>
                <Button transparent style={{width:'100%'}} onPress={Actions.scheduler}>
                <Body style={{alignItems: 'center'}}>
                  <Image
                    style={{height:45, width:'100%'}}
                    resizeMode="contain"
                    source={approveIcon}
                  />
                </Body>
                </Button>
              </Left>
              <Left onPress={Actions.scheduler} style={{borderLeftWidth:1, borderColor:'#cccccc'}}>
                <Button transparent style={{width:'100%'}} onPress={Actions.scheduler}>
                <Body style={{alignItems: 'center', margin: 0, padding:0}}>
                <Image
                  style={{height:45, width:'100%'}}
                  resizeMode="contain"
                  source={serviceApproveIcon}
                />
                </Body>
                </Button>
              </Left>
            </ListItem>
          </List>
        </Content>
      </Container>

    );
  }
}

const mapStateToProps = state => ({
  member: state.member || {},
});

const mapDispatchToProps = {
  memberLogout: logout,
  getMemberData,
};

export default connect(mapStateToProps, mapDispatchToProps)(DrawerContent);
