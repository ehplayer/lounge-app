import React from 'react';
import PropTypes from 'prop-types';
import {
    Body,
    Card,
    CardItem,
    Container,
    Content,
    List,
    ListItem,
    Text,
    Left,
    Thumbnail,
    Button, Right, Separator
} from 'native-base';
import {Actions} from 'react-native-router-flux';
import moment from "moment/moment";
import {BackHandler, DeviceEventEmitter, FlatList, Image, Platform, RefreshControl, View} from "react-native";
import Loading from "./Loading";
import Error from "./Error";
import ArrowLeft from '../../images/arrow_right_gray.png';
import loungeStyle from "../constants/loungeStyle";
import Modal from "react-native-modal";


class HomeComponent extends React.Component {

    static propTypes = {
        member: PropTypes.shape({}),
    };

    static defaultProps = {
        member: {},
    };

    constructor(props) {
        super(props);
        this.backPressSubscriptions = new Set();
        this.state = {
            visibleExitModal: false,
            currentUnivId: undefined
        };
    }

    static keyExtractor = item => String(item.toString());
    componentDidMount() {
        if (Platform.OS === 'android') {
            // there is a bug/workaround on android https://github.com/facebook/react-native/issues/3223#issuecomment-355064410
            DeviceEventEmitter.removeAllListeners('hardwareBackPress');
            DeviceEventEmitter.addListener('hardwareBackPress', () => {
                let invokeDefault = true;
                const subscriptions = [];

                this.backPressSubscriptions.forEach(sub => subscriptions.push(sub));

                for (let i = 0; i < subscriptions.reverse().length; i += 1) {
                    if (subscriptions[i]()) {
                        invokeDefault = false;
                        break;
                    }
                }

                if (invokeDefault) {
                    BackHandler.exitApp();
                }
            });

            this.backPressSubscriptions.add(this.handleHardwareBack);
        }
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            DeviceEventEmitter.removeAllListeners('hardwareBackPress');
            this.backPressSubscriptions.clear();
        }

    }

    handleHardwareBack = (e) => {
        if (Actions.currentScene === 'login' ||
            Actions.currentScene === '_home' ||
            Actions.currentScene === '_hall' ||
            Actions.currentScene === '_univ' ||
            Actions.currentScene === '_club') {

            this.setState({
                ...this.state,
                visibleExitModal: !this.state.visibleExitModal,
            });
        } else {
            Actions.pop();
        }

        return true;
    };
    exitApp = () => {
        this.setState({
            ...this.state,
            visibleExitModal: false,
        });
        BackHandler.exitApp();
    }

    openArticle = (item) => {
        return Actions.notice({
            title: item.boardName,
            param: {
                sectionType: item.sectionType,
                universe: this.props.member.universe,
                currentUnivId: item.currentUnivId,
                boardType: 'notice',
                docId: item.docId
            }
        })
    };

    onRefresh = () => {
        this.props.reFetch(this.props.member);
    }

    sectionColorMap = loungeStyle.bgColorMap;

    sectionTextMap = {
        hall: 'Hall',
        univ: 'Univ.',
        club: 'Club'
    };

    render() {
        const {error, loading, home, member} = this.props;
        const noticeList = home.noticeList ? (home.noticeList.length > 5 ? home.noticeList.slice(0, 5) : home.noticeList) : [];
        const scheduleList = home.scheduleList ? (home.scheduleList.length > 5 ? home.scheduleList.slice(0, 5) : home.scheduleList) : [];
        const now = moment().format("MM.DD");
        if (loading) return <Loading/>;
        if (error) return <Error content={error}/>;

        return (
            <Container>
                <FlatList
                    numColumns={1}
                    data={scheduleList}
                    ListHeaderComponent={
                        <Card transparent style={{marginLeft:0, marginRight:0, marginTop:0, borderTopWidth:0, marginBottom: 0}}>
                            <CardItem style={{paddingBottom: 0}}>
                                <Body>
                                <List>
                                    <ListItem noBorder={noticeList.length === 0} style={loungeStyle.listHeaderListItem}
                                              onPress={item => Actions.homeNoticeList({title: '공지사항'})}>
                                        <Text style={loungeStyle.listHeaderListItem_Text}
                                              onPress={item => Actions.homeNoticeList({title: '공지사항'})}>공지사항</Text>
                                        <Image
                                            style={loungeStyle.listHeaderListItem_Image}
                                            resizeMode="contain"
                                            source={ArrowLeft}/>
                                    </ListItem>
                                    <FlatList
                                        numColumns={1}
                                        data={noticeList}
                                        renderItem={({item, index}) => (
                                            <ListItem noBorder={index === noticeList.length - 1} key={item.articleId}
                                                      onPress={() => this.openArticle(item)}
                                                      style={{height: 50, paddingLeft: 0, marginLeft: 10}}>
                                                <Text style={{
                                                    color: this.sectionColorMap[item.sectionType],
                                                    width: '13%'
                                                }}>{this.sectionTextMap[item.sectionType]}</Text>
                                                <Left>
                                                    <Body><Text numberOfLines={1} style={{
                                                        fontWeight: 'normal',
                                                        color: '#555555'
                                                    }}>{item.title}</Text></Body>
                                                </Left>
                                                <Right><Text
                                                    note>{moment(item.createDateTime).format("MM.DD") === now ? '오늘' : moment(item.createDateTime).format("MM.DD")}</Text></Right>
                                            </ListItem>
                                        )}
                                        keyExtractor={(item, index) => index + item.toString()}
                                    />
                                </List>
                                </Body>
                            </CardItem>
                            <Separator style={{height: 5, backgroundColor: '#f2f4f7'}}/>
                            <CardItem style={{paddingBottom: 0}}>
                                <Body>
                                <List>
                                    <ListItem noBorder
                                              style={loungeStyle.listHeaderListItem}
                                              onPress={item => Actions.homeScheduleList({title: '일정'})}>
                                        <Text style={loungeStyle.listHeaderListItem_Text}>일정</Text>
                                        <Image
                                            style={loungeStyle.listHeaderListItem_Image}
                                            resizeMode="contain"
                                            source={ArrowLeft}/>
                                    </ListItem>

                                </List>
                                </Body>
                            </CardItem>
                        </Card>
                    }
                    renderItem={({item, index}) => (
                        <ListItem noBorder style={{
                            height: 70,
                            paddingLeft: 20,
                            paddingRight: 30,
                            marginLeft: 0,
                            backgroundColor: '#ffffff'
                        }} onPress={() => this.openArticle(item)}>
                            <Text style={{
                                fontSize: 14,
                                color: '#6D41DD',
                                paddingLeft: 5,
                                paddingRight: 5,
                                fontWeight: 'normal',
                                width: 60
                            }}>
                                {moment(item.startDatetimeLong).format("MM / DD")}
                            </Text>
                            <Left>
                                <Body style={{marginTop: 5}}>
                                <Text style={{
                                    fontSize: 15,
                                    fontWeight: 'normal',
                                    color: '#000000'
                                }}>{item.boardName}</Text>
                                <Text style={{marginTop: 3, color: '#4a4a4a'}}>{item.title}</Text>
                                </Body>
                                <Thumbnail small source={{uri: item.boardThumb}}/>
                            </Left>
                        </ListItem>
                    )}
                    keyExtractor={(item, index) => index + item.toString()}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={this.onRefresh}
                        />
                    }
                />
                <Modal
                    isVisible={this.state.visibleExitModal}
                    onBackdropPress={() => this.setState({visibleExitModal: false})}
                >
                    <View style={loungeStyle.exitModal}>
                        <Text style={{paddingTop: 70, fontSize: 16, fontWeight: '100'}}>앱을 종료하시겠습니까?</Text>
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
                        }} onPress={() => this.setState({visibleExitModal: false})}>
                            <Text>취소</Text>
                        </Button>
                        <Button style={{
                            width: 120,
                            height: 50,
                            justifyContent: 'center',
                            borderRadius: 0,
                            marginLeft: 5,
                            backgroundColor: '#535acb'
                        }} onPress={this.exitApp}>
                            <Text>확인</Text>
                        </Button>
                        </Body>
                    </View>
                </Modal>
            </Container>);
    }
}


export default HomeComponent;
