import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Dimensions, Image, Platform, ScrollView, StyleSheet,} from 'react-native'
import {Body, Button, Input, Left, ListItem, Text, View} from 'native-base';
import {Actions} from 'react-native-router-flux';
import Loading from './Loading';
import Messages from './Messages';
import MainLogo from '../../images/logo_splash.png';
import {LinearGradient} from "expo";
// import Icon from 'react-native-vector-icons/EvilIcons';

let scrollYPos = 0;

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: (props.member && props.member.email) ? props.member.email : '',
      password: '',
      screenHeight: Dimensions.get('window').height,
      screenWidth: Dimensions.get('window').width,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  static propTypes = {
    member: PropTypes.shape({
      email: PropTypes.string,
    }),
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    onFormSubmit: PropTypes.func.isRequired,
  }

  static defaultProps = {
    error: null,
    member: {},
  }

  handleChange = (name, val) => {
    this.setState({
      ...this.state,
      [name]: val,
    });
  }

  handleSubmit = () => {
    this.props.onFormSubmit(this.state)
      .then((result) => {

        if(!this.props.member.termsCheck) {
          Actions.terms()
          return;
        }

        if(result) Actions.home()
      })
      .catch(e => console.log(`Error: ${e}`));
  }

  scrollToBottom = () => {
    if(Platform.OS === 'ios'){
      return;
    }
    scrollYPos = this.state.screenHeight * 0.3;
    this.scroller.scrollTo({x: 0, y: scrollYPos});
  };

  render() {

    const {loading, error} = this.props;
    if (loading) return <Loading/>;

    return (
      <ScrollView style={styles.container} ref={(scroller) => {this.scroller = scroller}}>
        <LinearGradient colors={['#394eb7', '#6965dc']} start={[0, 0]} end={[1, 1]}>
          <ListItem noBorder>
            <Body style={{alignItems: 'center'}}>
            <Image
              style={{width: 200, height: 300}}
              resizeMode="contain"
              source={MainLogo}/>
            </Body>
          </ListItem>
          <ListItem noBorder>
            <Left>
              <Text style={{paddingLeft: '13%', width: '25%', color:'#ffffff'}}>ID</Text>
              <Body style={{paddingRight: '20%', height:35}}>
              <Input
                autoCapitalize="none"
                value={this.state.email}
                keyboardType="email-address"
                onChangeText={v => this.handleChange('email', v)}
                style={{backgroundColor:'#ffffff'}}
                onFocus={this.scrollToBottom}
              />
              </Body>
            </Left>
          </ListItem>
          <ListItem noBorder style={{marginTop:0, paddingTop:0}}>
            <Left>
              <Text style={{paddingLeft: '13%', width: '25%', color:'#ffffff'}}>PW</Text>
              <Body style={{paddingRight: '20%', height:35}}>
              <Input
                autoCapitalize="none"
                secureTextEntry
                onChangeText={v => this.handleChange('password', v)}
                style={{backgroundColor:'#ffffff'}}
                onFocus={this.scrollToBottom}
              />
              </Body>
            </Left>
          </ListItem>
          <ListItem noBorder>
            <Body style={{alignItems: 'center'}}>
            <View style={{marginBottom:0, paddingBottom:0}}>

              <Button transparent>
                {/*<Icon name="check" size={40} color='#ffffff' onPress={v => this.handleChange('keepLogin', v)}/>*/}
                {/*<Text style={{color: '#ffffff', alignItems: 'center', paddingLeft:0}}>로그인 상태 유지</Text>*/}
              </Button>
            </View>
            </Body>
          </ListItem>
          {error &&
          <ListItem noBorder>
            <Body style={{alignItems: 'center'}}>
            <View transparent><Messages message={error}/></View>
            </Body>
          </ListItem>
          }
          <ListItem noBorder>
            <Body style={{alignItems: 'center'}}>
            <View style={{marginBottom:0, paddingBottom:0}}>
              <Button bordered style={{borderColor: '#ffffff', marginBottom:0, paddingBottom:0}} onPress={this.handleSubmit}>
                  <Text style={{color: '#ffffff', alignItems: 'center'}}>로그인</Text>
              </Button>
            </View>
            </Body>
          </ListItem>
          <ListItem noBorder >
            <Body style={{alignItems: 'center', paddingBottom:200}}>
            <View style={{flexDirection: 'row'}}>
              <Button transparent onPress={Actions.signup} style={{paddingTop:0}}>
                  <Text style={{color: '#ffffff', alignItems: 'center'}}>회원가입</Text>
              </Button>
              <Button transparent onPress={Actions.forgotPassword} style={{paddingTop:0}}>
                <Text style={{color: '#ffffff', alignItems: 'center'}}>아이디 찾기</Text>
              </Button>
              <Button transparent onPress={Actions.forgotPassword} style={{paddingTop:0}}>
                <Text style={{color: '#ffffff', alignItems: 'center'}}>비밀번호 찾기</Text>
              </Button>
            </View>
            </Body>
          </ListItem>
        </LinearGradient>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    backgroundColor: 'yellow',
    flexDirection: 'column',
    height: Dimensions.get('window').height,
    justifyContent: 'center'
  },
  screenA: {
    backgroundColor: '#F7CAC9',
  },
  screenB: {
    backgroundColor: '#92A8D1',
  },
  screenC: {
    backgroundColor: '#88B04B',
  },
  letter: {
    color: '#000',
    fontSize: 60,
    textAlign: 'center'
  },
  scrollButton: {
    alignSelf: 'center',
    backgroundColor: 'white',
    height: 50,
    marginTop: 50,
    width: 150,
  },
  scrollButtonText: {
    padding: 20,
    textAlign: 'center',
  },
});

export default Login;
