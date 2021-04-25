import { getAvatarColor } from '../../util/Colors';
import {formatDate, formatFullTime, formatTime} from '../../util/Helpers';
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
    Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';
import {TooltipWidgetHome,TooltipWidgetAtWork, TooltipWidgetHoliday, TooltipWidgetIll} from './TooltipWidget'
import {Avatar} from "antd";
import React, {Component, useState} from "react";
import {getUserProfile, profileEdit} from "../../util/APIUtils";
import './ProfileEdit.css';

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
            startAt:{value:''},
            endAt:{value:''},
            // newWorktimes:{value:''},
            secretNote:{value:''},
            status:{value:''},
            statusTimeStart:{value:''},
            statusTimeFinish:{value:''}
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
            startAt: formatFullTime(this.state.startAt.value + ":00"),
            endAt: formatFullTime(this.state.endAt.value + ":00"),
            // newWorktimes: this.state.newWorktimes.value,
            secretNote: this.state.secretNote.value,
            status: this.state.status.value, // Статус работы (0,1,2,3)
            statusTimeStart: this.state.statusTimeStart.value,
            statusTimeFinish: this.state.statusTimeFinish.value
        };
        profileEdit(profileEditRequest, this.state.user.username)
            .then(response => {
                alert('Данные успешно изменены.');
                this.props.history.push(`/users/${this.state.user.username}`);
            })
            .catch(error => {
                alert('Что-то пошло не так.');
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

        if (flag === 1){
            if (this.state.user != null){
                this.setState({
                    email: {value: this.state.user.email},
                    phone: {value: this.state.user.phone},
                    tg: {value: this.state.user.tg},
                    name: {value: this.state.user.name},
                    about: {value: this.state.user.about},
                    position: {value: this.state.user.position},
                    department: {value: this.state.user.department},
                    office: {value: this.state.user.office},
                    startAt: {value: this.state.user.startAt},
                    endAt: {value: this.state.user.endAt},
                    //newWorktimes: {value: this.state.user.newWorktimes},
                    secretNote: {value: this.state.user.secretNote},
                    status: {value: this.state.user.status},
                    statusTimeStart: {value: this.state.statusTimeStart},
                    statusTimeFinish: {value: this.state.statusTimeFinish}
                })

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
                status(state) {
                    this.state.user.status = state;
                    this.setState({status: {value: state}});
/*                    this.state.user.status = a;
                    this.state.status.value = a;*/
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
                            <Col sm={{ size: 5, offset: 1}} style={{backgroundColor: '#EDEEF0',borderRadius:10,height:500}}>
                                <Row>
                                    <Col>
                                        <div style={{color: 'gray', marginTop:20, fontWeight: 'bold',height: 50}}>Ф.И.О:</div>
                                        <div style={{color: 'gray', fontWeight: 'bold',height: 50}}>О себе:</div>
                                        <div style={{color: 'gray', marginTop:30, fontWeight: 'bold',height: 50}}>Должность:</div>
                                        <div style={{color: 'gray', fontWeight: 'bold',height: 50}}>Департамент:</div>
                                        <div style={{color: 'gray', fontWeight: 'bold',height: 50}}>Офис:</div>
                                        <div style={{color: 'gray', fontWeight: 'bold',height: 50}}>Рабочие часы:</div>
                                        <div style={{color: 'gray', fontWeight: 'bold',height: 50}}>В компании с:</div>
                                        <div style={{color: 'gray', fontWeight: 'bold',height: 50}}>Дата рождения:</div>
                                        <div style={{color: 'gray', fontWeight: 'bold',height: 50}}>Секретная заметка:</div>
                                    </Col>
                                    <Col>
                                        <div style={{height: 10}}/>
                                        <Input type="text" name="name" id="editName" placeholder={"Попов Валерий Александрович"}
                                               value={this.state.name.value}
                                               onChange={(event) => this.handleInputChange(event)}/>
                                        <div style={{height: 10}}/>
                                        <Input type="textarea" name="about" id="editAbout"
                                               value={this.state.about.value}
                                               onChange={(event) => this.handleInputChange(event)}/>
                                        <div style={{height: 10}}/>
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
                                        {/*<Input type="worktimes" name="newWorktimes" id="editWorktimes"*/}
                                        {/*       value={this.state.newWorktimes.value}*/}
                                        {/*       onChange={(event) => this.handleInputChange(event)}/>*/}
                                        <div style={{height: 10}}/>
                                        <Row>
                                        <Input type="time" name="startAt" id="startAt" style={{ width:"100px" }}
                                               value={formatTime(this.state.startAt.value)}
                                               required
                                               pattern="[0-9]{2}:[0-9]{2}"
                                               onChange={(event) => this.handleInputChange(event)}/>
                                        <Input type="time" name="endAt" id="endAt" style={{ width:"100px" }}
                                               value={formatTime(this.state.endAt.value)}
                                               required
                                               pattern="[0-9]{2}:[0-9]{2}"
                                               onChange={(event) => this.handleInputChange(event)}/>
                                        </Row>
                                        <div style={{marginTop:22,height:50}}>{formatDate(this.state.user.joinedAt)}</div>
                                        <div style={{height:50}}>{formatDate(this.state.user.birthday)}</div>
                                        <Input type="text" name="secretNote" id="editSecretNote"
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
                                </Row>
                            </Col>
                            <DropdownStatus/>
                        </Row>
                        </Form>
                    ): null
                }
            </div>
        );
    }
}

export default ProfileEdit;