import React, {Component} from 'react';
import './ForgotPassword.css';
import {Button, Form, FormGroup, Input} from 'reactstrap';
import {checkEmailAvailability, forgotPassword} from "../../util/APIUtils";

let textContent = ''
let buttonDisabled = ''

export default class ForgotPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: {
                value: '',
                validateStatus: 'validating'
            }
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateEmailAvailability = this.validateEmailAvailability.bind(this);
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
        event.preventDefault(); //todo сделать handleSubmit вместо onClick

        /*        const forgotPasswordRequest = {
                    email: this.state.email.value,
                };*/
    }

    /*            forgotPassword(forgotPasswordRequest)
                .then(response => {
                    alert('На электронную почту выслана ссылка на восстановление пароля.');
                }).catch(error => {
                    this.setState({});
                    textContentValid = 0;
            });
        }*/


    render() {
        if (this.state.email.validateStatus === 'validating') {
            buttonDisabled = true
            textContent = <div>Введите вашу почту для смены пароля</div>
        }
        if (this.state.email.validateStatus === 'error') {
            buttonDisabled = true
            textContent = <div>Пользователя с данным Email нет в системе, попробуйте еще раз</div>
        }
        if (this.state.email.validateStatus === 'success') {
            buttonDisabled = false
            textContent = <div>Почта найдена в системе. Нажмите Отправить</div>
        }
        if(this.state.serverError === true) {
            textContent = <div>Что-то пошло не так</div>;
        }
        if(this.state.serverError === false) {
            textContent = <div>Мы отправили вам письмо. Проверьте свой электронный ящик</div>
        }
        if ((this.state.isLoading) || (this.state.isLoaded)) {
            buttonDisabled = true
        }

        return (
            <div className="main-container">
                <h1 className="header">Workspace</h1>
                <Form className="form-container" onSubmit={this.handleSubmit}>
                    <div className="forgot-password-text" style={{height:30}}>
                        {textContent}
                    </div>
                    <FormGroup>
                        <Input type="email" name="email" id="email" className="forgot-password-form-input"
                               placeholder="E-mail:"
                               value={this.state.email.value}
                               onBlur={this.validateEmailAvailability}
                               onChange={(event) =>
                                   this.handleInputChange(event)}>
                        </Input>
                    </FormGroup>
                    <Button className="forgot-password-form-button" size="sm"
                            disabled={buttonDisabled}
                            onClick={(event) => {
                                this.sendMail(event)}}>
                        { this.state.isLoading
                            ? <span>Отправляю <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/></span>
                            : (
                                this.state.isLoaded
                                    ? <span>Отправлено</span>
                                    : <span>Отправить</span>
                            )
                        }
                    </Button>
                </Form>
            </div>
        );
    }

    sendMail() {
        this.setState({
            isLoading: true,
            isLoaded: false
        });
        const forgotPasswordRequest = {
            email: this.state.email.value,
        };
        forgotPassword(forgotPasswordRequest)
            .then(response => {
                this.setState({
                    serverError: false,
                    isLoading: false,
                    isLoaded: true
                });
            })
            .catch(error => {
                this.setState({
                    serverError: true,
                    isLoading: false,
                    isLoaded: false
                });
            });
    };

    validateEmailAvailability() {

        const emailValue = this.state.email.value;
        this.setState({
            email: {
                value: emailValue,
                validateStatus: 'validating'
            }
        });

        checkEmailAvailability(emailValue)
            .then(response => {
                if(response.available) {
                    this.setState({
                        email: {
                            value: emailValue,
                            validateStatus: 'error'
                        }
                    });
                } else {
                    this.setState({
                        email: {
                            value: emailValue,
                            validateStatus: 'success'
                        }
                    });
                }
            }).catch(error => {
            // Marking validateStatus as success, Form will be rechecked at server
            this.setState({
                email: {
                    value: emailValue,
                    validateStatus: 'validating',
                }
            });
        });
    }
}