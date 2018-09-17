import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Container, Content, List, ListItem, Body, Left, Text, Icon } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Header from './Header';

class AuthWating extends React.Component {
  static propTypes = {
    member: PropTypes.shape({}),
    logout: PropTypes.func.isRequired,
  };
  
  static defaultProps = {
    member: {},
  };

  render(){
    const { member, logout} = this.props;

    return (
      <Container>
        <Content>
          <List>
              <View>
                <Content padder>
                  <Header
                    title={`안녕하세요 ${member.name}님`}
                    content={`승인후 사용가능 auth : ${member.auth}`}
                  />
                </Content>
    
                <ListItem onPress={Actions.updateProfile} icon>
                  <Left>
                    <Icon name="person-add" />
                  </Left>
                  <Body>
                    <Text>Update My Profile</Text>
                  </Body>
                </ListItem>
                <ListItem onPress={logout} icon>
                  <Left>
                    <Icon name="power" />
                  </Left>
                  <Body>
                    <Text>Logout</Text>
                  </Body>
                </ListItem>
              </View>
          </List>
        </Content>
      </Container>
    )
  }
}




export default AuthWating;
