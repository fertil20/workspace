import {formatTime} from '../../util/Helpers';
import './NewUser.css';
import NotFound from '../../common/NotFound';
import ServerError from '../../common/ServerError';
import {
    Row,
    Col,
    Button,
    FormGroup,
    Form,
    Input,
    Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';
import {TooltipWidgetHome,TooltipWidgetAtWork, TooltipWidgetHoliday, TooltipWidgetIll} from '../profile/TooltipWidget'
import React, {Component, useState} from "react";
import {checkEmailAvailability, checkUsernameAvailability, newUser} from "../../util/APIUtils";
import {EMAIL_MAX_LENGTH, USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH} from "../../constants";


class NewUser extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
        this.state = {
            user: null,
            isLoading: false,
            username: {value: ''},
            password: {value: ''},
            email: {value: ''},
            phone: {value: ''},
            tg: {value: ''},
            name:{value:''},
            about:{value:''},
            position:{value:''},
            department:{value:''},
            office:{value:''},
            startAt:{value:''},
            endAt:{value:''},
            birthday:{value:''},
            secretNote:{value:''},
            status:{value:'0'},
            statusTimeStart:{value:''},
            statusTimeFinish:{value:''}
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
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

        this.setState({isLoading: true})
        const newUserRequest = {
            username: this.state.username.value,
            email: this.state.email.value,
            phone: this.state.phone.value,
            tg: this.state.tg.value,
            name: this.state.name.value,
            about: this.state.about.value,
            position: this.state.position.value,
            department: this.state.department.value,
            office: this.state.office.value,
            startAt: this.state.startAt.value,
            endAt: this.state.endAt.value,
            birthday: this.state.birthday.value,
            secretNote: this.state.secretNote.value,
            status: this.state.status.value, // Статус работы (0,1,2,3)
            statusTimeStart: this.state.statusTimeStart.value,
            statusTimeFinish: this.state.statusTimeFinish.value,
        };
        newUser(newUserRequest)
            .then(response => {
                this.setState({isLoading: false})
                alert('Новый пользователь создан.');
                this.props.history.push(`/users`);
            })
            .catch(error => {
                this.setState({isLoading: false})
                alert('Что-то пошло не так.');
            });
    }
    validateEmail = (email) => {
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
    }

    validateUsername = (username) => {
        if(username.length < USERNAME_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Username is too short (Minimum ${USERNAME_MIN_LENGTH} characters needed.)`
            }
        } else if (username.length > USERNAME_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Username is too long (Maximum ${USERNAME_MAX_LENGTH} characters allowed.)`
            }
        } else {
            return {
                validateStatus: null,
                errorMsg: null
            }
        }
    }

    validateUsernameAvailability() {
        // First check for client side errors in username
        const usernameValue = this.state.username.value;
        const usernameValidation = this.validateUsername(usernameValue);

        if(usernameValidation.validateStatus === 'error') {
            this.setState({
                username: {
                    value: usernameValue,
                    ...usernameValidation
                }
            });
            return;
        }

        this.setState({
            username: {
                value: usernameValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        checkUsernameAvailability(usernameValue)
            .then(response => {
                if(response.available) {
                    this.setState({
                        username: {
                            value: usernameValue,
                            validateStatus: 'success',
                            errorMsg: null
                        }
                    });
                } else {
                    this.setState({
                        username: {
                            value: usernameValue,
                            validateStatus: 'error',
                            errorMsg: 'This username is already taken'
                        }
                    });
                }
            }).catch(error => {
            // Marking validateStatus as success, Form will be recchecked at server
            this.setState({
                username: {
                    value: usernameValue,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
    }

    validateEmailAvailability() {
        const emailValue = this.state.email.value;
        const emailValidation = this.validateEmail(emailValue);

        if(emailValidation.validateStatus === 'error') {
            this.setState({
                email: {
                    value: emailValue,
                    ...emailValidation
                }
            });
            return;
        }

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


    render() {

        if(this.state.isLoading) {
            return <div className="text-center">
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>;
        }

        if(this.state.notFound) {
            return <NotFound />;
        }

        if(this.state.serverError) {
            return <ServerError />;
        }


        const DropdownStatus = () => {
            const [dropdownOpen, setDropdownOpen] = useState(false);
            const toggle = () => setDropdownOpen(prevState => !prevState);
            let setStatus = {
                status(state) {
                    this.setState({status: {value: state}});
                }
            }
            let status = setStatus.status.bind(this);
            return (
                <Dropdown isOpen={dropdownOpen} toggle={toggle} size='sm'>
                    <DropdownToggle caret>
                        Статус
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={ (event) => {
                            status('0');
                            this.handleInputChange(event);}}>Работает дома</DropdownItem>
                        <DropdownItem onClick={ (event) => {
                            status('1');
                            this.handleInputChange(event);}}>Работает в офисе</DropdownItem>
                        <DropdownItem onClick={ (event) => {
                            status('2');
                            this.handleInputChange(event);}}>На больничном</DropdownItem>
                        <DropdownItem onClick={ (event) => {
                            status('3');
                            this.handleInputChange(event);}}>В отпуске</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            )
        };

        return (
            <div className="profile"  >
                {
                        <Form onSubmit={this.handleSubmit}>
                            <Row >
                                <Col sm={{ size: 4 }} style={{backgroundColor: 'white',borderRadius:10,height:500}}>
                                    {/*<div style={{backgroundColor: 'white', margin: 20,borderRadius:10,height:300,width:300}}>*/}
                                    {/*    /!*<Avatar className="user-avatar-circle" style={{ backgroundColor: getAvatarColor(this.state.user.name)}}>*!/*/}
                                    {/*    /!*    {this.state.user.name.toUpperCase()}*!/*/}
                                    {/*    /!*</Avatar>*!/*/}
                                    {/*</div>*/}
                                    <Row>
                                        <Col>
                                            <div style={{color: 'gray', fontWeight: 'bold',height: 50,marginTop:20}}>Username:</div>
                                            <div style={{color: 'gray', fontWeight: 'bold',height: 50}}>E-mail:</div>
                                            <div style={{color: 'gray', fontWeight: 'bold',height: 50}}>Рабочий номер:</div>
                                            <div style={{color: 'gray', fontWeight: 'bold',height: 50}}>Telegram:</div>
                                        </Col>
                                        <Col>
                                            <FormGroup style={{marginTop:20}}>
                                                <Input type="text" name="username" id="username" placeholder="drobovik123"
                                                       value={this.state.username.value}
                                                       required
                                                       onChange={(event) => {this.handleInputChange(event)}}/>
                                                <div style={{height: 10}}/>
                                                <Input type="email" name="email" id="email" placeholder="sophie@example.com"
                                                       value={this.state.email.value}
                                                       required
                                                       onChange={(event) => {this.handleInputChange(event)}}/>
                                                <div style={{height: 10}}/>
                                                <Input type="tel" name="phone" id="phone" placeholder={"+7 (905) 226-23-58"}
                                                       value={this.state.phone.value}
                                                       required
                                                       pattern="[+][7] [(][0-9]{3}[)] [0-9]{3}-[0-9]{2}-[0-9]{2}"
                                                       onChange={(event) => this.handleInputChange(event)}/>
                                                <span className="validity"/>
                                                <div style={{height: 10}}/>
                                                <Input type="text" name="tg" id="tg" placeholder={"telegram"}
                                                       value={this.state.tg.value}
                                                       onChange={(event) => this.handleInputChange(event)}/>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col sm={{ size: 6, offset: 1}} style={{backgroundColor: 'white',borderRadius:10,height:500}}>
                                    <Row>
                                        <Col>
                                            <div style={{color: 'gray', marginTop:20, fontWeight: 'bold',height: 50}}>Ф.И.О:</div>
                                            <div style={{color: 'gray', fontWeight: 'bold',height: 50}}>О себе:</div>
                                            <div style={{color: 'gray', marginTop:30, fontWeight: 'bold',height: 50}}>Должность:</div>
                                            <div style={{color: 'gray', fontWeight: 'bold',height: 50}}>Департамент:</div>
                                            <div style={{color: 'gray', fontWeight: 'bold',height: 50}}>Офис:</div>
                                            <div style={{color: 'gray', fontWeight: 'bold',height: 50}}>Рабочие часы:</div>
                                            <div style={{color: 'gray', fontWeight: 'bold',height: 50}}>Дата рождения:</div>
                                            <div style={{color: 'gray', fontWeight: 'bold',height: 50}}>Секретная заметка:</div>
                                        </Col>
                                        <Col sm={{ size: 7}}>
                                            <div style={{height: 10}}/>
                                            <Input type="text" name="name" id="editName" placeholder={"Попов Валерий Александрович"}
                                                   required
                                                   value={this.state.name.value}
                                                   onChange={(event) => this.handleInputChange(event)}/>
                                            <div style={{height: 10}}/>
                                            <Input type="textarea" name="about" id="editAbout"
                                                   spellCheck={true}
                                                   maxLength={300}
                                                   value={this.state.about.value}
                                                   onChange={(event) => this.handleInputChange(event)}/>
                                            <div style={{height: 25}}/>
                                            <Input type="text" name="position" id="editPosition"
                                                   value={this.state.position.value}
                                                   onChange={(event) => this.handleInputChange(event)}/>
                                            <div style={{height: 10}}/>
                                            <Input type="text" name="department" id="editDepartment"
                                                   value={this.state.department.value}
                                                   onChange={(event) => this.handleInputChange(event)}/>
                                            <div style={{height: 10}}/>
                                            <Input type="text" name="office" id="editOffice"
                                                   value={this.state.office.value}
                                                   onChange={(event) => this.handleInputChange(event)}/>
                                            <div style={{height: 10}}/>
                                            <Row>
                                                <Col sm={{size:2}}>
                                                    <div>
                                                        <Input type="time" name="startAt" id="startAt" style={{width:115}}
                                                               value={formatTime(this.state.startAt.value)}
                                                               required
                                                               pattern="[0-9]{2}:[0-9]{2}"
                                                               onChange={(event) => this.handleInputChange(event)}/>
                                                    </div>
                                                </Col>
                                                <Col sm={{size:2,offset:3}}>—</Col>
                                                <Col sm={{offset:0}}>
                                                    <div >
                                                        <Input type="time" name="endAt" id="endAt" style={{width:115}}
                                                               value={formatTime(this.state.endAt.value)}
                                                               required
                                                               pattern="[0-9]{2}:[0-9]{2}"
                                                               onChange={(event) => this.handleInputChange(event)}/>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <div style={{height: 15}}/>
                                            <Input type="date" name="birthday" id="birthday"
                                                   value={this.state.birthday.value}
                                                   onChange={(event) => this.handleInputChange(event)}/>
                                            <div style={{height: 25}}/>
                                            <Input type="text" name="secretNote" id="editSecretNote"
                                                   value={this.state.secretNote.value}
                                                   onChange={(event) => this.handleInputChange(event)}/>
                                            <div style={{marginTop:20}}>
                                                <Button color="primary" size="sm">
                                                    Добавить пользователя
                                                </Button>
                                            </div>
                                        </Col>
                                        <div style={{margin:10}}>
                                            {this.state.status.value === '0' && <TooltipWidgetHome/>}
                                            {this.state.status.value === '1' && <TooltipWidgetAtWork/>}
                                            {this.state.status.value === '2' && <TooltipWidgetIll/>}
                                            {this.state.status.value === '3' && <TooltipWidgetHoliday/>}
                                        </div>
                                    </Row>
                                </Col>
                                <div style={{margin:10}}>
                                    <DropdownStatus/>
                                </div>
                            </Row>
                        </Form>
                }
            </div>
        );
    }
}

export default NewUser;