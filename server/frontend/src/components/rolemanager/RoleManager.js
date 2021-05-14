import NotFound from '../../common/NotFound';
import ServerError from '../../common/ServerError';
import {
    Row,
    Col,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    ListGroup,
    ListGroupItem,
    ButtonDropdown,
    NavItem,
    Nav,
    NavLink,
    TabContent, TabPane, FormGroup, Form
} from 'reactstrap';
import classnames from 'classnames';
import React, {Component} from "react";
import {
    addNewRole, addUserToRole, deleteRole, deleteUserFromRole, editRolePrivileges,
    getAllRoles, getRolePrivileges,
    getRoleUsers,
    getUsersWithoutRole,
} from "../../util/APIUtils";
import './RoleManager.css';
import NavigationPanel from "../navigation/NavigationPanel";

let UsersByRole = ''
let UsersWithoutRole = ''
let CurrentRole = ''
let CheckBoxAble = true

class RoleManager extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
        this.state = {
            user: null,
            isLoading: false,
            role: {value: ''},
            toggle: false,
            roles: '',
            usersByRole: '',
            toggleDropDown: false,
            activeTab: '1',
            setActiveTab: '1',
            rolePrivileges: [],
        }
        this.loadRoles = this.loadRoles.bind(this);
        this.showUsersByRole = this.showUsersByRole.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.changeToggle = this.changeToggle.bind(this);
        this.roleAddSubmit = this.roleAddSubmit.bind(this);
        this.changeToggleDropDown = this.changeToggleDropDown.bind(this);
        this.getUsersWithoutRole = this.getUsersWithoutRole.bind(this);
        this.addUserToRoleByUsername = this.addUserToRoleByUsername.bind(this);
        this.getListOfRolePrivileges = this.getListOfRolePrivileges.bind(this);
        this.handleCheckBoxState = this.handleCheckBoxState.bind(this);
        this.loadRolePrivileges = this.loadRolePrivileges.bind(this);
        this.deleteUserFromRoleByUsername = this.deleteUserFromRoleByUsername.bind(this);
        this.deleteRoleByRoleName = this.deleteRoleByRoleName.bind(this);
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
                    alert('Новая группа добавлена.');
                    this.loadRoles()
                })
                .catch(error => {
                    alert('Что-то пошло не так.');
                });
        this.changeToggle()
    }

    addUserToRoleByUsername(roleName,username) {
        this.setState({toggleDropDown: false})
        addUserToRole(roleName,username)
            .then(response => {
                this._isMounted && this.setState({
                    isLoading: false
                });
                this.showUsersByRole(roleName)
            })
            .catch(error => {
                if(error.status === 404) {
                    this._isMounted && this.setState({
                        notFound: true,
                        isLoading: false
                    });
                    alert('Что-то пошло не так')
                } else {
                    this._isMounted && this.setState({
                        serverError: true,
                        isLoading: false
                    });
                }
            });
    }

    deleteUserFromRoleByUsername(roleName,username){
        deleteUserFromRole(roleName,username)
            .then(response => {
                this._isMounted && this.setState({
                    isLoading: false
                });
                this.showUsersByRole(roleName);
            })
            .catch(error => {
                if(error.status === 404) {
                    this._isMounted && this.setState({
                        notFound: true,
                        isLoading: false
                    });
                    alert('Что-то пошло не так')
                } else {
                    this._isMounted && this.setState({
                        serverError: true,
                        isLoading: false
                    });
                }
            });
    }

    getUsersWithoutRole(roleName){
        this.setState({toggleDropDown: false})
        getUsersWithoutRole(roleName)
            .then(response => {
                this._isMounted && this.setState({
                    users: response,
                    isLoading: false
                });
                UsersWithoutRole = <div>
                    {
                        this.state.users ? (
                        <DropdownMenu>
                                {
                                    this.state.users.map(
                                        users =>
                                            <DropdownItem onClick={() => this.addUserToRoleByUsername(roleName,users.username)}>{users.name}</DropdownItem>
                                    )
                                }
                        </DropdownMenu>
                        ):null
                    }
                </div>
                this.setState({})
            })
            .catch(error => {
                if(error.status === 404) {
                    this._isMounted && this.setState({
                        notFound: true,
                        isLoading: false
                    });
                    alert('Что-то пошло не так')
                } else {
                    this._isMounted && this.setState({
                        serverError: true,
                        isLoading: false
                    });
                }
            });
    }

    getListOfRolePrivileges(roleName){
        getRolePrivileges(roleName)
            .then(response => {
                this._isMounted && this.setState({
                    rolePrivileges: response,
                    isLoading: false
                });
                this.loadRolePrivileges(this.state.rolePrivileges);
            })

    }

    loadRolePrivileges(rolePrivileges){
        document.querySelector('.manageUsersCheckbox').checked = !!rolePrivileges.includes('Manage_Users');
        document.querySelector('.manageRolesCheckbox').checked = !!rolePrivileges.includes('Manage_Roles');
        document.querySelector('.viewSecretCheckbox').checked = !!rolePrivileges.includes('View_Secret');
        document.querySelector('.editUsersCheckbox').checked = !!rolePrivileges.includes('Edit_Users');
        document.querySelector('.manageNewsCheckbox').checked = !!rolePrivileges.includes('Manage_News');
        document.querySelector('.editAboutCheckbox').checked = !!rolePrivileges.includes('Edit_About');
    }

    showUsersByRole(roleName){
        this.getUsersWithoutRole(roleName);
        this.getListOfRolePrivileges(roleName);
        if((roleName === 'Администратор') ||(roleName === 'Пользователь')){CheckBoxAble=false}else{CheckBoxAble=true}
        console.log(CheckBoxAble)
        CurrentRole = roleName;
        getRoleUsers(roleName)
            .then(response => {
                this._isMounted && this.setState({
                    usersByRole: response,
                    isLoading: false
                });
                UsersByRole = <div>
                    {
                        this.state.usersByRole ? (
                            <div>
                                {
                                    this.state.usersByRole.map(
                                        usersByRole =>
                                            <ListGroup horizontal="lg" style={{border:0,marginLeft:15}}>
                                                <ListGroupItem style={{width:205}}  tag = 'a' href={`/users/${usersByRole.username}`}>{usersByRole.name}</ListGroupItem>
                                                <ListGroupItem style={{width:205}} >{usersByRole.position}</ListGroupItem>
                                                {((roleName === 'Пользователь') || (roleName ==='Администратор')) && <ListGroupItem style={{width:100}} ><Button disabled size='sm' color='danger'>Удалить</Button></ListGroupItem>}
                                                {(roleName !== 'Пользователь') && (roleName !== 'Администратор') && <ListGroupItem style={{width:100}} ><Button size='sm' color='danger' onClick={()=>{this.deleteUserFromRoleByUsername(roleName,usersByRole.username)}}>Удалить</Button></ListGroupItem>}
                                            </ListGroup>
                                    )
                                }
                            </div>
                        ):null
                    }
                </div>
                this.setState({})
            })
            .catch(error => {
            if(error.status === 404) {
                this._isMounted && this.setState({
                    notFound: true,
                    isLoading: false
                });
                alert('Что-то пошло не так')
            } else {
                this._isMounted && this.setState({
                    serverError: true,
                    isLoading: false
                });
            }
        });
    }

    deleteRoleByRoleName(roleName){
        deleteRole(roleName)
            .then(response =>{
                CurrentRole = ''
                UsersByRole = ''
                this.loadRoles()
                }
            )
            .catch(error => {
                if(error.status === 404) {
                    this._isMounted && this.setState({
                        notFound: true,
                        isLoading: false
                    });
                    alert('Что-то пошло не так')
                } else {
                    this._isMounted && this.setState({
                        serverError: true,
                        isLoading: false
                    });
                }
            });
    }

    handleCheckBoxState(event){
        const target = event.target;
        const inputName = target.name;
        if(event.target.checked){
            this.state.rolePrivileges.push(inputName)
        }
        else{
            let index = this.state.rolePrivileges.indexOf(inputName)
            if (index !== -1) {
                this.state.rolePrivileges.splice(index, 1);
            }
        }
        editRolePrivileges(this.state.rolePrivileges,CurrentRole)
            .then(response => {
            })
            .catch(error => {
                if(error.status === 404) {
                    this._isMounted && this.setState({
                        notFound: true,
                        isLoading: false
                    });
                    alert('Что-то пошло не так')
                } else {
                    this._isMounted && this.setState({
                        serverError: true,
                        isLoading: false
                    });
                }
            });
    }

    changeToggle(){
        if (this.state.toggle === true){this.setState({toggle: false})}
        if (this.state.toggle === false){this.setState({toggle: true})}
        this.setState({role:{value:''}})
    }

    changeToggleDropDown(){
        if (this.state.toggleDropDown === true){this.setState({toggleDropDown: false})}
        if (this.state.toggleDropDown === false){this.setState({toggleDropDown: true})}
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
                    <NavigationPanel/>
                    <Col sm={{ size: 3.3 }} style={{backgroundColor: 'white',borderRadius:10,height:285}}>
                        <div className="column1-title">Группа доступа</div>
                        <Button outline color="primary" size='sm' className="button-group" onClick={this.changeToggle}>+ Добавить группу доступа</Button>
                        <div>
                            <Modal isOpen={this.state.toggle} toggle={this.changeToggle}>
                                <ModalHeader toggle={this.changeToggle}>Добавить новую группу</ModalHeader>
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
                        {
                            this.state.roles ? (
                                <div>
                                    {
                                        this.state.roles.map(
                                            roles =>
                                                <Row>
                                                    <Col>
                                                <Button outline color="primary" size='sm' className='button-text' onClick={() => this.showUsersByRole(roles.name)}>{roles.name}</Button>
                                                    </Col>
                                                    <Col>
                                                        {((roles.name === 'Пользователь') || (roles.name === 'Администратор'))&& <Button disabled size='sm' outline color='danger' className='button-text'>Удалить</Button>}
                                                        {((roles.name !== 'Пользователь') && (roles.name !== 'Администратор'))&& <Button size='sm' outline color='danger' className='button-text' onClick={()=> this.deleteRoleByRoleName(roles.name)}>Удалить</Button>}
                                                    </Col>
                                                </Row>
                                        )
                                    }
                                </div>
                            ):null
                        }
                    </Col>
                    <Col sm={{ size: 5.6}} style={{backgroundColor: 'white',borderRadius:10,height:500,marginLeft:30}}>
                        <Nav tabs>
                            <NavItem style={{width:270}}>
                                <NavLink className={classnames({ active: this.state.activeTab === '1' })} onClick={() => this.setState({activeTab: '1'})} style={{cursor:'pointer'}}>
                                    <div className="column2-title">Пользователи</div>
                                </NavLink>
                            </NavItem>
                            <NavItem style={{width:270}}>
                                <NavLink className={classnames({ active: this.state.activeTab === '2' })} onClick={() => this.setState({activeTab: '2'})} style={{cursor:'pointer'}}>
                                    <div className="column2-title">Права доступа</div>
                                </NavLink>
                            </NavItem>
                        </Nav>
                            <TabContent activeTab={this.state.activeTab}>
                                <TabPane tabId="1">
                                    <ButtonDropdown isOpen={this.state.toggleDropDown} toggle={this.changeToggleDropDown} style={{marginBottom:10, marginRight:340}}>
                                        {((CurrentRole === 'Пользователь') || (CurrentRole ==='Администратор')) && <DropdownToggle disabled caret outline color="primary" size='sm' className='button-text'>
                                            + Добавить пользователя
                                        </DropdownToggle>}
                                        {((CurrentRole !== 'Пользователь') && (CurrentRole !=='Администратор')) && <DropdownToggle caret outline color="primary" size='sm' className='button-text'>
                                            + Добавить пользователя
                                        </DropdownToggle>}
                                        {UsersWithoutRole}
                                    </ButtonDropdown>
                                    {CurrentRole === '' && <div style={{margin:10,fontWeight:"bold"}}>Выберите группу доступа</div>}
                                    {CurrentRole !== '' && <div style={{margin:10,fontWeight:"bold"}}>Пользователи с группой доступа <a style={{color:'#5380B7'}}>{CurrentRole}</a></div>}
                                    {UsersByRole}
                                </TabPane>
                                <TabPane tabId="2">
                                    {CurrentRole === '' && <div style={{margin:10,fontWeight:"bold"}}>Выберите группу доступа</div>}
                                    {CurrentRole !== '' && <div style={{margin:10,fontWeight:"bold"}}>Права группы доступа <a style={{color:'#5380B7'}}>{CurrentRole}</a></div>}
                                    {CurrentRole !=='' &&
                                    <Row>
                                        <Col >
                                            <div className='role-column1'>Управление пользователями
                                                <Input disabled={!CheckBoxAble} className='manageUsersCheckbox' type ='checkbox'  style={{right:25}} name='Manage_Users'
                                                       onChange={(event)=> {this.handleCheckBoxState(event)}}
                                                />
                                            </div>
                                            <div className='role-column'>Управление ролями
                                                <Input disabled={!CheckBoxAble} className='manageRolesCheckbox' type ='checkbox' style={{right:25}} name='Manage_Roles'
                                                       onChange={(event)=> {this.handleCheckBoxState(event)}}
                                                />
                                            </div>
                                            <div className='role-column'>Просмотр карточки сотрудника
                                                <Input disabled={!CheckBoxAble} className='viewSecretCheckbox' type ='checkbox' style={{right:25}} name='View_Secret'
                                                       onChange={(event)=> {this.handleCheckBoxState(event)}}
                                                />
                                            </div>
                                            <div className='role-column'>Редактирование карточек сотрудников
                                                <Input disabled={!CheckBoxAble} className='editUsersCheckbox' type ='checkbox' style={{right:25}} name='Edit_Users'
                                                       onChange={(event)=> {this.handleCheckBoxState(event)}}
                                                />
                                            </div>
                                            <div className='role-column'>Курирование новостей
                                                <Input disabled={!CheckBoxAble} className='manageNewsCheckbox' type ='checkbox' style={{right:25}} name='Manage_News'
                                                       onChange={(event)=> {this.handleCheckBoxState(event)}}
                                                />
                                            </div>
                                            <div className='role-column'>Редактирование контента "О компании"
                                                <Input disabled={!CheckBoxAble} className='editAboutCheckbox' type ='checkbox' style={{right:25}} name='Edit_About'
                                                       onChange={(event)=> {this.handleCheckBoxState(event)}}
                                                />
                                            </div>
                                        </Col>
                                    </Row>}
                                </TabPane>
                            </TabContent>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default RoleManager;