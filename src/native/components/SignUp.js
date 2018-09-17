import React from 'react';
import PropTypes from 'prop-types';
import { Container, Content, Text, Form, Item, Label, Input, Button } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Loading from './Loading';
import Messages from './Messages';
import Header from './Header';
import Spacer from './Spacer';

class SignUp extends React.Component {
  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    onFormSubmit: PropTypes.func.isRequired,
  }

  static defaultProps = {
    error: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      school:'',
      name: '',
      email: '',
      password: '',
      password2: '',
      phone: '',
      studentNum: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (name, val) => {
    this.setState({
      ...this.state,
      [name]: val,
    });
  }

  handleSubmit = () => {
    this.props.onFormSubmit(this.state)
      .then(() => Actions.login())
      .catch(e => console.log(`Error: ${e}`));
  }

  render() {
    const { loading, error } = this.props;  
    if (loading) return <Loading />;

    return (
      <Container>
        <Content padder>
          <Header
            title="회원가입"
            content="가입은 승인 후 완료됩니다."
          />

          {error && <Messages message={error} />}

          <Form>
            <Item stackedLabel>
              <Label>학교</Label>
              <Input onChangeText={v => this.handleChange('school', v)} />
            </Item>
            <Item stackedLabel>
              <Label>이름</Label>
              <Input onChangeText={v => this.handleChange('name', v)} />
            </Item>
            <Item stackedLabel>
              <Label>이메일</Label>
              <Input
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={v => this.handleChange('email', v)}
              />
            </Item>
            <Item stackedLabel>
              <Label>학번</Label>
              <Input
                onChangeText={v => this.handleChange('studentNum', v)}
              />
            </Item>
            <Item stackedLabel>
              <Label>폰번호</Label>
              <Input
                autoCapitalize="none"
                keyboardType="numeric"
                onChangeText={v => this.handleChange('phone', v)}
              />
            </Item>

            <Item stackedLabel>
              <Label>패스워드</Label>
              <Input secureTextEntry onChangeText={v => this.handleChange('password', v)} />
            </Item>

            <Item stackedLabel>
              <Label>패스워드 확인</Label>
              <Input secureTextEntry onChangeText={v => this.handleChange('password2', v)} />
            </Item>

            <Spacer size={20} />

            <Button block onPress={this.handleSubmit}>
              <Text>가입신청</Text>
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}

export default SignUp;
