import React from 'react';
import PropTypes from 'prop-types';
import {FlatList, RefreshControl} from 'react-native';
import {
  Body,
  Card,
  CardItem,
  Container,
  Content,
  ListItem,
  Text,
  Thumbnail,
  Icon,
  Left,
  Right,
  List, Form, Picker, View, Button
} from 'native-base';
import {Actions} from 'react-native-router-flux';
import Loading from './Loading';
import Error from './Error';
import ActionButton from 'react-native-action-button';
import moment from "moment/moment";


class ScheduleList extends React.Component {

  static propTypes = {
    error: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    recipes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    univNotice: PropTypes.arrayOf(PropTypes.shape()),
    reFetch: PropTypes.func,
  };

  static defaultProps = {
    error: null,
    reFetch: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      currentUnivId: undefined
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
  }

  render() {
    // Loading
    if (loading) return <Loading/>;
    // Error
    if (error) return <Error content={error}/>;
    const {error, loading, univScheduleList} = this.props;
    return (
      <Container>
        <Content style={{backgroundColor:'#ffffff'}}>
          <List>
            <FlatList
              numColumns={1}
              data={univScheduleList}
              renderItem={({item}) => (
                <ListItem key={item.articleId} onPress={() => this.onPress(item)} >
                  <Left>
                    <Body>
                    <Text style={{paddingTop:10}}>{item.title}</Text>
                    <Text note style={{paddingTop:10}}>{item.author} {moment(item.createDateTime).format('YY.MM.DD.')} <Text color='#4a90e2'>{'댓글 4'}</Text></Text>
                    </Body>
                    {item.urlList && item.urlList.length > 0 && <Thumbnail square source={{ uri: (item.urlList && item.fileNameList && item.urlList[0].replace(item.fileNameList[0], 'thumb_' + item.fileNameList[0])) }} />}
                  </Left>
                </ListItem>
              )}
              keyExtractor={(item, index) => index + item.toString()}
            />
          </List>
        </Content>
      </Container>
    );
  }


};


export default ScheduleList;
