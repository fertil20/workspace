import NotFound from '../../common/NotFound';
import ServerError from '../../common/ServerError';
import {
    Row,
    Col,
    Button, Modal, ModalHeader, ModalBody, ModalFooter,
    FormGroup,
    Form,
    Input,
    Dropdown, DropdownToggle, DropdownMenu, DropdownItem, ListGroup, ListGroupItem
} from 'reactstrap';
import React, {Component, useState} from "react";
import {addNewRole, getAllRoles, getAllUsers, getUserProfile, profileEdit} from "../../util/APIUtils";
import './RoleManager.css';


class RoleManager extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
        this.state = {
            user: null,
            isLoading: false,
            role: {value: ''},
            toggle: false,
            roles: ''
        }
        this.loadRoles = this.loadRoles.bind(this);
        //this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.changeToggle = this.changeToggle.bind(this);
        this.roleAddSubmit = this.roleAddSubmit.bind(this);
    }

    loadRoles(){
        this._isMounted && this.setState({
                    isLoading: true
                });
        getAllRoles()
            .then(response => {
                this._isMounted && this.setState({
                    roles: response,
                    isLoading: false
                });
            }).catch(error => {
            if(error.status === 404) {
                this._isMounted && this.setState({
                    notFound: true,
                    isLoading: false
                });
            } else {
                this._isMounted && this.setState({
                    serverError: true,
                    isLoading: false
                });
            }
        });
    }
    // loadUserProfile(username) {
    //     this._isMounted && this.setState({
    //         isLoading: true
    //     });
    //
    //     getUserProfile(username)
    //         .then(response => {
    //             this._isMounted && this.setState({
    //                 user: response,
    //                 isLoading: false,
    //             });
    //             this._isMounted && this.setState({
    //                 email: {value: this.state.user.email},
    //                 phone: {value: this.state.user.phone},
    //                 tg: {value: this.state.user.tg},
    //                 name: {value: this.state.user.name},
    //                 about: {value: this.state.user.about},
    //                 position: {value: this.state.user.position},
    //                 department: {value: this.state.user.department},
    //                 office: {value: this.state.user.office},
    //                 startAt: {value: this.state.user.startAt},
    //                 endAt: {value: this.state.user.endAt},
    //                 //newWorktimes: {value: this.state.user.newWorktimes},
    //                 secretNote: {value: this.state.user.secretNote},
    //                 status: {value: this.state.user.status},
    //                 statusTimeStart: {value: this.state.statusTimeStart},
    //                 statusTimeFinish: {value: this.state.statusTimeFinish}
    //             })
    //         }).catch(error => {
    //         if(error.status === 404) {
    //             this._isMounted && this.setState({
    //                 notFound: true,
    //                 isLoading: false
    //             });
    //         } else {
    //             this._isMounted && this.setState({
    //                 serverError: true,
    //                 isLoading: false
    //             });
    //         }
    //     });
    // }
    //
    componentDidMount() {
        this._isMounted = true;
        this._isMounted && this.loadRoles();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
/*
    componentDidUpdate(prevProps) {
        if(this.props.match.params.toggle !== prevProps.match.params.toggle) {
            this.loadRoles();
            this.changeToggle();
        }
    }*/

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

    roleAddSubmit(event){
        event.preventDefault();

        const addNewRoleRequest = {
            name: this.state.role.value
        };
        addNewRole(addNewRoleRequest)
                .then(response => {
                    alert('Новая роль добавлена.');
                    this.loadRoles()
                })
                .catch(error => {
                    alert('Что-то пошло не так.');
                });
        this.changeToggle()
    }

    // handleSubmit(event) {
    //     event.preventDefault();
    //
    //     const profileEditRequest = {
    //         email: this.state.email.value,
    //         phone: this.state.phone.value,
    //         tg: this.state.tg.value,
    //         name: this.state.name.value,
    //         about: this.state.about.value,
    //         position: this.state.position.value,
    //         department: this.state.department.value,
    //         office: this.state.office.value,
    //         startAt: this.state.startAt.value,
    //         endAt: this.state.endAt.value,
    //         secretNote: this.state.secretNote.value,
    //         status: this.state.status.value, // Статус работы (0,1,2,3)
    //         statusTimeStart: this.state.statusTimeStart.value,
    //         statusTimeFinish: this.state.statusTimeFinish.value
    //     };
    //     profileEdit(profileEditRequest, this.state.user.username)
    //         .then(response => {
    //             alert('Данные успешно изменены.');
    //             this.props.history.push(`/users/${this.state.user.username}`);
    //         })
    //         .catch(error => {
    //             alert('Что-то пошло не так.');
    //         });
    // }
    changeToggle(){
        if (this.state.toggle === true){this.setState({toggle: false})}
        if (this.state.toggle === false){this.setState({toggle: true})}
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

        return (
            <div className="profile"  >
                <Row>
                    <Col sm={{ size: 3 }} style={{backgroundColor: 'white',borderRadius:10,height:500}}>
                        <div className="column1-title">Группа доступа</div>
                        <Button outline color="primary" size='sm' className="button-group" onClick={this.changeToggle}>+ Добавить группу доступа</Button>
                        <div>
                            <Modal isOpen={this.state.toggle} toggle={this.changeToggle}>
                                <ModalHeader toggle={this.changeToggle}>Добавить новую роль</ModalHeader>
                                <ModalBody>
                                    <Input type="text" name="role" id="role" placeholder='Введите название роли'
                                           value={this.state.role.value}
                                           onChange={(event) => this.handleInputChange(event)}
                                    />
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" onClick={this.changeToggle}>Отмена</Button>{' '}
                                    <Button color="primary" onClick={this.roleAddSubmit}>Добавить</Button>
                                </ModalFooter>
                            </Modal>
                        </div>
{/*                        <div><Button outline color="primary" size='sm' className='button-text'>Администратор</Button></div>
                        <div><Button outline color="primary" size='sm' className='button-text'>Сотрудник</Button></div>*/}
                        {
                            this.state.roles ? (
                                <div>
                                    {
                                        this.state.roles.map(
                                            roles => //todo Пофиксить варнинг
                                                <div><Button outline color="primary" size='sm' className='button-text'>{roles.name}</Button></div>
                                        )
                                    }
                                </div>
                            ):null
                        }
                    </Col>
                    <Col sm={{ size: 5 ,offset:1}} style={{backgroundColor: 'white',borderRadius:10,height:500}}>
                        <div className="column2-title">Пользователи</div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default RoleManager;