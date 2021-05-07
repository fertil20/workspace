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
import FormItem from "@ant-design/compatible/es/form/FormItem";
import NavigationPanel from "../../common/NavigationPanel";
import PhoneInput, {isPossiblePhoneNumber} from "react-phone-number-input";


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
        this.validateUsernameAvailability = this.validateUsernameAvailability.bind(this);
        this.validateEmailAvailability = this.validateEmailAvailability.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
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
                errorMsg: 'Email не может быть пустым'
            }
        }

        const EMAIL_REGEX = RegExp('[^@ ]+@[^@ ]+\\.[^@ ]+');
        if(!EMAIL_REGEX.test(email)) {
            return {
                validateStatus: 'error',
                errorMsg: 'Email введён неверно'
            }
        }

        if(email.length > EMAIL_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Email слишком длинный (Максимум - ${EMAIL_MAX_LENGTH} знаков)`
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
                errorMsg: `(Минимум - ${USERNAME_MIN_LENGTH} знака)`
            }
        } else if (username.length > USERNAME_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `(Максимум - ${USERNAME_MAX_LENGTH} знака)`
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
                            errorMsg: 'Имя пользователя занято'
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
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        checkEmailAvailability(emailValue)
            .then(response => {
                if(response.available) {
                    this.setState({
                        email: {
                            value: emailValue,
                            validateStatus: 'success',
                            errorMsg: null
                        }
                    });
                } else {
                    this.setState({
                        email: {
                            value: emailValue,
                            validateStatus: 'error',
                            errorMsg: 'Этот email уже зарегистрирован'
                        }
                    });
                }
            }).catch(error => {
            // Marking validateStatus as success, Form will be rechecked at server
            this.setState({
                email: {
                    value: emailValue,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
    }

    isFormInvalid() {
        return !(this.state.username.validateStatus === 'success' &&
            this.state.email.validateStatus === 'success'
        );
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
                                <NavigationPanel/>
                                <Col sm={{ size: 4.4 }} style={{backgroundColor: 'white',borderRadius:10,height:500,marginRight:30}}>
                                    {/*<div style={{backgroundColor: 'white', margin: 20,borderRadius:10,height:300,width:300}}>*/}
                                    {/*    /!*<Avatar className="user-avatar-circle" style={{ backgroundColor: getAvatarColor(this.state.user.name)}}>*!/*/}
                                    {/*    /!*    {this.state.user.name.toUpperCase()}*!/*/}
                                    {/*    /!*</Avatar>*!/*/}
                                    {/*</div>*/}
                                    <div className='profile-title'>Новый пользователь</div>
                                    <Row>
                                        <Col >
                                            <div style={{marginTop:25}} className='profile-text1'>Username:</div>
                                            <div style={{marginTop:15}} className='profile-text1'>E-mail:</div>
                                            <div style={{marginTop:45}} className='profile-text1'>Рабочий номер:</div>
                                            <div className='profile-text1'>Telegram:</div>
                                        </Col>
                                        <Col>
                                            <FormGroup style={{marginTop:20}}>
                                                <FormItem hasFeedback
                                                          validateStatus={this.state.username.validateStatus}
                                                          help={this.state.username.errorMsg}
                                                          style={{height:50}}>
                                                    <Input
                                                        type="text" className='profile-form'
                                                        required
                                                        name="username"
                                                        autoComplete="off"
                                                        placeholder="drobovik123"
                                                        value={this.state.username.value}
                                                        onBlur={this.validateUsernameAvailability}
                                                        onChange={(event) => this.handleInputChange(event, this.validateUsername)} />
                                                </FormItem>
                                                <div style={{height: 10}}/>
                                                <FormItem
                                                    hasFeedback className='profile-form'
                                                    validateStatus={this.state.email.validateStatus}
                                                    help={this.state.email.errorMsg}
                                                    style={{height:80}}>
                                                    <Input
                                                        name="email"
                                                        type="email"
                                                        required
                                                        autoComplete="off"
                                                        placeholder="sophie@exmpl.com"
                                                        value={this.state.email.value}
                                                        onBlur={this.validateEmailAvailability}
                                                        onChange={(event) => this.handleInputChange(event, this.validateEmail)} />
                                                </FormItem> {/*todo надо фиксить формочки!*/}
                                                <div style={{height: 10}}/>
{/*                                                <Input type="tel" name="phone" id="phone" placeholder={"+7 (905) 226-23-58"}
                                                       value={this.state.phone.value}
                                                       required className='profile-form'
                                                       pattern="[+][7] [(][0-9]{3}[)] [0-9]{3}-[0-9]{2}-[0-9]{2}"
                                                       onChange={(event) => this.handleInputChange(event)}/>*/}
                                                <PhoneInput
                                                    international
                                                    countryCallingCodeEditable={false}
                                                    placeholder="+7 905 226 23 58"
                                                    defaultCountry="RU"
                                                    value={this.state.phone.value}
                                                    style={{width:170, height:40}}
                                                    onChange={event => this.setState({phone: {value: event }})}/>
                                                {/*{(this.state.phone.value && isPossiblePhoneNumber(this.state.phone.value))
                                                    ? <a> </a> : <a> </a>}*/} //todo из-за надписи съезжает вся колонка!
                                                <div style={{height: 10}}/>
                                                <Input type="text" name="tg" id="tg" placeholder={"telegram"}
                                                       value={this.state.tg.value} className='profile-form'
                                                       onChange={(event) => this.handleInputChange(event)}/>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </Col >
                                <Col sm={{ size: 6.6}} style={{backgroundColor: 'white',borderRadius:10, height:500, width:465}}>
                                    <Row>
                                        <Col sm={{ size: 'auto'}}>
                                            <div className='profile-text1' style={{marginTop:15}}>Ф.И.О:</div>
                                            <div className='profile-text1'>О себе:</div>
                                            <div className='profile-text1' style={{marginTop:45}}>Должность:</div>
                                            <div className='profile-text1'>Департамент:</div>
                                            <div className='profile-text1'>Офис:</div>
                                            <div className='profile-text1'>Рабочие часы:</div>
                                            <div className='profile-text1'>Дата рождения:</div>
                                            <div className='profile-text1'>Секретная заметка:</div>
                                        </Col>
                                        <Col sm={{ size: 7}}>
                                            <div style={{height: 10}}/>
                                            <Row>
                                                <Col>
                                            <Input type="text" name="name" id="editName" placeholder={"Иванов Иван Иванович"}
                                                   required style={{width:155}}
                                                   value={this.state.name.value}
                                                   onChange={(event) => this.handleInputChange(event)}/>
                                                </Col>
                                                <Col sm={{ width:30}}>
                                                    <div style={{marginTop:5, width:30,paddingRight:5}}>
                                                        {this.state.status.value === '0' && <TooltipWidgetHome/>}
                                                        {this.state.status.value === '1' && <TooltipWidgetAtWork/>}
                                                        {this.state.status.value === '2' && <TooltipWidgetIll/>}
                                                        {this.state.status.value === '3' && <TooltipWidgetHoliday/>}
                                                    </div>
                                                </Col>
                                                <Col sm={{ width:30}}>
                                                    <DropdownStatus/>
                                                </Col>
                                            </Row>
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
                                                        <Input type="time" name="startAt" id="startAt" style={{width:100}}
                                                               value={formatTime(this.state.startAt.value)}
                                                               required
                                                               pattern="[0-9]{2}:[0-9]{2}"
                                                               onChange={(event) => this.handleInputChange(event)}/>
                                                    </div>
                                                </Col>
                                                <Col sm={{size:2,offset:3}}>—</Col>
                                                <Col sm={{offset:0}}>
                                                    <div >
                                                        <Input type="time" name="endAt" id="endAt" style={{width:100}}
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
                                            <div style={{height: 15}}/>
                                            <Input type="text" name="secretNote" id="editSecretNote"
                                                   value={this.state.secretNote.value}
                                                   onChange={(event) => this.handleInputChange(event)}/>
                                            <div style={{marginTop:20}}>
                                                <Button color="primary" size="sm" disabled={!(this.state.phone.value && isPossiblePhoneNumber(this.state.phone.value))
                                                || this.isFormInvalid()}>
                                                    Добавить пользователя
                                                </Button>
                                                <div style={{margin:10}}>

                                                </div>
                                            </div>
                                        </Col>

                                    </Row>
                                </Col>
                            </Row>
                        </Form>
                }
            </div>
        );
    }
}

export default NewUser;