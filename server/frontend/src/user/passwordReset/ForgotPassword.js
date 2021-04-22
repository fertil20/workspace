import React, { Component } from 'react';
import './ForgotPassword.css';
import { Form, FormGroup, Input, Button} from 'reactstrap';
import {forgotPassword} from "../../util/APIUtils";

let textContent = ''
let textContentValid = 1;

export default class ForgotPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: {value: ''}
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;

        this.setState({
            [inputName] : {
                value: inputValue,
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        const forgotPasswordRequest = {
            email: this.state.email.value,
        };
        forgotPassword(forgotPasswordRequest)
            .then(response => {
                alert('На электронную почту выслана ссылка на восстановление пароля.');
                this.props.history.push(`/login`);
            }).catch(error => {
                this.setState({});
                textContentValid = 0;
        });
    }


    render() {
        if (textContentValid === 1) {
            textContent = <div>После нажатия на кнопку “Далее”
                перейдите по ссылке, которую мы пришлем вам на почту</div>
        }
        else {textContent = <div>Пользователя с данным Email нет в системе, попробуйте еще раз.</div>}

        return (
            <div className="main-container">
                <h1 className="header">Workspace</h1>
                   <Form className="form-container" onSubmit={this.handleSubmit}>
                       <div className="forgot-password-text">
                           {textContent}
                       </div>
                       <FormGroup >
                            <Input type="email" name="email" id="email" className="forgot-password-form-input"
                            placeholder="E-mail:"
                                   value={this.state.email.value}
                                   onChange={(event) => this.handleInputChange(event)}     >
                            </Input>
                       </FormGroup>
                       <Button className="forgot-password-form-button" size="sm">
                           Далее
                       </Button>
                   </Form>
            </div>
        );
    }

}