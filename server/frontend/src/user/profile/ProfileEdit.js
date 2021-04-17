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
import {getUserProfile, profileEdit} from "../../util/APIUtils";

let flag = 1;

class ProfileEdit extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: false,
            username: {value: ''},
            email: {value: ''},
            phone: {value: ''},
            tg: {value: ''},
            name:{value:''},
            about:{value:''},
            position:{value:''},
            department:{value:''},
            office:{value:''},
            // newWorktimes:{value:''},
            secretNote:{value:''},
            status:{value:''}
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
            email: this.state.email.value,
            phone: this.state.phone.value,
            tg: this.state.tg.value,
            name: this.state.name.value,
            about: this.state.about.value,
            position: this.state.position.value,
            department: this.state.department.value,
            office: this.state.office.value,
            // newWorktimes: this.state.newWorktimes.value,
            secretNote: this.state.secretNote.value,
            status: this.state.status.value // Статус работы (0,1,2,3)
        };
        profileEdit(profileEditRequest, this.state.user.username)
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

                this.state.email.value = this.state.user.email
                this.state.phone.value = this.state.user.phone
                this.state.tg.value = this.state.user.tg
                this.state.name.value = this.state.user.name
                this.state.about.value = this.state.user.about
                this.state.position.value = this.state.user.position
                this.state.department.value = this.state.user.department
                this.state.office.value = this.state.user.office
                // this.state.newWorktimes.value = this.state.user.workTimes.map(t => t.time).join()
                this.state.secretNote.value = this.state.user.secretNote
                this.state.status.value = this.state.user.status

                flag = 0}

        }

/*        if(userStatus === 0){tip = <TooltipWidgetHome/>;}
        if(userStatus === 1){tip = <TooltipWidgetAtWork/>;}
        if(userStatus === 2){tip = <TooltipWidgetIll/>;}
        if(userStatus === 3){tip = <TooltipWidgetHoliday/>;}*/
        const DropdownStatus = () => {
            const [dropdownOpen, setDropdownOpen] = useState(false);
            const toggle = () => setDropdownOpen(prevState => !prevState);
           let setStatus = {
                status(a) {
                    this.state.user.status = a
                    this.state.status.value = this.state.user.status
                }
           }
           let status = setStatus.status.bind(this);
           return (
               <Dropdown isOpen={dropdownOpen} toggle={toggle} size='sm'>
                   <DropdownToggle caret>
                       Изменить статус
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
                                                <Input type="email" name="email" id="email"
                                                       value={this.state.email.value}
                                                       onChange={(event) => this.handleInputChange(event)}/>
                                                <div style={{height: 10}}/>
                                                <Input type="phone" name="phone" id="phone" placeholder={this.state.user.phone}
                                                       value={this.state.phone.value}
                                                       onChange={(event) => this.handleInputChange(event)}/>
                                                <div style={{height: 10}}/>
                                                <Input type="tg" name="tg" id="tg" placeholder={this.state.user.tg}
                                                       value={this.state.tg.value}
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
                                        <Input type="name" name="name" id="editName"
                                               value={this.state.name.value}
                                               onChange={(event) => this.handleInputChange(event)}/>
                                        <div style={{height: 35}}/>
                                        <Input type="about" name="about" id="editAbout"
                                               value={this.state.about.value}
                                               onChange={(event) => this.handleInputChange(event)}/>
                                        <div style={{height: 10}}/>
                                        <Input type="position" name="position" id="editPosition"
                                               value={this.state.position.value}
                                               onChange={(event) => this.handleInputChange(event)}/>
                                        <div style={{height: 10}}/>
                                        <Input type="department" name="department" id="editDepartment"
                                               value={this.state.department.value}
                                               onChange={(event) => this.handleInputChange(event)}/>
                                        <div style={{height: 10}}/>
                                        <Input type="office" name="office" id="editOffice"
                                               value={this.state.office.value}
                                               onChange={(event) => this.handleInputChange(event)}/>
                                        {/*<Input type="worktimes" name="newWorktimes" id="editWorktimes"*/}
                                        {/*       value={this.state.newWorktimes.value}*/}
                                        {/*       onChange={(event) => this.handleInputChange(event)}/>*/}
                                        <div style={{marginTop:20,height:30}}>{this.state.user.workTimes.map(t => t.time).join()}</div>
                                        <div style={{marginTop:22,height:50}}>{formatDate(this.state.user.joinedAt)}</div>
                                        <div style={{height:50}}>{formatDate(this.state.user.birthday)}</div>
                                        <Input type="secretNote" name="secretNote" id="editSecretNote"
                                               value={this.state.secretNote.value}
                                               onChange={(event) => this.handleInputChange(event)}/>
                                        <div style={{marginTop:27}}>
                                            <Button color="primary" size="sm">
                                                Сохранить
                                            </Button>
                                        </div>
                                    </Col>
                                    {this.state.user.status === '0' && <TooltipWidgetHome/>}
                                    {this.state.user.status === '1' && <TooltipWidgetAtWork/>}
                                    {this.state.user.status === '2' && <TooltipWidgetIll/>}
                                    {this.state.user.status === '3' && <TooltipWidgetHoliday/>}
                                    <DropdownStatus/>
                                </Row>
                            </Col>
                        </Row>
                        </Form>
                    ): null
                }
            </div>
        );
    }
}

/*const DropdownStatus = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen(prevState => !prevState);*/

/*    let userStatus = '0';

    const changeTipToZero = () => userStatus = '0';
    const changeTipToOne = () => userStatus = '1';
    const changeTipToTwo = () => userStatus = '2';
    const changeTipToThree = () => userStatus = '3';*/

/*    return (
        <Dropdown isOpen={dropdownOpen} toggle={toggle} size='sm'>
            <DropdownToggle caret>
                Изменить статус
            </DropdownToggle>
            <DropdownMenu>
                <DropdownItem onClick={this.state.user.status = '0'}>Работает дома</DropdownItem>
                <DropdownItem onClick={this.state.user.status = '0'}>Работает в офисе</DropdownItem>
                <DropdownItem onClick={this.state.user.status = '0'}>На больничном</DropdownItem>
                <DropdownItem onClick={this.state.user.status = '0'}>В отпуске</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
}*/


export default ProfileEdit;