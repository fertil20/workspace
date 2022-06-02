import React, {Component} from 'react';
import './ForgotPassword.css';
import {Button, Form, FormGroup, Input} from 'reactstrap';
import {changePassword} from "../../util/APIUtils";
import NotFound from "../../common/NotFound";
import ServerError from "../../common/ServerError";

let textContent = ''
let buttonDisabled = ''

export default class ChangePassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            password1: {
                value: '',
                validateStatus: 'validating'
            },
            password2: {
                value: ''
            },
            user: JSON.parse(localStorage.getItem('app'))
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.checkPasswordMatch = this.checkPasswordMatch.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;

        this.setState({
            [inputName]: {
                value: inputValue,
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({isLoading: true});
        changePassword(this.state.password2.value, this.state.user.currentUser.username)
            .then(response => {
                this.setState({
                    serverError: false,
                    isLoading: false
                });
                alert('Пароль изменён.');
                this.props.history.push(`/`);
            })
            .catch(error => {
                if(error.status === 404) {
                    this.setState({
                        notFound: true,
                        isLoading: false
                    });
                } else {
                    this.setState({
                        serverError: true,
                        isLoading: false
                    });
                    alert('Что-то пошло не так.');
                }
            });
    }

    render() {
        if(this.state.notFound) {
            return <NotFound />;
        }
        if(this.state.serverError) {
            return <ServerError />;
        }
        if (this.state.password1.validateStatus === 'validating') {
            buttonDisabled = true
            textContent = <div>Введите новый пароль</div>
        }
        if (this.state.password1.validateStatus === 'notMatch') {
            buttonDisabled = true
            textContent = <div className='color-red'>Пароли не совпадают</div>
        }
        if (this.state.password1.validateStatus === 'short') {
            buttonDisabled = true
            textContent = <div className='color-orange'>Пароль должен быть не менее 6 символов</div>
        }
        if (this.state.password1.validateStatus === 'validatingSecond') {
            buttonDisabled = true
            textContent = <div className='color-orange'>Подтвердите пароль</div>
        }
        if (this.state.password1.validateStatus === 'match') {
            buttonDisabled = false
            textContent = <div className='color-green'>Пароли совпадают</div>
        }
        if(this.state.serverError === true) {
            textContent = <div className='color-red'>Что-то пошло не так</div>;
        }
        if (this.state.isLoading) {
            buttonDisabled = true
        }

        return (
            <div className="main-container">
                <h1 className="header">Workspace</h1>
                <Form className="form-container" onSubmit={this.handleSubmit}>
                    <div className="forgot-password-text">
                        {textContent}
                    </div>
                    <FormGroup>
                        <Input type="password" name="password1" id="password1" className="forgot-password-form-input"
                               style = {{marginTop:-30}}
                               placeholder="Введите пароль:"
                               value={this.state.password1.value}
                               onBlur={this.checkPasswordMatch}
                               onChange={(event) =>
                                   this.handleInputChange(event)}>
                        </Input>
                        <Input type="password" name="password2" id="password2" className="forgot-password-form-input"
                               style = {{marginTop:30}}
                               autoComplete="off"
                               placeholder="Подтвердите пароль:"
                               value={this.state.password2.value}
                               onBlur={this.checkPasswordMatch}
                               onChange={(event) =>
                                   this.handleInputChange(event)}>
                        </Input>
                    </FormGroup>
                    <Button className="forgot-password-form-button" size="sm"
                            disabled={buttonDisabled}
                        // onClick={(event) => {
                        //     this.sendPassword(event)}}>
                    >
                        { this.state.isLoading
                            ? <span className="visible">Загрузка <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/></span>
                            : <span className="hidden">Изменить</span>
                        }
                    </Button>
                </Form>
            </div>
        );
    }

    checkPasswordMatch(){
        const passwordOne = this.state.password1.value;
        const passwordTwo = this.state.password2.value;
        if (passwordOne === passwordTwo && passwordOne.length >=6){
            this.setState({
                password1: {value: passwordOne, validateStatus: 'match'}
            })
        }
        if (passwordOne.length < 6){
            this.setState({
                password1: {value: passwordOne, validateStatus: 'short'}
            })
        }
        if ((passwordOne !== passwordTwo && passwordOne.length>=6)){
            this.setState({
                password1: {value: passwordOne, validateStatus: 'notMatch'}
            })
        }
        if (passwordOne.length >= 6 && passwordTwo.length < 6){
            this.setState({
                password1: {value: passwordOne, validateStatus: 'validatingSecond'}
            })
        }
    }
}