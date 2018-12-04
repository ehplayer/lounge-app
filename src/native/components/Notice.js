import React from 'react';
import PropTypes from 'prop-types';
import {FlatList, Image, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import moment from 'moment';
import {Body, Button, Card, CardItem, Container, Form, Input, Left, Right, Text, Thumbnail, View} from 'native-base';
import trashIcon from '../../images/trash.png'
import menuDotIcon from '../../images/menu_dot.png'
import Loading from "./Loading";
import Modal from "react-native-modal";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {Actions} from 'react-native-router-flux';

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
        height: 260
    },
});
const bgColorMap = {
    hall: '#4581d9',
    home: '#535acb',
    univ: '#2b66ae',
    club: '#5b8b2b',
}

class Notice extends React.Component {

    static propTypes = {
        error: PropTypes.string,
        success: PropTypes.string,
        member: PropTypes.shape({
            email: PropTypes.string,
        }).isRequired,
    }

    static defaultProps = {
        error: null,
        success: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            commentText: ''
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (name, val) => {
        this.setState({
            ...this.state,
            [name]: val,
        });
    };

    addComment = () => {
        this.props.addComment(this.props.param, this.state.commentText, this.props.member)
            .then(this.state.commentText = '');
    };
    removeComment = (item) => {
        this.props.removeComment(item, this.props.param, this.props.member);
    };

    staffDeleteArticle = (article) => {
        this.props.adminDeleteArticle(article, this.props)
            .then(() => {
                Actions.pop();
            })
            .catch(e => console.log(`Error: ${e}`));
    };
    handleJoiner = (isJoined, isJoinFinish) => {
        if (isJoinFinish) {
            return;
        }

        if (isJoined) {
            this.props.removeJoiner(this.props.param, this.props.member);
            return;
        }

        this.props.addJoiner(this.props.param, this.props.member);
    }
    render() {
        const {loading, article, member} = this.props;
        if (loading || !article || !article.author) return <Loading/>;
        const sectionType = this.props.sectionType || this.props.param.sectionType;
        const bgColor = bgColorMap[sectionType] ? bgColorMap[sectionType] : bgColorMap['univ'];
        const isJoined = article.joinerList && article.joinerList.find(item => item.docId === member.docId);
        const isJoinFinish = article.joinerList && article.joinerList.length >= article.joinMemberLimit;
        const isMyArticle = article.author.docId === member.docId;
        const myAuth = member[sectionType + 'Auth'].find(auth => auth.boardId === article.boardDocId);
        const isStaff = myAuth.authType === 'S';
        return (
            <Container>
                <KeyboardAwareScrollView
                    enableOnAndroid extraScrollHeight={250}
                                         keyboardShouldPersistTaps={'handled'}
                >

                    <Form>
                        <Card transparent style={{marginTop: 0}}>
                            <CardItem>
                                <Left>
                                    <Thumbnail source={{uri: article.author.thumb}}/>
                                    <Body>
                                    <Text>{article.author.name}</Text>
                                    <Text note>{moment(article.createDateTime).format("YYYY년 MM월 DD일 A hh:mm")}</Text>
                                    </Body>
                                    {(isMyArticle || isStaff) &&
                                    <TouchableOpacity
                                        onPress={() => {
                                            if(!isMyArticle && isStaff){
                                                return this.setState({visibleDeleteModal: true})
                                            }
                                            return Actions.updateArticle({
                                                boardType: member.universe + sectionType,
                                                article: article,
                                                sectionType: sectionType,
                                                needBackButtonText: '취소'
                                            })
                                        }
                                        }
                                    >
                                        <Image
                                            style={{width: 20, height: 20, marginLeft: 60, marginBottom: 5}}
                                            resizeMode="contain"
                                            source={menuDotIcon}
                                        />
                                    </TouchableOpacity>
                                    }
                                </Left>
                            </CardItem>
                            <CardItem>
                                <Body>
                                <Text style={{fontSize: 25}}>{article.title}</Text>
                                </Body>
                            </CardItem>
                            <CardItem style={{paddingBottom: 10}}>
                                <Body>
                                <Text>{article.content}</Text>
                                </Body>
                            </CardItem>
                            {article.isSchedule &&
                            <CardItem style={{paddingBottom: 0, height: 60}}>
                                <Body style={{
                                    paddingTop: 15,
                                    borderWidth: 1,
                                    flexDirection: 'row',
                                    borderBottomWidth: 0.5,
                                    borderColor: '#cccccc',
                                    justifyContent: 'center'
                                }}>
                                <Text>{article.startDatetime}</Text>
                                <Text style={{paddingHorizontal: 10}}>~</Text>
                                <Text>{article.endDatetime}</Text>
                                </Body>
                            </CardItem>
                            }
                            {article.isSchedule &&
                            <CardItem style={{paddingTop: 0, paddingBottom: 0, height: 50}}>
                                <Body style={{
                                    paddingTop: 15,
                                    marginTop: 0,
                                    borderWidth: 1,
                                    flexDirection: 'row',
                                    borderTopWidth: 0.5,
                                    borderBottomWidth: 0.5,
                                    borderColor: '#cccccc',
                                    paddingLeft: '7%'
                                }}>
                                <Text style={{paddingRight: 15}}>장소</Text>
                                <Text note>{article.place}</Text>
                                </Body>
                            </CardItem>
                            }
                            {article.isSchedule &&
                            <CardItem style={{marginBottom: 0, paddingTop: 0, height: 50}}>
                                <Left style={{
                                    width: '50%',
                                    paddingTop: 0,
                                    marginTop: 0,
                                    borderWidth: 1,
                                    flexDirection: 'row',
                                    borderTopWidth: 0.5,
                                    borderColor: '#cccccc'
                                }}>
                                    <Button transparent style={{height: 40, justifyContent: 'center', width: '100%'}}
                                            onPress={() => Actions.joinUserList({
                                                document: article,
                                                sectionType: sectionType
                                            })}>
                                        <Text style={{paddingRight: 15, color: bgColor}}><Text
                                            style={{fontSize: 15, color: bgColor}}>참석</Text> <Text
                                            style={{color: bgColor}}>{article.joinerList ? article.joinerList.length : 0}</Text>
                                            <Text style={{color: bgColor}}>{'>'}</Text></Text>
                                    </Button>
                                </Left>
                                <Left style={{
                                    width: '50%',
                                    paddingTop: 0,
                                    marginTop: 0,
                                    borderWidth: 1,
                                    flexDirection: 'row',
                                    borderTopWidth: 0.5,
                                    borderColor: '#cccccc'
                                }}>
                                    <Button transparent style={{
                                        height: 40,
                                        justifyContent: 'center',
                                        backgroundColor: isJoinFinish && article.isLimitMember ? '#cccccc' : bgColor,
                                        width: '100%',
                                        borderRadius: 0
                                    }}
                                            onPress={() => this.handleJoiner(isJoined, isJoinFinish)}>
                                        <Text style={{
                                            fontSize: 15,
                                            paddingRight: 15,
                                            color: '#ffffff'
                                        }}>{isJoinFinish && article.isLimitMember ? '마감' : isJoined ? '참석취소' : '참석하기'}</Text>
                                    </Button>
                                </Left>
                            </CardItem>
                            }
                            {article.isSchedule &&
                            <CardItem style={{marginTop:0,paddingTop: 0, height: 50}}>
                                <Left style={{
                                    width: '50%',
                                    paddingTop: 0,
                                    marginTop: 0,
                                    flexDirection: 'row',
                                    borderColor: '#cccccc'
                                }}>
                                    {article.isLimitMember &&
                                    <Text style={{paddingRight: 15, color: '#d9534f'}}>* {article.joinMemberLimit}명까지 참석 가능합니다.</Text>
                                    }
                                </Left>
                            </CardItem>
                            }
                            {(article.urlList && article.urlList[0]) &&
                            <CardItem cardBody style={{paddingBottom: 10}}>
                                <Image resizeMode={'contain'} source={{uri: article.urlList[0]}}
                                       style={{height: 300, flex: 1}}/>
                            </CardItem>
                            }
                            {(article.urlList && article.urlList[1]) &&
                            <CardItem cardBody style={{paddingBottom: 10}}>
                                <Image resizeMode={'contain'} source={{uri: article.urlList[1]}}
                                       style={{height: 300, flex: 1}}/>
                            </CardItem>
                            }
                            {(article.urlList && article.urlList[2]) &&
                            <CardItem cardBody style={{paddingBottom: 10}}>
                                <Image resizeMode={'contain'} source={{uri: article.urlList[2]}}
                                       style={{height: 300, flex: 1}}/>
                            </CardItem>
                            }
                            {(article.urlList && article.urlList[3]) &&
                            <CardItem cardBody style={{paddingBottom: 10}}>
                                <Image resizeMode={'contain'} source={{uri: article.urlList[3]}}
                                       style={{height: 300, flex: 1}}/>
                            </CardItem>
                            }
                            {(article.urlList && article.urlList[4]) &&
                            <CardItem cardBody style={{paddingBottom: 40}}>
                                <Image resizeMode={'contain'} source={{uri: article.urlList[4]}}
                                       style={{height: 300, flex: 1}}/>
                            </CardItem>
                            }

                        </Card>
                        <Card transparent>
                            <FlatList
                                numColumns={1}
                                data={article.comment}
                                renderItem={({item, index}) => (
                                    <CardItem style={{
                                        borderTopWidth: (index === 0 ? 0 : 0.5),
                                        borderColor: '#eeeeee',
                                        height: 70
                                    }}>
                                        <Left>
                                            <Thumbnail small size={20} source={{uri: item.thumb}}/>
                                            <Body>
                                            <Text style={{paddingBottom: 5}}>{item.name}</Text>
                                            <Text>{item.commentText}</Text>
                                            </Body>
                                        </Left>
                                        <Right>
                                            <TouchableOpacity onPress={() => {
                                                this.setState({visibleModal: true, removeItem: item});
                                            }}>
                                                <Text note
                                                      style={{paddingBottom: 5}}>{moment(item.createDateTime).format("MM/DD HH:mm")}</Text>
                                                {item.docId === member.docId &&
                                                <Image
                                                    style={{width: 15, height: 15, marginLeft: 60}}
                                                    resizeMode="contain"
                                                    source={trashIcon}
                                                />
                                                }
                                            </TouchableOpacity>
                                        </Right>
                                    </CardItem>
                                )}
                                keyExtractor={(item, index) => index + item.toString()}
                            />
                            <Modal
                                isVisible={this.state.visibleModal}
                                onBackdropPress={() => this.setState({visibleModal: false})}
                            >
                                <View style={styles.modalContent}>
                                    <Text style={{paddingTop: 70, fontSize: 16, fontWeight: '100'}}>댓글을 삭제하시겠습니까?</Text>
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
                                    }} onPress={() => this.setState({visibleModal: false})}>
                                        <Text>취소</Text>
                                    </Button>
                                    <Button style={{
                                        width: 120,
                                        height: 50,
                                        justifyContent: 'center',
                                        borderRadius: 0,
                                        marginLeft: 5,
                                        backgroundColor: bgColor
                                    }} onPress={() => {
                                        this.removeComment(this.state.removeItem);
                                        this.setState({visibleModal: false})
                                    }}>
                                        <Text>확인</Text>
                                    </Button>
                                    </Body>
                                </View>
                            </Modal>
                            <Modal
                                isVisible={this.state.visibleDeleteModal}
                                onBackdropPress={() => this.setState({visibleDeleteModal: false})}
                            >
                                <View style={styles.modalContent}>
                                    <Text style={{paddingTop: 70, fontSize: 16, fontWeight: '100'}}>현재글을 삭제하시겠습니까?</Text>
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
                                    }} onPress={() => this.setState({visibleDeleteModal: false})}>
                                        <Text>취소</Text>
                                    </Button>
                                    <Button style={{
                                        width: 120,
                                        height: 50,
                                        justifyContent: 'center',
                                        borderRadius: 0,
                                        marginLeft: 5,
                                        backgroundColor: bgColor
                                    }} onPress={() => {
                                        this.staffDeleteArticle(article);
                                        this.setState({visibleDeleteModal: false})
                                    }}>
                                        <Text>확인</Text>
                                    </Button>
                                    </Body>
                                </View>
                            </Modal>
                            <CardItem style={{borderTopWidth: 1, borderColor: '#dddddd', height: 50, paddingRight: 0}}>
                                <Left>
                                    <TextInput placeholder='댓글을 남겨보세요'
                                               underlineColorAndroid={'#ffffff'}
                                           onChangeText={v => this.handleChange('commentText', v)}
                                           value={this.state.commentText}
                                           style={{borderWidth:0,width:300, height:50}}
                                    />
                                </Left>
                                <Right style={{marginRight: 0}}>
                                    <Button onPress={this.addComment} style={{
                                        backgroundColor: bgColor,
                                        borderRadius: null,
                                        height: 50
                                    }}><Text>등록</Text></Button>
                                </Right>
                            </CardItem>
                        </Card>
                    </Form>
                </KeyboardAwareScrollView>
            </Container>
        );
    }
}

export default Notice;
