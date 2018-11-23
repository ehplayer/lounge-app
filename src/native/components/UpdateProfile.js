import React from 'react';
import PropTypes from 'prop-types';
import {Body, Button, Container, Content, Form, Input, Left, ListItem, Right, Text, Thumbnail, View} from 'native-base';
import checkedIcon from '../../images/checkO.png'
import uncheckedIcon from '../../images/checkX.png'
import Loading from './Loading';
import {Image, StyleSheet} from "react-native";
import {Actions} from 'react-native-router-flux';
import {ImagePicker, Permissions} from "expo";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

const styles = StyleSheet.create({
    input: {
        borderBottomWidth:1, height:22, borderColor:'#cccccc'
    }
});


class UpdateProfile extends React.Component {
  static propTypes = {
    error: PropTypes.string,
    success: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    onFormSubmit: PropTypes.func.isRequired,
    member: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      thumb: PropTypes.string,
      isSingle: PropTypes.boolean,
      isProfileOpen: PropTypes.boolean,
    }),
  }

  static defaultProps = {
    error: null,
    success: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      thumb: props.member.thumb,
      phone: props.member.phone,
      company: props.member.company,
      studentNum: props.member.studentNum,
      className: props.member.className,
      mbaType: props.member.mbaType,
      isSingle: props.member.isSingle || false,
      isProfileOpen: props.member.isProfileOpen || false,
      imageUrl: undefined,
      imageBlob: undefined,
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
    this.props.onFormSubmit(this.state)
      .then(() => Actions.pop())
      .catch(e => console.log(`Error: ${e}`));
  }

  render() {
    const {loading, error, success, member} = this.props;

    // Loading
    if (loading) return <Loading/>;

    return (
      <Container>
          <KeyboardAwareScrollView style={{backgroundColor: '#ffffff'}} enableOnAndroid extraScrollHeight={180}
                                   keyboardShouldPersistTaps={'handled'}
          >
          <ListItem>
            <Body style={{alignItems: 'center'}}>
            <View style={{flexDirection:'row'}}>
              <Left />
              <Body >
              <Thumbnail large
                         source={{uri: this.state.imageUrl ? this.state.imageUrl : this.state.thumb}}/>
              </Body>
              <Right >
                <Button transparent onPress={this.pickImage}
                        style={{borderWidth:1,borderColor:'#cccccc', width:80, height:30, justifyContent:'center'}}>
                  <Text style={{fontSize:12, color:'#999999', margin:0, padding:0, }}>사진변경</Text>
                </Button>
              </Right>
            </View>
            <Text style={{fontSize:20, paddingTop:10}}>{this.props.member.name}</Text>
            </Body>
          </ListItem>
          <Form>
            <ListItem noBorder>
              <Left>
                <Text style={{paddingLeft: '5%', width: '25%'}}>ID</Text>
                <Body>
                <Text>{member.email}</Text>
                </Body>
              </Left>
            </ListItem>
            <ListItem noBorder>
              <Left>
                <Text style={{paddingLeft: '5%', width: '25%'}}>핸드폰</Text>
                <Body style={{flexDirection: 'row'}}>
                  <Input style={styles.input} value={this.state.phone} onChangeText={v => this.handleChange('phone', v)}/>
                </Body>
              </Left>
            </ListItem>
            <ListItem noBorder>
              <Left>
                <Text style={{paddingLeft: '5%', width: '25%'}}>학번</Text>
                <Body style={{flexDirection: 'row'}}>
                  <Input style={styles.input} value={this.state.studentNum} onChangeText={v => this.handleChange('studentNum', v)}/>
                </Body>
              </Left>
            </ListItem>
            <ListItem noBorder>
              <Left>
                <Text style={{paddingLeft: '5%', width: '25%'}}>기수</Text>
                <Body style={{flexDirection: 'row'}}>
                <Input style={styles.input} value={this.state.className} onChangeText={v => this.handleChange('className', v)}/>
                </Body>
              </Left>
            </ListItem>
            <ListItem noBorder>
              <Left>
                <Text style={{paddingLeft: '5%', width: '25%'}}>MBA과정</Text>
                <Body style={{flexDirection: 'row'}}>
                  <Input style={styles.input} value={this.state.mbaType} onChangeText={v => this.handleChange('mbaType', v)}/>
                </Body>
              </Left>
            </ListItem>
            <ListItem noBorder>
              <Left>
                <Text style={{paddingLeft: '5%', width: '25%'}}>직장</Text>
                <Body style={{flexDirection: 'row'}}>
                <Input style={styles.input} value={this.state.company} onChangeText={v => this.handleChange('company', v)}/>
                </Body>
              </Left>
            </ListItem>
            <ListItem noBorder>
              <Left>
                <Text style={{paddingLeft: '5%', height:45, width: '25%'}}>싱글여부</Text>
                <Body>
                <Button transparent onPress={() => this.handleChange('isSingle', !this.state.isSingle)}>
                  <Image
                    style={{width: 28, height: 28, marginRight:10}}
                    resizeMode="contain"
                    source={this.state.isSingle ? checkedIcon : uncheckedIcon}
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
                <Button transparent onPress={() => this.handleChange('isProfileOpen', !this.state.isProfileOpen)} >
                  <Image
                    style={{width: 28, height: 28, marginRight:10}}
                    resizeMode="contain"
                    source={this.state.isProfileOpen ? checkedIcon : uncheckedIcon}
                  />
                </Button>
                <Text style={{color:'#999999', fontSize:13}}> * 비공개 시 이름, 사진, ID를 제외한</Text>
                <Text style={{color:'#999999', fontSize:13}}> 나머지는 다른 원우에게 공개되지 않습니다.</Text>
                </Body>
              </Left>
            </ListItem>
            <Body style={{alignItems: 'center'}}>
              <Button style={{width:100, justifyContent:'center', backgroundColor:'#394eb7'}} onPress={this.handleSubmit}>
                <Text>확인</Text>
              </Button>
            </Body>
          </Form>
          </KeyboardAwareScrollView>
      </Container>
    );
  }
}

export default UpdateProfile;
