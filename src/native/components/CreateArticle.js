import React from 'react';
import PropTypes from 'prop-types';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import checkedIconPurple from '../../images/checkO_blue.png'
import checkedIconBlue from '../../images/checkO_blue.png'
import checkedIconGreen from '../../images/checkO_green.png'
import uncheckedIcon from '../../images/checkX.png'
import DatePicker from 'react-native-datepicker'
import {
    Body,
    Button,
    Card,
    CardItem,
    Container,
    Content,
    Form,
    Input,
    Item,
    Label,
    Separator,
    Text,
    Textarea,
    View,
} from 'native-base';
import Messages from './Messages';
import Loading from './Loading';
import {Actions} from 'react-native-router-flux'
import CameraImage from '../../images/camera.png';
import {ImagePicker, Permissions} from 'expo';

const styles = StyleSheet.create({
  image: {
    width: 50, height: 45,
    paddingLeft: 30,
    backgroundColor: '#D8D8D8'
  }
});
const bgColorMap = {
    hall: '#4581d9',
    home: '#535acb',
    univ: '#2b66ae',
    club: '#5b8b2b',
}
const iconMap = {
    hall: checkedIconPurple,
    home: checkedIconPurple,
    univ: checkedIconBlue,
    club: checkedIconGreen,
}

class CreateArticle extends React.Component {

  static propTypes = {
    error: PropTypes.string,
    success: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    createArticle: PropTypes.func.isRequired,
    member: PropTypes.shape({
      email: PropTypes.string,
    }).isRequired,
    boardType: PropTypes.string,
    boardItem: PropTypes.shape({})
  }

  static defaultProps = {
    error: null,
    success: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      content: '',
      imageUrlList: [],
      imageBlobList: [],
      errors: {},
      isSubmitting: false,
      isNotice: false,
      isSchedule: false,
      isLimitMember: false,
      startDatetime:'',
      startDatetimeLong:0,
      endDatetime:'',
      endDatetimeLong:0,
      place:'',
      joinMemberLimit:''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = () => {
    this.props.createArticle(this.state, this.props)
      .catch(e => console.log(`Error: ${e}`));
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
      const imageUrlList = this.state.imageUrlList;
      const imageBlobList = this.state.imageBlobList;
      imageUrlList.push(result.uri);
      imageBlobList.push(blob);

      this.handleChange('imageUrlList', imageUrlList);
      this.handleChange('imageBlob', imageBlobList);
    }
  };
  removeImage = (idx) => {
    const imageUrlList = this.state.imageUrlList;
    const imageBlobList = this.state.imageBlobList;
    imageUrlList.splice(idx, 1);
    imageBlobList.splice(idx, 1);
    this.handleChange('imageUrlList', imageUrlList);
    this.handleChange('imageBlob', imageBlobList);
  };
  handleChange = (name, val) => {
    this.setState({
      ...this.state,
      [name]: val,
    });
  };
  changeDatetime = (startDatetime, startDatetimeLong) => {
    this.setState({
      ...this.state,
      startDatetime: startDatetime,
      startDatetimeLong: startDatetimeLong,
    });
  };


