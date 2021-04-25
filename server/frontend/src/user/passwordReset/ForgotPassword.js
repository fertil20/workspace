import React, { Component } from 'react';
import './ForgotPassword.css';
import { Form, FormGroup, Input, Button} from 'reactstrap';
import {checkEmailAvailability, forgotPassword, signup} from "../../util/APIUtils";

let textContent = ''
let buttonStatus = ''

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
        event.preventDefault();

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
            buttonStatus = true
            textContent = <div>Введите вашу почту для смены пароля</div>
        }
        if (this.state.email.validateStatus === 'error') {
            buttonStatus = true
            textContent = <div>Пользователя с данным Email нет в системе, попробуйте еще раз.</div>
        }
        if (this.state.email.validateStatus === 'success') {
            buttonStatus = false
            textContent = <div>Почта найдена в системе. Нажмите Далее</div>
        }
        if(this.state.serverError === true) {
            textContent = <div>Что-то пошло не так</div>;
        }
        if(this.state.serverError === false) {
            textContent = <div>Мы отправили вам письмо. Проверьте свой электронный ящик</div>;
        }

        return (
            <div className="main-container">
                <h1 className="header">Workspace</h1>
                <Form className="form-container" onSubmit={this.handleSubmit}>
                    <div className="forgot-password-text">
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
                            disabled={buttonStatus}
                            onClick={(event) =>
                                this.sendMail(event)}>
                    Далее
                    </Button>
                </Form>
            </div>
        );
    }

    /*    validateEmail = (email) => {
            if(!email) {
                return {
                    validateStatus: 'error',
                    errorMsg: 'Email may not be empty'
                }
            }

            const EMAIL_REGEX = RegExp('[^@ ]+@[^@ ]+\\.[^@ ]+');
            if(!EMAIL_REGEX.test(email)) {
                return {
                    validateStatus: 'error',
                    errorMsg: 'Email not valid'
                }
            }

            if(email.length > EMAIL_MAX_LENGTH) {
                return {
                    validateStatus: 'error',
                    errorMsg: `Email is too long (Maximum ${EMAIL_MAX_LENGTH} characters allowed)`
                }
            }

            return {
                validateStatus: null,
                errorMsg: null
            }
        }*/

    sendMail() {
        const forgotPasswordRequest = {
            email: this.state.email.value,
        };
        forgotPassword(forgotPasswordRequest)
            .then(response => {
                this.setState({serverError: false});
            })
            .catch(error => {
                this.setState({serverError: true});
            });
    };

    validateEmailAvailability() {

        const emailValue = this.state.email.value;
/*        const emailValidation = this.validateEmail(emailValue);

        if(emailValidation.validateStatus === 'error') {
            this.setState({
                email: {
                    value: emailValue,
                    ...emailValidation
                }
            });
            return;
        }*/

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