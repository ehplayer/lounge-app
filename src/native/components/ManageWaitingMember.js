import React from 'react';
import PropTypes from 'prop-types';
import {
    Body,
    Button, CardItem,
    Container,
    Content,
    Input,
    Left,
    List,
    ListItem,
    Picker,
    Right,
    Separator,
    Text,
    Thumbnail
} from 'native-base';
import {Actions} from 'react-native-router-flux';
import Loading from './Loading';
import {Dimensions, FlatList, Image, TouchableHighlight, View, Platform} from "react-native";
import {ImagePicker, Permissions} from "expo";
import ArrowDown from '../../images/arrow_down.png';
import ModalDropDown from 'react-native-modal-dropdown';
import loungeStyle from "../constants/loungeStyle";
import ArrowLeft from '../../images/arrow_right_gray.png';
import moment from "moment/moment";

class ManageWaitingMember extends React.Component {
    static propTypes = {
        error: PropTypes.string,
        success: PropTypes.string,
        loading: PropTypes.bool.isRequired,
        member: PropTypes.shape({
            firstName: PropTypes.string,
            lastName: PropTypes.string,
            email: PropTypes.string,
        }).isRequired,
    }

    static defaultProps = {
        error: null,
        success: null,
    }

    constructor(props) {
        super(props);
        this.state = {
            member: props.member,
            currentBoardItem: props.boardItem,
            approveMemberList: [],
            rejectMemberList: [],
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

    handleSubmit = () => {
        this.props.updateBoardWaiting(this.state)
            .then(() => Actions.pop())
            .catch(e => console.log(`Error: ${e}`));
    }

    handleAuthWaiting = (index, isApprove) => {
        const currentAuthWaiting = this.state.currentBoardItem.authWaiting;
        if (isApprove) {
            const approveMemberList = this.state.approveMemberList || [];
            approveMemberList.push(currentAuthWaiting[index]);
            this.handleChange('approveMemberList', approveMemberList);
        } else {
            const rejectMemberList = this.state.rejectMemberList || [];
            rejectMemberList.push(currentAuthWaiting[index]);
            this.handleChange('rejectMemberList', rejectMemberList);
        }
        currentAuthWaiting.splice(index, 1);
        this.handleChange('authWaiting', currentAuthWaiting)
    }

    render() {
        const {loading, error, success, member, boardItem} = this.props;
        if (loading) return <Loading/>;

        return (
            <Container>
                <Content style={{backgroundColor: '#ffffff'}}>
                    <FlatList
                        data={boardItem.authWaiting}
                        ListHeaderComponent={() => <ListItem>
                            <Left>
                                <Text style={{width: '30%'}}>가입 승인 관리</Text>
                            </Left>
                        </ListItem>}
                        ListEmptyComponent={() =>
                            <ListItem noBorder style={{height: 70, justifyContent: 'center'}}>
                                <Text style={{color: '#cccccc'}}>가입대기중인 원우가 없습니다.</Text>
                            </ListItem>}
                        renderItem={({item, index}) => (
                            <ListItem avatar style={{
                                height: 70,
                                marginLeft: 10,
                                marginRight: 10,
                                borderBottomWidth: (index === boardItem.authWaiting.length - 1 ? 0 : 0.3),
                                borderBottomColor: '#dddddd'
                            }}>
                                <Left style={{borderBottomWidth: 0}}>
                                    <Thumbnail small source={{uri: item.thumb}}/>
                                </Left>
                                <Body style={{borderBottomWidth: 0, justifyContent: 'center', width: '25%'}}>
                                <Text>{item.name}</Text>
                                </Body>
                                <Right style={{borderBottomWidth: 0, width: '30%'}}>
                                    <Body>
                                    <Text note numberOfLines={1} ellipsizeMode='tail'>{item.mbaType}</Text>
                                    <Text note numberOfLines={1} ellipsizeMode='tail'>{item.company}</Text>
                                    </Body>
                                </Right>
                                <Button transparent onPress={() => this.handleAuthWaiting(index, true)}
                                        style={{
                                            borderWidth: 1,
                                            borderColor: '#cccccc',
                                            marginLeft: 5,
                                            marginTop: 10,
                                            width: 60,
                                            padding: 0,
                                            height: 35,
                                            justifyContent: 'center'
                                        }}>
                                    <Text style={{color: '#333333'}}>승인</Text>
                                </Button>
                                <Button transparent onPress={() => this.handleAuthWaiting(index, false)}
                                        style={{
                                            borderWidth: 1,
                                            borderColor: '#cccccc',
                                            marginLeft: 5,
                                            marginTop: 10,
                                            width: 60,
                                            padding: 0,
                                            height: 35,
                                            justifyContent: 'center'
                                        }}>
                                    <Text style={{color: '#333333'}}>거절</Text>
                                </Button>
                            </ListItem>
                        )}
                        keyExtractor={(item) => item.docId}
                    />

                    <Body style={{alignItems: 'center', flexDirection: 'row', marginTop: 20}}>
                    <Button style={{width: 100, justifyContent: 'center', backgroundColor: '#999999', marginRight: 5}}
                            onPress={Actions.pop}>
                        <Text>취소</Text>
                    </Button>
                    <Button style={{width: 100, justifyContent: 'center', backgroundColor: '#394eb7', marginLeft: 5}}
                            onPress={this.handleSubmit}>
                        <Text>확인</Text>
                    </Button>
                    </Body>
                </Content>
            </Container>
        );
    }
}

export default ManageWaitingMember;
