import React, { Component } from 'react';
import {login} from '../../util/APIUtils';
import './Login.css';
import { ACCESS_TOKEN } from '../../constants';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Button, notification } from 'antd';
import {Link} from "react-router-dom";
// import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
const FormItem = Form.Item;

class Login extends Component {
    render() {
        const AntWrappedLoginForm = Form.create()(LoginForm)
        return (
            <div className="login-container">
                <h1 className="workspace-logo">Workspace</h1>
                <div className="login-content">
                    {/*<LoginForm onLogin={this.props.onLogin} />*/}
                    <AntWrappedLoginForm onLogin={this.props.onLogin} />
                </div>
            </div>
        );
    }
}

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();   
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const loginRequest = Object.assign({}, values);
                login(loginRequest)
                .then(response => {
                    localStorage.setItem(ACCESS_TOKEN, response.accessToken);
                    this.props.onLogin();
                }).catch(error => {
                    if(error.status === 401) {
                        notification.error({
                            key: "1",
                            message: 'Workspace App',
                            description: 'Your Username or Password is incorrect. Please try again!'
                        });
                    } else {
                        notification.error({
                            key: "1",
                            message: 'Workspace App',
                            description: error.message || 'Sorry! Something went wrong. Please try again!'
                        });
                    }
                });
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (

            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem className="input-form-login">
                    {getFieldDecorator('usernameOrEmail', {
                        rules: [{ required: true, message: 'Введите E-mail или Username!' }],
                    })(
                    <Input
                        // prefix={<Icon type="user" />}
                        className="login-form-input"
                        style={{backgroundColor: '#EDEEF0'}}
                        size="large"
                        name="usernameOrEmail"
                        placeholder="Username or Email" />
                    )}
                </FormItem>
                <FormItem className="input-form-password">
                {getFieldDecorator('password', {
                    rules: [{ required: true, message: 'Введите пароль!' }],
                })(
                    <Input
                        className="login-form-input"
                        style={{backgroundColor: '#EDEEF0'}}
                        // prefix={<Icon type="lock" />}
                        size="large"
                        name="password"
                        type="password"
                        placeholder="Пароль"  />
                )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" size="large" className="login-form-button">Войти</Button>
                    <Link className="forgot-password" to={'/forgotPassword'}>Забыл пароль</Link>
                </FormItem>
            </Form>
        );
    }
}


export default Login;