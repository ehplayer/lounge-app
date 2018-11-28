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
import Modal from "react-native-modal";
import loungeStyle from '../constants/loungeStyle'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

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

class UpdateArticle extends React.Component {

    static propTypes = {
        error: PropTypes.string,
        success: PropTypes.string,
        loading: PropTypes.bool.isRequired,
        updateArticle: PropTypes.func.isRequired,
        member: PropTypes.shape({
            email: PropTypes.string,
        }).isRequired,
        boardItem: PropTypes.shape({})
    }

    static defaultProps = {
        error: null,
        success: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            ...props.article,
            imageUrlList: props.article.urlList,
            imageBlobList: [],
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.deleteArticle = this.deleteArticle.bind(this);
    }

    deleteAlertShow = () => {
        this.setState({
            ...this.state,
            visibleDeleteConfirmModal: true,
        });
    };

    deleteArticle = () => {
        this.props.deleteArticle(this.state, this.props)
            .then(() => {
                Actions[this.props.sectionType]();
            })
            .catch(e => console.log(`Error: ${e}`));
    };

    handleSubmit = () => {
        let errorMessage = false;
        if (!this.state.title.trim()) {
            errorMessage = '제목을 입력해주세요.'
        } else if (!this.state.content.trim()) {
            errorMessage = '내용을 입력해주세요.'
        } else if (this.state.isSchedule && (!this.state.startDatetime || !this.state.endDatetime)) {
            errorMessage = '날짜를 정확히 입력해주세요.'
        } else if (this.state.isSchedule && !this.state.place.trim()) {
            errorMessage = '장소를 입력해주세요.'
        } else if (this.state.isLimitMember && !this.state.joinMemberLimit.trim()) {
            errorMessage = '참석자수 제한을 입력해주세요.'
        }

        if (errorMessage) {
            this.setState({
                ...this.state,
                visibleModal: true,
                isDelete: true,
                errorMessage: errorMessage,
            });
            return false;
        }
        this.props.updateArticle(this.state, this.props)
            .then(() => Actions.pop())
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
        const {loading, error, success, member, sectionType, article} = this.props;
        const {imageUrlList, isSchedule, isNotice, isLimitMember} = this.state;
        if (loading) return <Loading/>;
        const checkedIcon = iconMap[sectionType];
        const currentBoardAuth = member[sectionType + 'Auth'] && member[sectionType + 'Auth'].find(item => item.boardId === article.boardDocId);
        const isAdmin = currentBoardAuth && currentBoardAuth.authType === 'S';
        return (
            <Container>
                <KeyboardAwareScrollView enableOnAndroid enableAutomaticScroll extraScrollHeight={250}
                                         keyboardShouldPersistTaps={'handled'}
                >
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
                                          style={{width: '100%'}}
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
                                        <Button key={imageUrl} style={{marginRight: 7}}
                                                onPress={() => this.removeImage(idx)}><Image
                                            style={styles.image} resizeMode="contain"
                                            source={{uri: imageUrl}}/></Button>
                                    )}
                                </View>
                                <Separator style={{height: 1, width: '100%'}}/>

