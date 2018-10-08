import React from 'react';
import PropTypes from 'prop-types';
import {Body, Button, Container, Content, Form, Input, Left, ListItem, Right, Text, Thumbnail, View, Separator, } from 'native-base';
import checkedIcon from '../../images/checkO.png'
import uncheckedIcon from '../../images/checkX.png'
import Loading from './Loading';
import {Image, Platform, StyleSheet, TouchableHighlight} from "react-native";
import {Actions} from 'react-native-router-flux';
import {ImagePicker, Permissions} from "expo";
import ModalDropDown from 'react-native-modal-dropdown';
import Modal from "react-native-modal";

const styles = StyleSheet.create({
    image: {
        width: 55, height: 48,
        paddingLeft: 30,
        backgroundColor: '#D8D8D8'
    },
    modalContent: {
        backgroundColor: "white",
        padding: 22,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)",
        height:260
    },
});


const errorMessageMap = {
    'auth/invalid-email': '잘못된 이메일 형식입니다.',
    'auth/email-already-in-use': '이미 가입된 이메일입니다.',
    'auth/weak-password': '비밀번호는 6자리 이상이어야합니다.'
};

class SignUp extends React.Component {
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
            isGraduation: false,

            thumb: '',
            company: '',
            isProfileOpen: true,
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
        let errorMessage = '';
        if(!this.state.email || this.state.email == ''){
            errorMessage = '이메일을 입력해주세요';
            this.handleChange('emailError', true);
        } else if(!this.state.password || this.state.password == ''){
            errorMessage = '비밀번호를 입력해주세요';
            this.handleChange('passwordError', true);
        } else if(!this.state.passwordCheck || this.state.passwordCheck == ''){
            errorMessage = '비밀번호 확인을 입력해주세요';
            this.handleChange('passwordCheckError', true);
        } else if(this.state.password != this.state.passwordCheck){
            errorMessage = '비밀번호 확인이 다릅니다.';
            this.handleChange('passwordCheckError', true);
        }
        if(errorMessage !== ''){
            this.handleChange('formErrorMessage', errorMessage);
            return this.handleChange('visibleModal', true);
        }

