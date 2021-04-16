import { getAvatarColor } from '../../util/Colors';
import { formatDate } from '../../util/Helpers';
import LoadingIndicator  from '../../common/LoadingIndicator';
import './Profile.css';
import NotFound from '../../common/NotFound';
import ServerError from '../../common/ServerError';
import {
    Row,
    Col,
    Button,
    FormGroup,
    Form,
    Input,
    Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip
} from 'reactstrap';
import {TooltipWidgetHome,TooltipWidgetAtWork, TooltipWidgetHoliday, TooltipWidgetIll} from './TooltipWidget'
import {Avatar} from "antd";
import React, {Component, useState} from "react";
import {getUserProfile, profileEdit, setUserProfile} from "../../util/APIUtils";

let userStatus = 2;
let flag = 1;
let tip = 1;

class ProfileEdit extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: false,
            newEmail: {value: ''},
            newPhoneNumber: {value: ''},
            newTg: {value: ''},
            newName:{value:''},
            newAbout:{value:''},
            newPosition:{value:''},
            newDepartment:{value:''},
            newOffice:{value:''},
            // newWorktimes:{value:''},
            newSecretNote:{value:''},
            newWorkingStatus:{value:''}
        }
        this.loadUserProfile = this.loadUserProfile.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    loadUserProfile(username) {
        this.setState({
            isLoading: true
        });

        getUserProfile(username)
            .then(response => {
                this.setState({
                    user: response,
                    isLoading: false,
                });
            }).catch(error => {
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
            }
        });
    }

    componentDidMount() {
        const username = this.props.match.params.username;
        this.loadUserProfile(username);
    }

    componentDidUpdate(nextProps) {
        if(this.props.match.params.username !== nextProps.match.params.username) {
            this.loadUserProfile(nextProps.match.params.username);
        }
    }

    handleInputChange(event) {
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;

        this.setState({
            [inputName] : {
                value: inputValue,

                // ...validationFun(inputValue)
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        const profileEditRequest = {
            newEmail: this.state.newEmail.value,
            newPhoneNumber: this.state.newPhoneNumber.value,
            newTg: this.state.newTg.value,
            newName: this.state.newName.value,
            newAbout: this.state.newAbout.value,
            newPosition: this.state.newPosition.value,
            newDepartment: this.state.newDepartment.value,
            newOffice: this.state.newOffice.value,
            // newWorktimes: this.state.newWorktimes.value,
            newSecretNote: this.state.newSecretNote.value,
            newWorkingStatus: this.state.newWorkingStatus.value // Статус работы (0,1,2,3)
        };
        profileEdit(profileEditRequest)
            .then(response => {
                alert('Данные успешно изменены.');
                this.props.history.push(`/users/${this.state.user.username}`);
            }).catch(error => {
            alert('Что-то пошло не так.');
        });
    }


    render() {

        if(this.state.isLoading) {
            return <LoadingIndicator />;
        }

        if(this.state.notFound) {
            return <NotFound />;
        }

        if(this.state.serverError) {
            return <ServerError />;
        }

        if (flag === 1){
            if (this.state.user != null){

                this.state.newEmail.value = this.state.user.email
                this.state.newPhoneNumber.value = this.state.user.phone
                this.state.newTg.value = this.state.user.tg
                this.state.newName.value = this.state.user.name
                this.state.newAbout.value = this.state.user.about
                this.state.newPosition.value = this.state.user.position
                this.state.newDepartment.value = this.state.user.department
                this.state.newOffice.value = this.state.user.office
                // this.state.newWorktimes.value = this.state.user.workTimes.map(t => t.time).join()
                this.state.newSecretNote.value = this.state.user.secretNote
                this.state.newWorkingStatus.value = ''//this.state.user.workingStatus //Записать сюда статус работника (0,1,2,3)

                flag = 0}
        }
        //this.state.user.workingStatus = userState //Раскоментить для работы статуса работника
        if(userStatus === 0){tip = <TooltipWidgetHome/>;}
        if(userStatus === 1){tip = <TooltipWidgetAtWork/>;}
        if(userStatus === 2){tip = <TooltipWidgetIll/>;}
        if(userStatus === 3){tip = <TooltipWidgetHoliday/>;}

        return (
            <div className="profile"  >
                {
                    this.state.user ? (
                        <Form onSubmit={this.handleSubmit}>
                        <Row >
                            <Col sm={{ size: 4 }} style={{backgroundColor: '#EDEEF0',borderRadius:10,height:500}}>
                                <div style={{backgroundColor: 'white', margin: 20,borderRadius:10,height:300,width:300}}>
                                    <Avatar className="user-avatar-circle" style={{ backgroundColor: getAvatarColor(this.state.user.name)}}>
                                        {this.state.user.name.toUpperCase()}
                                    </Avatar>
                                </div>
                                <Row>
                                    <Col>
                                        <div style={{color: 'gray', fontWeight: 'bold',height: 50}}>E-mail:</div>
                                        <div style={{color: 'gray', fontWeight: 'bold',height: 50}}>Рабочий номер:</div>
                                        <div style={{color: 'gray', fontWeight: 'bold',height: 50}}>Telegram:</div>
                                    </Col>
                                    <Col>
                                            <FormGroup>
                                                <Input type="email" name="newEmail" id="editEmail"
                                                       value={this.state.newEmail.value}
                                                       onChange={(event) => this.handleInputChange(event)}/>
                                                <div style={{height: 10}}/>
                                                <Input type="phoneNumber" name="newPhoneNumber" id="editPhoneNumber" placeholder={this.state.user.phone}
                                                       value={this.state.newPhoneNumber.value}
                                                       onChange={(event) => this.handleInputChange(event)}/>
                                                <div style={{height: 10}}/>
                                                <Input type="tg" name="newTg" id="editTg" placeholder={this.state.user.tg}
                                                       value={this.state.newTg.value}
                                                       onChange={(event) => this.handleInputChange(event)}/>
                                            </FormGroup>
                                    </Col>
                                </Row>
                            </Col>
                            <Col sm={{ size: 5, offset: 1}} style={{backgroundColor: '#EDEEF0',borderRadius:10,height:500}}>
                                <Row>
                                    <Col>
                                        <div style={{color: 'gray', marginTop:20, fontWeight: 'bold',height: 50}}>Ф.И.О:</div>
                                        <div style={{color: 'gray', marginTop:20, fontWeight: 'bold',height: 50}}>О себе:</div>
                                        <div style={{color: 'gray', fontWeight: 'bold',height: 50}}>Должность:</div>
                                        <div style={{color: 'gray', fontWeight: 'bold',height: 50}}>Департамент:</div>
                                        <div style={{color: 'gray', fontWeight: 'bold',height: 50}}>Офис:</div>
                                        <div style={{color: 'gray', fontWeight: 'bold',height: 50}}>Рабочие часы:</div>
                                        <div style={{color: 'gray', fontWeight: 'bold',height: 50}}>В компании с:</div>
                                        <div style={{color: 'gray', fontWeight: 'bold',height: 50}}>Дата рождения:</div>
                                        <div style={{color: 'gray', fontWeight: 'bold',height: 50}}>Секретная заметка:</div>
                                    </Col>
                                    <Col>
                                        <div style={{height: 15}}/>
                                        <Input type="name" name="newName" id="editName"
                                               value={this.state.newName.value}
                                               onChange={(event) => this.handleInputChange(event)}/>
                                        <div style={{height: 35}}/>
                                        <Input type="about" name="newAbout" id="editAbout"
                                               value={this.state.newAbout.value}
                                               onChange={(event) => this.handleInputChange(event)}/>
                                        <div style={{height: 10}}/>
                                        <Input type="position" name="newPosition" id="editPosition"
                                               value={this.state.newPosition.value}
                                               onChange={(event) => this.handleInputChange(event)}/>
                                        <div style={{height: 10}}/>
                                        <Input type="department" name="newDepartment" id="editDepartment"
                                               value={this.state.newDepartment.value}
                                               onChange={(event) => this.handleInputChange(event)}/>
                                        <div style={{height: 10}}/>
                                        <Input type="office" name="newOffice" id="editOffice"
                                               value={this.state.newOffice.value}
                                               onChange={(event) => this.handleInputChange(event)}/>
                                        {/*<Input type="worktimes" name="newWorktimes" id="editWorktimes"*/}
                                        {/*       value={this.state.newWorktimes.value}*/}
                                        {/*       onChange={(event) => this.handleInputChange(event)}/>*/}
                                        <div style={{marginTop:20,height:30}}>{this.state.user.workTimes.map(t => t.time).join()}</div>
                                        <div style={{marginTop:22,height:50}}>{formatDate(this.state.user.joinedAt)}</div>
                                        <div style={{height:50}}>{formatDate(this.state.user.birthday)}</div>
                                        <Input type="secretNote" name="newSecretNote" id="editSecretNote"
                                               value={this.state.newSecretNote.value}
                                               onChange={(event) => this.handleInputChange(event)}/>
                                        <div style={{marginTop:27}}>
                                            <Button color="primary" size="sm">
                                                Сохранить
                                            </Button>
                                        </div>
                                    </Col>
                                    <div style={{paddingRight:10,paddingTop:10}}>{tip}</div>
                                </Row>

                            </Col>
                            <div style={{marginTop:10, marginLeft:5}}><DropdownStatus /></div>
                        </Row>
                        </Form>
                    ): null
                }
            </div>
        );
    }
}

const DropdownStatus = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen(prevState => !prevState);

    const changeTipToZero = () => userStatus = 0;
    const changeTipToOne = () => userStatus = 1;
    const changeTipToTwo = () => userStatus = 2;
    const changeTipToThree = () => userStatus = 3;

    return (
        <Dropdown isOpen={dropdownOpen} toggle={toggle} size='sm'>
            <DropdownToggle caret>
                Изменить статус
            </DropdownToggle>
            <DropdownMenu>
                <DropdownItem onClick={changeTipToZero}>Работает дома</DropdownItem>
                <DropdownItem onClick={changeTipToOne}>Работает в офисе</DropdownItem>
                <DropdownItem onClick={changeTipToTwo}>На больничном</DropdownItem>
                <DropdownItem onClick={changeTipToThree}>В отпуске</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
}


export default ProfileEdit;