                                {isAdmin &&
                                <View style={[{flexDirection: 'row', paddingBottom: 10}]}>
                                    <TouchableOpacity
                                        onPress={() => this.handleChange('isSchedule', !isSchedule)}
                                        style={{paddingRight: 20, paddingTop: 10, width: 30}}>
                                        <Image
                                            style={{width: 28, height: 28, marginRight: '10%'}}
                                            resizeMode="contain"
                                            source={isSchedule ? checkedIcon : uncheckedIcon}
                                        />
                                    </TouchableOpacity>
                                    <Text style={{
                                        width: '35%',
                                        color: (isSchedule ? '#222222' : '#cccccc'),
                                        paddingTop: 15,
                                        paddingLeft: 15
                                    }}
                                          onPress={() => this.handleChange('isSchedule', !isSchedule)}>일정</Text>
                                    <TouchableOpacity
                                        onPress={() => this.handleChange('isNotice', !isNotice)}
                                        style={{paddingRight: 20, paddingTop: 10, width: 30}}>
                                        <Image
                                            style={{width: 28, height: 28, marginRight: '10%'}}
                                            resizeMode="contain"
                                            source={isNotice ? checkedIcon : uncheckedIcon}
                                        />
                                    </TouchableOpacity>
                                    <Text style={{
                                        width: '35%',
                                        color: (isNotice ? '#222222' : '#cccccc'),
                                        paddingTop: 15,
                                        paddingLeft: 15
                                    }}
                                          onPress={() => this.handleChange('isNotice', !isNotice)}>공지</Text>
                                </View>
                                }
                                {isAdmin && isSchedule &&
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
                                        placeholder="시작 시각"
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
                                        minDate={new Date()}

                                    />
                                    <Text style={{paddingHorizontal: 10}}>~</Text>
                                    <DatePicker
                                        style={{width: 150}}
                                        date={this.state.endDatetime}
                                        mode="datetime"
                                        format="MM월 DD일 HH시 mm분"
                                        placeholder="종료 시각"
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
                                        }}
                                        locale='ko'
                                        showIcon={false}
                                        minDate={this.state.startDatetime || new Date()}
                                    />
                                </View>
                                }
                                {isAdmin && isSchedule &&
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

                                {isAdmin && isSchedule &&
                                <View style={[{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    width: '100%',
                                    borderTopWidth: 0
                                }]}>
                                    <TouchableOpacity
                                        onPress={() => this.handleChange('isLimitMember', !isLimitMember)}
                                        style={{paddingRight: 20, paddingTop: 10, width: 30}}>
                                        <Image
                                            style={{width: 28, height: 28, marginRight: '10%'}}
                                            resizeMode="contain"
                                            source={isLimitMember ? checkedIcon : uncheckedIcon}
                                        />
                                    </TouchableOpacity>

                                    <Label style={{paddingLeft: '5%', marginTop: 10}}>참석자수 제한</Label>
                                    <Input
                                        id="place"
                                        placeholder="00"
                                        style={{width: 50, marginTop: 10, marginLeft: '10%'}}
                                        onChangeText={v => this.handleChange('joinMemberLimit', v)}
                                    />
                                    <Text style={{marginTop: 10, marginRight: '30%'}}>명</Text>
                                </View>
                                }

                                <View style={[{flexDirection: 'row', paddingVertical: 60, alignContent:'center',justifyContent: 'center',}]}>
                                    <Button style={[{
                                        backgroundColor: '#cccccc',
                                        marginLeft: '19%',
                                        marginRight: 5,
                                        width: '30%',
                                        justifyContent: 'center'
                                    }]} onPress={this.deleteAlertShow}>
                                        <Text>삭제</Text>
                                    </Button>
                                    <Button style={[{
                                        width: '30%',
                                        justifyContent: 'center',
                                        backgroundColor: bgColorMap[this.props.sectionType]
                                    }]} onPress={this.handleSubmit}>
                                        <Text>수정</Text>
                                    </Button>
                                </View>
                                </Body>
                            </CardItem>
                        </Card>
                        <Modal
                            isVisible={this.state.visibleModal}
                            onBackdropPress={() => this.setState({visibleModal: false})}
                        >
                            <View style={loungeStyle.modalContent}>
                                <Text style={{
                                    paddingTop: 70,
                                    fontSize: 16,
                                    fontWeight: '100'
                                }}>{this.state.errorMessage}</Text>
                                <Body style={{
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    paddingTop: 70,
                                    paddingBottom: 40
                                }}>
                                <Button style={{
                                    width: 120,
                                    height: 50,
                                    justifyContent: 'center',
                                    borderRadius: 0,
                                    backgroundColor: bgColorMap[this.props.sectionType]
                                }} onPress={() => {
                                    this.setState({visibleModal: false})
                                }}>
                                    <Text>확인</Text>
                                </Button>
                                </Body>
                            </View>
                        </Modal>
                        <Modal
                            isVisible={this.state.visibleDeleteConfirmModal}
                            onBackdropPress={() => this.setState({visibleDeleteConfirmModal: false})}
                        >
                            <View style={loungeStyle.modalContent}>
                                <Text style={{
                                    paddingTop: 70,
                                    fontSize: 16,
                                    fontWeight: '100'
                                }}>{'정말 삭제하시겠습니까?'}</Text>
                                <Body style={{
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    paddingTop: 70,
                                    paddingBottom: 40
                                }}>
                                <Button style={{
                                    width: 120,
                                    height: 50,
                                    justifyContent: 'center',
                                    borderRadius: 0,
                                    marginRight: 5,
                                    backgroundColor: '#dddddd'
                                }} onPress={() => this.setState({visibleDeleteConfirmModal: false})}>
                                    <Text>취소</Text>
                                </Button>
                                <Button style={{
                                    width: 120,
                                    height: 50,
                                    justifyContent: 'center',
                                    borderRadius: 0,
                                    marginLeft: 5,
                                    backgroundColor: bgColorMap[this.props.sectionType]
                                }} onPress={() => {
                                    this.deleteArticle();
                                    this.setState({visibleDeleteConfirmModal: false})
                                }}>
                                    <Text>확인</Text>
                                </Button>
                                </Body>
                            </View>
                        </Modal>
                    </Form>
                </KeyboardAwareScrollView>
            </Container>
        );
    }
}

export default UpdateArticle;