        this.props.onFormSubmit(this.state)
            .then(() => Actions.pop())
            .catch(e => {
                console.log(e.code)
                console.log(e.message)
                this.handleChange('formErrorMessage', errorMessageMap[e.code] || '오류가 발생하였습니다.');
                this.handleChange('visibleModal', true);
            });
    }
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

    render() {
        const {loading, error, success, member} = this.props;
        const universeList = [{name:'연세대', value:'yonsei'},
            {name:'고려대', value:'korea'},
            {name:'이화여대', value:'ewha'},
            {name:'한양대', value:'hanyang'},
        ];

        return (
            <Container>
                <Content style={{backgroundColor: '#ffffff'}}>
                    <ListItem>
                        <Body style={{alignItems: 'center'}}>
                        <View style={{flexDirection:'row'}}>
                            <Left />
                            <Body >
                            {this.state.imageUrl && this.state.imageUrl !== '#' ?
                                <Thumbnail large source={{uri: this.state.imageUrl ? this.state.imageUrl : this.state.thumb}}/>
                                :
                                <Button style={{marginLeft:20, width:80, height:80, borderRadius: 70, backgroundColor:'#cccccc'}}/>
                            }

                            </Body>
                            <Right >
                                <Button transparent onPress={this.pickImage}
                                        style={{borderWidth:1,borderColor:'#cccccc', width:75, height:30, justifyContent:'center'}}>
                                    <Text style={{fontSize:12, color:'#999999', margin:0, padding:0, }}>사진변경</Text>
                                </Button>
                            </Right>
                        </View>
                        <Text style={{fontSize:20, paddingTop:10}}>{this.props.member.name}</Text>
                        </Body>
                    </ListItem>
                    <Form>
                        <ListItem noBorder style={{marginTop:10, marginRight:10}}>
                            <Left>
                                <Text style={{paddingLeft: '5%', width: '30%', color:'#333333'}}>필수정보</Text>
                            </Left>
                        </ListItem>
                        <ListItem noBorder style={{marginTop:10, marginRight:10}}>
                            <Left>
                                <Text style={{paddingLeft: '5%', width: '30%', color: this.state.emailError ? 'red' : '#000000'}}>ID(email)</Text>
                                <Body>
                                    <Input style={{borderBottomWidth:1, height:22}} value={this.state.email} onChangeText={v => this.handleChange('email', v)}/>
                                </Body>
                            </Left>
                        </ListItem>
                        <ListItem noBorder style={{marginTop:10, marginRight:10}}>
                            <Left>
                                <Text style={{paddingLeft: '5%', width: '30%', color: this.state.passwordError ? 'red' : '#000000'}}>비밀번호</Text>
                                <Body>
                                <Input secureTextEntry={true} style={{borderBottomWidth:1, height:22}} value={this.state.password} onChangeText={v => this.handleChange('password', v)}/>
                                </Body>
                            </Left>
                        </ListItem>
                        <ListItem noBorder style={{marginTop:10, marginRight:10}}>
                            <Left>
                                <Text style={{paddingLeft: '5%', width: '30%', color: this.state.passwordCheckError ? 'red' : '#000000'}}>비밀번호 확인</Text>
                                <Body>
                                <Input secureTextEntry={true} style={{borderBottomWidth:1, height:22}} value={this.state.passwordCheck} onChangeText={v => this.handleChange('passwordCheck', v)}/>
                                </Body>
                            </Left>
                        </ListItem>
                        <ListItem noBorder style={{marginTop:10, marginRight:10}}>
                            <Left>
                                <Text style={{paddingLeft: '5%', width: '30%', color: this.state.phoneError ? 'red' : '#000000'}}>핸드폰</Text>
                                <Body style={{flexDirection: 'row'}}>
                                <Input style={{borderBottomWidth:1, height:22}} value={this.state.phone} onChangeText={v => this.handleChange('phone', v)}/>
                                </Body>
                            </Left>
                        </ListItem>
                        <ListItem noBorder style={{marginTop:10, marginRight:10}}>
                            <Left>
                                <Text style={{paddingLeft: '5%', width: '30%', color: this.state.studentNumError ? 'red' : '#000000'}}>학번</Text>
                                <Body style={{flexDirection: 'row'}}>
                                <Input style={{borderBottomWidth:1, height:22}} value={this.state.studentNum} onChangeText={v => this.handleChange('studentNum', v)}/>
                                </Body>
                            </Left>
                        </ListItem>
                        <ListItem noBorder style={{marginTop:10, marginRight:10}}>
                            <Left>
                                <Text style={{paddingLeft: '5%', width: '30%'}}>학교</Text>
                                <Body style={{flexDirection: 'row', borderBottomWidth:1}}>
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
                                                       width: '70%',
                                                       marginLeft:'30%',
                                                       borderWidth:1,
                                                       //height: Dimensions.get('window').height,
                                                       //backgroundColor: "rgba(0, 0, 0, 0.5)",
                                                       //paddingBottom: Dimensions.get('window').height - 165,
                                                   }}
                                                   options={universeList}
                                                   defaultValue={'연세대'}
                                                   renderButtonText={(rowData) => rowData.name}
                                                   renderRow={this.renderRow.bind(this)}
                                                   //renderSeparator={(sectionID, rowID) => this.renderSeparator(sectionID, rowID, 3)}
                                                   adjustFrame={(adjust) => {return {...adjust, left:0, top: adjust.top + (Platform.OS === 'ios' ? 25 : 0)};}}
                                                   onSelect={(index, item) => this.handleChange('universe', item.value)}
                                    />
                                </Body>
                            </Left>
                        </ListItem>
                        <ListItem noBorder style={{marginTop:10, marginRight:10}}>
                            <Left>
                                <Text style={{paddingLeft: '5%', width: '30%'}}>졸업여부</Text>
                                <Body>
                                <Button transparent onPress={() => this.handleChange('isGraduation', !this.state.isGraduation)}>
                                    <Image
                                        style={{width: 28, height: 28, marginRight:10}}
                                        resizeMode="contain"
                                        source={this.state.isGraduation ? checkedIcon : uncheckedIcon}
                                    />
                                </Button>
                                </Body>
                            </Left>
                        </ListItem>

                        <Separator style={{height: 10}}/>
                        <ListItem noBorder style={{marginTop:10, marginRight:10}}>
                            <Left>
                                <Text style={{paddingLeft: '5%', width: '30%', color:'#333333'}}>선택정보</Text>
                            </Left>
                        </ListItem>
                        <ListItem noBorder>
                            <Left>
                                <Text style={{paddingLeft: '5%', width: '25%'}}>기수</Text>
                                <Body style={{flexDirection: 'row'}}>
                                <Input style={{borderBottomWidth:1, height:22}} value={this.state.className} onChangeText={v => this.handleChange('className', v)}/>
                                </Body>
                            </Left>
                        </ListItem>
                        <ListItem noBorder>
                            <Left>
                                <Text style={{paddingLeft: '5%', width: '25%'}}>MBA과정</Text>
                                <Body style={{flexDirection: 'row'}}>
                                <Input style={{borderBottomWidth:1, height:22}} value={this.state.mbaType} onChangeText={v => this.handleChange('mbaType', v)}/>
                                </Body>
                            </Left>
                        </ListItem>
                        <ListItem noBorder>
                            <Left>
                                <Text style={{paddingLeft: '5%', width: '25%'}}>직장</Text>
                                <Body style={{flexDirection: 'row'}}>
                                <Input style={{borderBottomWidth:1, height:22}} value={this.state.company} onChangeText={v => this.handleChange('company', v)}/>
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

                        <Modal
                            isVisible={this.state.visibleModal}
                            onBackdropPress={() => this.setState({visibleModal: false})}
                        >
                            <View style={styles.modalContent}>
                                <Text style={{paddingTop:70, fontSize:16, fontWeight:'100'}}>{this.state.formErrorMessage}</Text>
                                <Body style={{alignItems: 'center', flexDirection: 'row', paddingTop: 70, paddingBottom: 40}}>
                                <Button style={{width:120, height:50, justifyContent:'center', borderRadius:0, marginLeft:5, backgroundColor: '#535acb'}} onPress={() => {
                                    this.setState({visibleModal: false})
                                }}>
                                    <Text>확인</Text>
                                </Button>
                                </Body>
                            </View>
                        </Modal>
                    </Form>
                </Content>
            </Container>
        );
    }
}

export default SignUp;
