import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {ActivityIndicator, Dimensions, Image, Platform, StyleSheet, TouchableOpacity} from 'react-native'
import {Body, Button, Form, Input, Item, Left, ListItem, Text, View} from 'native-base';
import {Actions} from 'react-native-router-flux';
import Loading from './Loading';
import Messages from './Messages';
import MainLogo from '../../images/logo_splash.png';
import {LinearGradient} from "expo";
import Modal from "react-native-modal";
import Colors from "../../../native-base-theme/variables/commonColor";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

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
                if (!result) {
                    return;
                }
                if (this.props.member.authWaiting) {

                    return Actions.authWaiting();
                }

                if (result) Actions.home()
            })
            .catch(e => console.log(`Error: ${e}`));
    }

    findId = () => {
        if(!this.state.name) return this.handleChange('emailFindErrorMessage', '이름을 입력해주세요');
        if(!this.state.studentNum) return this.handleChange('emailFindErrorMessage', '학번을 입력해주세요');
        if(!this.state.phone) return this.handleChange('emailFindErrorMessage', '핸드폰 번호를 입력해주세요');

        this.handleChange('requestFindEmail', true);
        this.props.findEmail(this.state);
    };
    findPassword = () => {
        if(!this.state.passwordEmail) return this.handleChange('passwordFindErrorMessage', '아이디(이메일)을 입력해주세요');

        this.handleChange('requestFindPassword', true);
        this.props.resetPassword(this.state);
    };
    clearFindEmail = () => {
        this.setState({
            ...this.state,
            visibleModal: false,
            requestFindEmail: false,
        });

        this.props.clearFindEmail();
    };
    clearFindPassword = () => {
        this.setState({
            ...this.state,
            visiblePasswordModal: false,
        });
    };

    render() {
        const {loading, error, member} = this.props;
        if (loading) return <Loading/>;
        return (
            <KeyboardAwareScrollView enableOnAndroid enableAutomaticScroll extraScrollHeight={150}
                                     keyboardShouldPersistTaps={'handled'}
            >

                <LinearGradient colors={['#394eb7', '#6965dc']} start={[0, 0]} end={[1, 1]} style={{height:this.state.screenHeight - 20}}>
                    <Form>
                    <ListItem noBorder>
                        <Body style={{alignItems: 'center'}}>
                        <Image
                            style={{width: 180, height: 260, marginTop:30}}
                            resizeMode="contain"
                            source={MainLogo}/>
                        </Body>
                    </ListItem>

                    <ListItem noBorder>
                        <Left>
                            <Text style={{paddingLeft: '13%', width: '25%', color: '#ffffff'}}>ID</Text>
                            <Body style={{paddingRight: '20%', height: 35}}>
                            <Input
                                autoCapitalize="none"
                                value={this.state.email}
                                keyboardType="email-address"
                                onChangeText={v => this.handleChange('email', v)}
                                style={{backgroundColor: '#ffffff'}}
                                placeholder={'xxx@email.com'}
                            />
                            </Body>
                        </Left>
                    </ListItem>
                    <ListItem noBorder style={{marginTop: 0, paddingTop: 0}}>
                        <Left>
                            <Text style={{paddingLeft: '13%', width: '25%', color: '#ffffff'}}>PW</Text>
                            <Body style={{paddingRight: '20%', height: 35}}>
                            <Input
                                autoCapitalize="none"
                                secureTextEntry
                                onChangeText={v => this.handleChange('password', v)}
                                style={{backgroundColor: '#ffffff'}}
                            />
                            </Body>
                        </Left>
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
                        <View style={{marginBottom: 0, paddingBottom: 0, paddingTop:20, flexDirection:'row'}}>
                            <TouchableOpacity style={{ height: 40, width:70, borderWidth:1, borderColor: '#ffffffcc', alignItems: 'center', justifyContent:'center', borderRadius:5, marginRight: 5}} onPress={Actions.terms}>
                                <Text style={{color: '#ffffff', alignItems: 'center'}}>회원가입</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ height: 40, width:70, borderWidth:1, borderColor: '#ffffffcc', alignItems: 'center', justifyContent:'center', borderRadius:5, marginLeft: 5}} onPress={this.handleSubmit}>
                                    <Text style={{color: '#ffffff', alignItems: 'center'}}>로그인</Text>
                            </TouchableOpacity>
                        </View>
                        </Body>
                    </ListItem>
                    <ListItem noBorder>
                        <Body style={{alignItems: 'center'}}>
                        <View style={{flexDirection: 'row'}}>
                            <Button transparent onPress={() => this.setState({visibleModal: true})} style={{paddingTop: 0}}>
                                <Text style={{color: '#ffffff', alignItems: 'center'}}>아이디 찾기</Text>
                            </Button>
                            <Button transparent onPress={() => this.setState({visiblePasswordModal: true})} style={{paddingTop: 0}}>
                                <Text style={{color: '#ffffff', alignItems: 'center'}}>비밀번호 찾기</Text>
                            </Button>
                        </View>
                        </Body>
                    </ListItem>
                    {/* 이메일 찾기 modal */}
                    <Modal
                        isVisible={this.state.visibleModal}
                        onBackdropPress={() => this.setState({visibleModal: false, requestFindEmail: false})}
                    >

                        {this.state.requestFindEmail && !member.findEmail &&
                            <View style={styles.idFindModal}>
                                <Left style={{paddingTop:250}}>
                                <ActivityIndicator size="large" color={Colors.brandPrimary} />
                                </Left>
                            </View>
                        }
                        {member.findEmail && member.findEmail.email &&
                        <View style={styles.idFindModal}>
                            <Left>
                                <Text style={{paddingTop: 20, fontSize: 20, fontWeight: 'bold'}}>아이디 찾기</Text>
                            </Left>
                            <Text style={{fontSize: 20, fontWeight: '200', paddingLeft: 10, paddingBottom: 15}}>해당 아이디는</Text>
                            <Text style={{fontSize: 20, fontWeight: '500', paddingLeft: 10, paddingBottom: 15}}>{member.findEmail.email}</Text>
                            <Text style={{fontSize: 20, fontWeight: '200', paddingLeft: 10, paddingBottom: 10}}>입니다.</Text>
                            <Body
                                style={{alignItems: 'center', flexDirection: 'row', paddingTop: 70, paddingBottom: 40}}>
                            <Button style={styles.confirmButton} onPress={() => {
                                this.setState({requestFindEmail: false})
                                this.clearFindEmail();
                            }}>
                                <Text>확인</Text>
                            </Button>
                            </Body>
                        </View>
                        }
                        {member.findEmail && !member.findEmail.email &&
                        <View style={styles.idFindModal}>
                            <Left>
                                <Text style={{paddingTop: 20, fontSize: 20, fontWeight: 'bold'}}>아이디 찾기</Text>
                            </Left>
                            <Text style={{fontSize: 20, fontWeight: '200', paddingLeft: 10, paddingBottom: 15}}>해당하는 아이디가 없습니다.</Text>
                            <Body
                                style={{alignItems: 'center', flexDirection: 'row', paddingTop: 70, paddingBottom: 40}}>
                            <Button style={styles.confirmButton} onPress={() => {
                                this.setState({requestFindEmail: false})
                                this.clearFindEmail();
                            }}>
                                <Text>확인</Text>
                            </Button>
                            </Body>
                        </View>
                        }

                        {!member.findEmail && !this.state.requestFindEmail &&
                            <View style={styles.idFindModal}>
                                <Left>
                                    <Text style={{paddingTop: 20, fontSize: 20, fontWeight: 'bold'}}>아이디 찾기</Text>
                                </Left>
                                <Text
                                    style={{fontSize: 20, fontWeight: '500', paddingLeft: 10, paddingBottom: 10}}>이름</Text>
                                <Item>
                                    <Input style={{fontSize: 20, padding: 0, margin: 0, height: 50}}
                                           value={this.state.name}
                                           placeholder={'이름을 입력해주세요'}
                                           onChangeText={v => this.handleChange('name', v)}
                                    />
                                </Item>
                                <Text style={{
                                    fontSize: 20,
                                    fontWeight: '500',
                                    paddingLeft: 10,
                                    paddingBottom: 10,
                                    paddingTop: 30
                                }}>학번</Text>
                                <Item>
                                    <Input style={{fontSize: 20, padding: 0, margin: 0, height: 50}}
                                           value={this.state.studentNum}
                                           placeholder={'학번을 입력해주세요'}
                                           onChangeText={v => this.handleChange('studentNum', v)}
                                    />
                                </Item>
                                <Text style={{
                                    fontSize: 20,
                                    fontWeight: '500',
                                    paddingLeft: 10,
                                    paddingBottom: 10,
                                    paddingTop: 30
                                }}>전화번호</Text>
                                <Item>
                                    <Input style={{fontSize: 20, padding: 0, margin: 0, height: 50}}
                                           value={this.state.phone}
                                           placeholder={'01012345678'}
                                           onChangeText={v => this.handleChange('phone', v)}
                                    />
                                </Item>
                                {(this.state.requestFindEmail || this.state.emailFindErrorMessage) && <Text style={{
                                    fontSize: 15,
                                    fontWeight: '300',
                                    paddingLeft: 10,
                                    paddingVertical: 10,
                                    color: '#ff0000'
                                }}>{this.state.emailFindErrorMessage || '*입력하신 정보로 ID를 찾을수 없습니다.'}</Text>}
                                <Body
                                    style={{alignItems: 'center', flexDirection: 'row', paddingTop: 70, paddingBottom: 40}}>
                                <Button style={styles.cancelButton} onPress={() => this.setState({visibleModal: false})}>
                                    <Text>취소</Text>
                                </Button>
                                <Button style={styles.confirmButton} onPress={this.findId}>
                                    <Text>다음</Text>
                                </Button>
                                </Body>
                            </View>
                        }
                    </Modal>

                    <Modal
                        isVisible={this.state.visiblePasswordModal}
                        onBackdropPress={() => this.setState({visiblePasswordModal: false, requestFindPassword:false})}
                    >

                        {!this.state.requestFindPassword &&
                        <View style={styles.idFindModal}>
                            <Left>
                                <Text style={{paddingTop: 20, fontSize: 20, fontWeight: 'bold'}}>비밀번호 찾기</Text>
                            </Left>
                            <Text
                                style={{fontSize: 20, fontWeight: '500', paddingLeft: 10, paddingBottom: 10}}>ID</Text>
                            <Item>
                                <Input style={{fontSize: 20, padding: 0, margin: 0, height: 50}}
                                       value={this.state.passwordEmail}
                                       placeholder={'이메일을 입력해주세요'}
                                       onChangeText={v => this.handleChange('passwordEmail', v)}
                                />
                            </Item>
                            {(this.state.requestFindPassword || this.state.passwordFindErrorMessage) && <Text style={{
                                fontSize: 15,
                                fontWeight: '300',
                                paddingLeft: 10,
                                paddingVertical: 10,
                                color: '#ff0000'
                            }}>{this.state.passwordFindErrorMessage || '*입력하신 정보로 ID를 찾을수 없습니다.'}</Text>}
                            <Body
                                style={{alignItems: 'center', flexDirection: 'row', paddingTop: 70, paddingBottom: 40}}>
                            <Button style={styles.cancelButton}
                                    onPress={() => this.setState({visiblePasswordModal: false})}>
                                <Text>취소</Text>
                            </Button>
                            <Button style={styles.confirmButton} onPress={this.findPassword}>
                                <Text>다음</Text>
                            </Button>
                            </Body>
                        </View>
                        }

                        {this.state.requestFindPassword &&
                        <View style={styles.idFindModal}>
                            <Left>
                                <Text style={{paddingTop: 20, fontSize: 20, fontWeight: 'bold'}}>비밀번호 찾기</Text>
                            </Left>
                            <Text style={{fontSize: 20, fontWeight: '500', paddingLeft: 10, paddingBottom: 15}}>{this.state.passwordEmail}</Text>
                            <Text style={{fontSize: 20, fontWeight: '200', paddingLeft: 10, paddingBottom: 15}}>이메일로 비밀번호 재설정 링크를 전송하였습니다.받으신 이메일의 링크를 눌러 비밀번호를 재설정하세요.</Text>
                            <Body
                                style={{alignItems: 'center', flexDirection: 'row', paddingTop: 70, paddingBottom: 40}}>
                            <Button style={styles.confirmButton} onPress={() => {
                                this.setState({requestFindPassword: false})
                                this.clearFindPassword();
                            }}>
                                <Text>확인</Text>
                            </Button>
                            </Body>
                        </View>
                        }
                    </Modal>
                    </Form>
                </LinearGradient>
            </KeyboardAwareScrollView>
        );
    }
}

const styles = StyleSheet.create({

    header: {
        padding: 20,
        backgroundColor: '#336699',
    },
    description: {
        fontSize: 14,
        color: 'white',
    },
    input: {
        margin: 20,
        marginBottom: 0,
        height: 34,
        paddingHorizontal: 10,
        borderRadius: 4,
        borderColor: '#ccc',
        borderWidth: 1,
        fontSize: 16,
    },
    legal: {
        margin: 10,
        color: '#333',
        fontSize: 12,
        textAlign: 'center',
    },
    form: {
        flex: 1,
        justifyContent: 'space-between',
    },


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
    idFindModal: {
        backgroundColor: "white",
        padding: 22,
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)",
        height: 640
    },
    exitModal: {
        backgroundColor: "white",
        padding: 22,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)",
        height:260
    },
    cancelButton: {
        width: 120,
        height: 50,
        justifyContent: 'center',
        borderRadius: 0,
        marginLeft: 5,
        backgroundColor: '#dddddd'
    },
    confirmButton: {
        width: 120,
        height: 50,
        justifyContent: 'center',
        borderRadius: 0,
        marginLeft: 5,
        backgroundColor: '#535acb'
    }
});

export default Login;