  render() {
    const {loading, error, success} = this.props;
    const {imageUrlList, isSchedule, isNotice, isLimitMember} = this.state;
    if (loading) return <Loading/>;

    const checkedIcon = iconMap[this.props.sectionType];

    return (
      <Container>
        <Content>
          {error && <Messages message={error}/>}
          {success && <Messages message={success} type="success"/>}

          <Form>
            <Card transparent>
              <CardItem>
                <Body>
                <Item floatingLabel>
                  <Label>제목</Label>
                  <Input
                    value={this.state.title}
                    onChangeText={v => this.handleChange('title', v)}
                  />
                </Item>
                </Body>
              </CardItem>
            </Card>
            <Card transparent>
              <CardItem>
                <Body>
                <Textarea rowSpan={10} placeholder="내용"
                          style={{width:'100%'}}
                          value={this.state.content}
                          onChangeText={v => this.handleChange('content', v)}
                />
                </Body>
              </CardItem>
            </Card>

            <Card transparent>
              <CardItem>
                <Body>
                <View style={[{flexDirection: 'row', paddingBottom: 10}]}>
                  {imageUrlList.length < 5 &&
                  <Button transparent onPress={this.pickImage} style={{marginRight: 7}}>
                      <Image style={styles.image} resizeMode="stretch" source={CameraImage}/>
                  </Button>
                  }
                  {imageUrlList.map((imageUrl, idx) =>
                    <Button key={imageUrl} style={{marginRight: 7}} onPress={() => this.removeImage(idx)}><Image
                      style={styles.image} resizeMode="contain"
                      source={{uri: imageUrl}}/></Button>
                  )}
                </View>
                <Separator style={{height: 1, width: '100%'}}/>
                <View style={[{flexDirection: 'row', paddingBottom:10}]}>
                    <TouchableOpacity
                        onPress={() => this.handleChange('isSchedule', !isSchedule)}
                        style={{ paddingRight: 20, paddingTop: 10, width:30}}>
                        <Image
                            style={{width: 28, height: 28, marginRight:'10%'}}
                            resizeMode="contain"
                            source={isSchedule ? checkedIcon : uncheckedIcon}
                        />
                    </TouchableOpacity>
                  <Text style={{width: '35%', color: (isSchedule ? '#222222' : '#cccccc'), paddingTop: 15, paddingLeft:15}}
                        onPress={() => this.handleChange('isSchedule', !isSchedule)}>일정</Text>
                    <TouchableOpacity
                        onPress={() => this.handleChange('isNotice', !isNotice)}
                        style={{paddingRight: 20, paddingTop: 10, width:30}}>
                        <Image
                            style={{width: 28, height: 28, marginRight:'10%'}}
                            resizeMode="contain"
                            source={isNotice ? checkedIcon : uncheckedIcon}
                        />
                    </TouchableOpacity>
                  <Text style={{width: '35%', color: (isNotice ? '#222222' : '#cccccc'), paddingTop: 15, paddingLeft:15}}
                        onPress={() => this.handleChange('isNotice', !isNotice)}>공지</Text>
                </View>
                {isSchedule &&
                <View style={[{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: '#cccccc',
                  width: '100%'
                }]}>
                  <DatePicker
                    style={{width: 150}}
                    date={this.state.startDatetime}
                    mode="datetime"
                    format="MM월 DD일 HH시 mm분"
                    confirmBtnText="확인"
                    cancelBtnText="취소"
                    customStyles={{
                      dateInput: {
                        marginLeft: 0,
                        borderWidth: 0
                      }
                    }}
                    minuteInterval={10}
                    onDateChange={(datetime, origin) => {
                      this.changeDatetime(datetime, origin.valueOf())
                    }}
                    locale='ko'
                    showIcon={false}
                  />
                  <Text style={{paddingHorizontal: 10}}>~</Text>
                  <DatePicker
                    style={{width: 150}}
                    date={this.state.endDatetime}
                    mode="datetime"
                    format="MM월 DD일 HH시 mm분"
                    confirmBtnText="확인"
                    cancelBtnText="취소"
                    customStyles={{
                      dateInput: {
                        marginLeft: 0,
                        borderWidth: 0
                      }
                    }}
                    minuteInterval={10}
                    onDateChange={(datetime, origin) => {
                      this.handleChange('endDatetime', datetime);
                      //this.handleChange('endDatetimeLong', origin.valueOf());
                    }}
                    locale='ko'
                    showIcon={false}
                  />
                </View>
                }
                {isSchedule &&
                  <View style={[{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: '#cccccc',
                    width: '100%',
                    borderTopWidth: 0
                  }]}>
                    <Label style={{paddingLeft: '5%'}}>장소</Label>
                    <Input
                      id="place"
                      placeholder="장소를 입력하세요"
                      onChangeText={v => this.handleChange('place', v)}
                    />
                  </View>
                }

                {isSchedule &&
                <View style={[{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%',
                  borderTopWidth: 0
                }]}>
                    <TouchableOpacity
                        onPress={() => this.handleChange('isLimitMember', !isLimitMember)}
                        style={{paddingRight: 20, paddingTop: 10, width:30}}>
                        <Image
                            style={{width: 28, height: 28, marginRight:'10%'}}
                            resizeMode="contain"
                            source={isLimitMember ? checkedIcon : uncheckedIcon}
                        />
                    </TouchableOpacity>

                  <Label style={{paddingLeft: '5%', marginTop:10}}>참석자수 제한</Label>
                    <Input
                      id="place"
                      placeholder="00"
                      style={{width:50, marginTop:10, marginLeft:20}}
                      onChangeText={v => this.handleChange('joinMemberLimit', v)}
                    />
                    <Text style={{marginTop:10, marginRight:'30%'}}>명</Text>
                </View>
                }

                <View style={[{flexDirection: 'row', paddingTop: 80}]}>
                  <Button style={[{
                    backgroundColor: '#cccccc',
                    marginLeft: '19%',
                    marginRight: 5,
                    width: '30%',
                    justifyContent: 'center'
                  }]} onPress={Actions.pop}>
                    <Text>취소</Text>
                  </Button>
                  <Button style={[{width: '30%', justifyContent: 'center', backgroundColor: bgColorMap[this.props.sectionType]}]} onPress={this.handleSubmit}>
                    <Text>등록</Text>
                  </Button>
                </View>
                </Body>
              </CardItem>
            </Card>
          </Form>
        </Content>
      </Container>
    );
  }
}

export default CreateArticle;
