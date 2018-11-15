import React from 'react';
import PropTypes from 'prop-types';
import {Image, StyleSheet} from 'react-native';
import {Body, Button, Container, Content, Left, Right, Text} from 'native-base';
import checkedIcon from '../../images/checkO.png'
import uncheckedIcon from '../../images/checkX.png'
import {Actions} from 'react-native-router-flux';

class Terms extends React.Component {

    static propTypes = {
        error: PropTypes.string,
        success: PropTypes.string,
    };

    static defaultProps = {
        error: null,
        success: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            checkedTermsService: false,
            checkedTermsUser: false,
            checkedNotification: false,
            checkedAll: false,
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (name, val) => {
        if (val == false) {
            this.state.checkedAll = false;
        }
        this.setState({
            ...this.state,
            [name]: val,
        });
    };
    handleChangeAll = () => {
        if (this.state.checkedTermsService &&
            this.state.checkedTermsUser &&
            this.state.checkedNotification &&
            this.state.checkedAll
        ) {
            this.setState({
                ...this.state,
                checkedTermsService: false,
                checkedTermsUser: false,
                checkedNotification: false,
                checkedAll: false,
            });
            return;
        }

        this.setState({
            ...this.state,
            checkedTermsService: true,
            checkedTermsUser: true,
            checkedNotification: true,
            checkedAll: true,
        });
    };

    render() {
        const isApprove = this.state.checkedTermsService && this.state.checkedTermsUser;
        return (
            <Container>
                <Content style={{backgroundColor: '#ffffff'}}>
                    <Right style={{marginTop: 0, marginLeft: '50%'}}>
                        <Button transparent style={{marginLeft: '10%'}} onPress={this.handleChangeAll}>
                            <Body style={{height: 45, width: '100%', flexDirection: 'row',}}>
                            <Text style={{marginRight: 10, color: '#4a4a4a'}}>전체 약관에 동의</Text>
                            <Image
                                style={{width: 28, height: 28, marginRight: '10%'}}
                                resizeMode="contain"
                                source={this.state.checkedAll ? checkedIcon : uncheckedIcon}
                            />
                            </Body>
                        </Button>
                    </Right>
                    <Left style={{borderBottomWidth: 0, width: '100%', borderColor: '#cccccc', flexDirection: 'row'}}>
                        <Text style={{fontSize: 18, height: 35, marginLeft: 15, paddingBottom: 0, color: '#4a4a4a'}}>서비스 이용약관</Text>
                        <Button transparent style={styles.linkButton} onPress={Actions.termsService}>
                            <Text style={styles.linkButtonText}>보기</Text>
                        </Button>
                    </Left>
                    <Button transparent style={{marginLeft: '10%'}}
                            onPress={() => this.handleChange('checkedTermsService', !this.state.checkedTermsService)}>
                        <Image
                            style={{width: 28, height: 28}}
                            resizeMode="contain"
                            source={this.state.checkedTermsService ? checkedIcon : uncheckedIcon}
                        />
                        <Text style={{marginRight: 40, color: '#4a4a4a', fontSize: 13}}>서비스 이용약관에 동의합니다.(필수)</Text>
                    </Button>

                    <Left style={{borderBottomWidth: 0, width: '100%', borderColor: '#cccccc', marginTop: 20, flexDirection: 'row'}}>
                        <Text style={{fontSize: 18, height: 35, marginLeft: 15, paddingBottom: 0, color: '#4a4a4a'}}>개인정보 제공 및 이용</Text>
                        <Button transparent style={styles.linkButton} onPress={Actions.termsUser}>
                            <Text style={styles.linkButtonText}>보기</Text>
                        </Button>
                    </Left>
                    <Button transparent style={{marginLeft: '10%'}}
                            onPress={() => this.handleChange('checkedTermsUser', !this.state.checkedTermsUser)}>
                        <Image
                            style={{width: 28, height: 28}}
                            resizeMode="contain"
                            source={this.state.checkedTermsUser ? checkedIcon : uncheckedIcon}
                        />
                        <Text style={{color: '#4a4a4a', fontSize: 13}}>개인정보 수집 및 이용에 동의합니다.(필수)</Text>
                    </Button>
                    <Button transparent style={{marginLeft: '10%'}}
                            onPress={() => this.handleChange('checkedNotification', !this.state.checkedNotification)}>
                        <Image
                            style={{width: 28, height: 28}}
                            resizeMode="contain"
                            source={this.state.checkedNotification ? checkedIcon : uncheckedIcon}
                        />
                        <Text style={{color: '#4a4a4a', fontSize: 13}}>공지 알림에 동의합니다. (선택)</Text>
                    </Button>
                    <Left transparent style={{marginLeft: '15%'}}>
                        <Text style={{marginLeft: 28, color: '#4a4a4a', fontSize: 13}}>* 각종 공지, 이벤트 등의 알림 메시지를</Text>
                        <Text style={{marginLeft: 28, color: '#4a4a4a', fontSize: 13}}>실시간으로 받을 수 있습니다.</Text>
                        <Text style={{marginLeft: 28, color: '#4a4a4a', fontSize: 13}}>언제든지 APP의 설정 > 알림설정에서
                            설정변경가능합니다.</Text>
                    </Left>
                    <Body style={{alignItems: 'center', flexDirection: 'row', paddingTop: 40, paddingBottom: 40}}>
                    <Button style={{
                        width: 100,
                        justifyContent: 'center',
                        borderRadius: 0,
                        marginRight: 5,
                        backgroundColor: '#cccccc'
                    }} onPress={Actions.pop}>
                        <Text>취소</Text>
                    </Button>
                    <Button disabled={!isApprove}
                            style={{
                                width: 100,
                                justifyContent: 'center',
                                borderRadius: 0,
                                marginLeft: 5,
                                backgroundColor: (isApprove ? '#394eb7' : '#888888')
                            }}
                            onPress={() => Actions.signUp({
                                param: {
                                    checkedNotification: this.state.checkedNotification,
                                    checkedTermsService: this.state.checkedTermsService,
                                    checkedTermsUser: this.state.checkedTermsUser,
                                }
                            })}>
                        <Text>확인</Text>
                    </Button>
                    </Body>
                </Content>
            </Container>
        );
    }
}
const styles = StyleSheet.create({
    textHeader:{
        fontWeight:'bold', fontSize:15, marginBottom:10, marginTop:10
    },
    linkButton:{
        marginLeft:15,
        height: 25,
        backgroundColor: '#ffffff',
        borderColor: '#6965dc',
        borderWidth: 1,
        borderRadius: 15,
        paddingTop:2,
    },
    linkButtonText:{
        fontSize: 14,
        color: '#6965dc',
        paddingLeft: 5,
        paddingRight: 5,
        fontWeight: '500'
    }
});

export default Terms;
