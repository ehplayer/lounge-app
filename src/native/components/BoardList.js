import React from 'react';
import PropTypes from 'prop-types';
import {FlatList, StyleSheet, View} from 'react-native';
import {
    Body,
    Button,
    Card,
    CardItem,
    Container,
    Content,
    Left,
    ListItem,
    Right,
    Separator,
    Text,
    Thumbnail
} from 'native-base';
import {Actions} from 'react-native-router-flux';
import Loading from './Loading';
import Modal from "react-native-modal";

const styles = StyleSheet.create({
    joinedButton: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#000000',
        marginTop: 10,
        width: 80,
        padding: 0,
        height: 35,
        justifyContent: 'center'
    },
    waitingButton: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#cccccc',
        marginTop: 10,
        width: 80,
        padding: 0,
        height: 35,
        justifyContent: 'center'
    },
    joiningButton: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#394eb7',
        marginTop: 10,
        width: 80,
        padding: 0,
        height: 35,
        justifyContent: 'center'
    },
    exitModal: {
        backgroundColor: "white",
        padding: 22,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)",
        height: 260
    },
});

class BoardListComponent extends React.Component {

    static propTypes = {
        error: PropTypes.object,
        loading: PropTypes.bool,
        reFetch: PropTypes.func,
    };

    static defaultProps = {
        error: null,
        reFetch: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            currentUnivId: undefined,
            modalMessage: ''
        };
    }

    static keyExtractor = item => String(item.toString());
    onPress = item => Actions.notice({match: {item: item}});

    handleChange = (currentUnivId, val) => {
        this.setState({
            ...this.state,
            currentUnivId: currentUnivId,
        });
        this.props.reFetch(currentUnivId);
    };

    isJoined(item, authType) {
        let isJoined = false;
        this.props.member[authType].forEach(auth => {
            if (auth.boardId === item.docId) {
                isJoined = true;
            }
        })
        return isJoined;
    }

    isJoinWaiting(item, authType) {
        let isJoined = false;
        const authWaitingList = this.props.member[authType + 'Waiting'];
        if (!authWaitingList || authWaitingList.length === 0) {
            return false;
        }

        authWaitingList.forEach(boardId => {
            if (boardId === item.docId) {
                isJoined = true;
            }
        })
        return isJoined;
    }

    join = (sectionType, boardItem) => {
        this.setState({
            ...this.state,
            visibleModal: true,
            isJoinConfirm: true,
            currentSectionType: sectionType,
            boardItem: boardItem,
            modalMessage: '정말 가입하시겠습니까?'
        });
    }

    out = (sectionType, boardItem) => {
        this.setState({
            ...this.state,
            visibleModal: true,
            isJoinConfirm: false,
            currentSectionType: sectionType,
            boardItem: boardItem,
            modalMessage: '정말 탈퇴하시겠습니까?'
        });
    }
    submit = () => {
        this.setState({
            ...this.state,
            visibleModal: false,
        });
        return this.state.isJoinConfirm ? this.props.applyBoard(this.state.currentSectionType, this.state.boardItem, this.props.member)
            : this.props.outBoard(this.state.currentSectionType, this.state.boardItem, this.props.member);
    }
    renderEmptyComponent = () => <ListItem noBorder style={{height: 70, justifyContent: 'center'}}><Text
        style={{color: '#cccccc'}}>검색결과가 없습니다.</Text></ListItem>;
    renderTitleComponent = (title) => <ListItem style={{height: 50, marginLeft: 0, marginRight: 0}}><Text
        style={{width: '95%'}}>{title}</Text></ListItem>
    renderItemComponent = (item, index, length, sectionType) => {
        if(item.isAdmin){
            return;
        }
        return (
            <ListItem avatar style={{
                height: 70,
                marginLeft: 0,
                marginRight: 0,
                borderBottomWidth: (index === length - 1 ? 0 : 0.3),
                borderBottomColor: '#cccccc'
            }}>
                <Left style={{borderBottomWidth: 0}}>
                    {item.thumb && item.thumb !== '#' ?
                        <Thumbnail source={{uri: item.thumb}}
                                   style={{width: 44, height: 44, borderRadius: 22}}/>
                        :
                        <Button style={{
                            width: 44,
                            height: 44,
                            borderRadius: 40,
                            backgroundColor: '#cccccc'
                        }}/>
                    }
                </Left>
                <Body style={{borderBottomWidth: 0, justifyContent: 'center', width: '50%'}}>
                <Text>{item.name}</Text>
                </Body>
                <Right style={{borderBottomWidth: 0, width: 100, margin: 0, padding: 0}}>
                    <Body style={{padding: 0, margin: 0}}>
                    {this.isJoined(item, sectionType + 'Auth')
                        ? <Button transparent onPress={() => this.out(sectionType, item)}
                                  style={styles.joinedButton}><Text
                            style={{color: '#333333', fontWeight: '200'}}>탈퇴</Text></Button>
                        : this.isJoinWaiting(item, sectionType) ?
                            <Button transparent disabled style={styles.waitingButton}><Text
                                style={{color: '#333333', fontWeight: '200'}}>대기중</Text></Button>
                            : <Button transparent onPress={() => this.join(sectionType, item)}
                                      style={styles.joiningButton}><Text
                                style={{color: '#394eb7', fontWeight: '200'}}>가입</Text></Button>}
                    </Body>
                </Right>
            </ListItem>
        );
    }

    render() {
        const {loading, member, universeBoardList, clubBoardList} = this.props;
        if (loading) return <Loading/>;
        return (
            <Container>
                <Content style={{backgroundColor: '#ffffff'}}>
                    <Card transparent style={{marginBottom:0, borderTopWidth:0, marginTop: 0}}>
                        <CardItem style={{marginTop:0, borderTopWidth:0, margin: 0, padding: 0}}>
                            <FlatList
                                data={universeBoardList}
                                ListHeaderComponent={() => this.renderTitleComponent('Univ. 목록')}
                                ListEmptyComponent={this.renderEmptyComponent}
                                renderItem={({item, index}) => this.renderItemComponent(item, index, universeBoardList.length, 'univ')}
                                keyExtractor={(item) => item.docId}
                            />
                        </CardItem>
                    </Card>
                    <Separator style={{height: 10}}/>
                    <Card transparent style={{marginBottom:0,borderTopWidth:0, marginTop: 0}}>
                        <CardItem style={{margin: 0, padding: 0}}>
                            <FlatList
                                data={clubBoardList}
                                ListHeaderComponent={() => this.renderTitleComponent('CLUB 목록')}
                                ListEmptyComponent={this.renderEmptyComponent}
                                renderItem={({item, index}) => this.renderItemComponent(item, index, clubBoardList.length, 'club')}
                                keyExtractor={(item) => item.docId}
                            />
                        </CardItem>
                    </Card>
                    <Modal
                        isVisible={this.state.visibleModal}
                        onBackdropPress={() => this.setState({visibleModal: false})}
                    >
                        <View style={styles.exitModal}>
                            <Text style={{
                                paddingTop: 70,
                                fontSize: 16,
                                fontWeight: '100'
                            }}>{this.state.modalMessage}</Text>
                            <Body
                                style={{alignItems: 'center', flexDirection: 'row', paddingTop: 70, paddingBottom: 40}}>
                            <Button style={{
                                width: 120,
                                height: 50,
                                justifyContent: 'center',
                                borderRadius: 0,
                                marginRight: 5,
                                backgroundColor: '#dddddd'
                            }} onPress={() => this.setState({visibleModal: false})}>
                                <Text>취소</Text>
                            </Button>
                            <Button style={{
                                width: 120,
                                height: 50,
                                justifyContent: 'center',
                                borderRadius: 0,
                                marginLeft: 5,
                                backgroundColor: '#535acb'
                            }} onPress={this.submit}>
                                <Text>확인</Text>
                            </Button>
                            </Body>
                        </View>
                    </Modal>
                </Content>
            </Container>
        );
    }


};


export default BoardListComponent;
