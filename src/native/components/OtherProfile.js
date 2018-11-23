import React from 'react';
import PropTypes from 'prop-types';
import {Body, Container, Content, Form, Left, ListItem, Text, Thumbnail} from 'native-base';
import {Actions} from 'react-native-router-flux';

import Loading from './Loading';

class OtherProfileComponent extends React.Component {
    static propTypes = {
        error: PropTypes.string,
        success: PropTypes.string,
        loading: PropTypes.bool,
        member: PropTypes.shape({
            name: PropTypes.string,
            email: PropTypes.string,
            thumb: PropTypes.string,
            mbaType: PropTypes.string,
            isSingle: PropTypes.boolean,
            isProfileOpen: PropTypes.boolean,
        }),
    };
    static defaultProps = {
        error: null,
        success: null,
    };

    componentWillReceiveProps(nextProps) {
        if (!nextProps.member.name) {
            Actions.login();
        }
    }

    render() {
        const {loading, member} = this.props;
        // Loading
        if (loading) return <Loading/>;
        const user = member.user || {};
        return (
            <Container>
                <Content style={{backgroundColor: '#ffffff'}}>
                    <ListItem>
                        <Body style={{alignItems: 'center'}}>
                        <Thumbnail large source={{uri: user && user.thumb}}/>
                        <Text style={{fontSize: 20, paddingTop: 10}}>{user.name}</Text>
                        </Body>
                    </ListItem>
                    <Form>
                        <ListItem noBorder>
                            <Left style={{alignItems: 'center'}}>
                                <Text style={{paddingLeft: '5%', width: '25%'}}>ID</Text>
                                <Body style={{flexDirection: 'row'}}>
                                <Text>{user.email}</Text>
                                </Body>
                            </Left>
                        </ListItem>

                        {user.isProfileOpen &&
                        <ListItem noBorder>
                            <Left>
                                <Text style={{paddingLeft: '5%', width: '25%'}}>핸드폰</Text>
                                <Body style={{flexDirection: 'row'}}>
                                <Text>{user.phone && user.phone.slice(0, 3) + ' - '}</Text>
                                <Text>{user.phone && user.phone.slice(3, 7) + ' - '}</Text>
                                <Text>{user.phone && user.phone.slice(7, 11)}</Text>
                                </Body>
                            </Left>
                        </ListItem>
                        } {user.isProfileOpen &&
                        <ListItem noBorder>
                            <Left>
                                <Text style={{paddingLeft: '5%', width: '25%'}}>학번</Text>
                                <Body style={{flexDirection: 'row'}}>
                                <Text>{user.studentNum}</Text>
                                </Body>
                            </Left>
                        </ListItem>
                        }{user.isProfileOpen &&
                        <ListItem noBorder>
                            <Left>
                                <Text style={{paddingLeft: '5%', width: '25%'}}>기수</Text>
                                <Body style={{flexDirection: 'row'}}>
                                <Text>{user.className}</Text>
                                </Body>
                            </Left>
                        </ListItem>
                        }{user.isProfileOpen &&
                        <ListItem noBorder>
                            <Left>
                                <Text style={{paddingLeft: '5%', width: '25%'}}>MBA과정</Text>
                                <Body style={{flexDirection: 'row'}}>
                                <Text>{user.mbaType}</Text>
                                </Body>
                            </Left>
                        </ListItem>
                        }{user.isProfileOpen &&
                        <ListItem noBorder>
                            <Left>
                                <Text style={{paddingLeft: '5%', width: '25%'}}>직장</Text>
                                <Body style={{flexDirection: 'row'}}>
                                <Text>{user.company}</Text>
                                </Body>
                            </Left>
                        </ListItem>
                        }
                    </Form>
                </Content>
            </Container>
        );
    }
}

export default OtherProfileComponent;
