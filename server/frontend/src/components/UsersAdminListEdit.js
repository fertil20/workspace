import React, {Component} from 'react';
import {deleteUser, getAllUsers} from "../util/APIUtils";
import NotFound from "../common/NotFound";
import ServerError from "../common/ServerError";
import {ListGroup, ListGroupItem, Button, Row, Input, Form} from 'reactstrap';
import "./UsersAdminList.css";
import search from '../media/search.png'
import {
    TooltipWidgetAtWork,
    TooltipWidgetHoliday,
    TooltipWidgetHome,
    TooltipWidgetIll
} from "../user/profile/TooltipWidget";

class UsersAdminListEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: false,
            deleteUserID: '',
            FIO: {value:''}
        }
        this.loadAllUsers = this.loadAllUsers.bind(this);
        this.SetUserStatus = this.SetUserStatus.bind(this);
        this.DeleteUser = this.DeleteUser.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.FindUser = this.FindUser.bind(this);
    }

    loadAllUsers(id) {
        this._isMounted && this.setState({
            isLoading: true
        });

        getAllUsers(id)
            .then(response => {
                this._isMounted && this.setState({
                    user: response,
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

    componentDidMount() {
        this._isMounted = true;
        this._isMounted && this.loadAllUsers(this.props.match.params.id);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidUpdate(prevProps) {
        if(this.props.match.params.id !== prevProps.match.params.id) {
            this.loadUserProfile(prevProps.match.params.id);
        }
    }

    render (){
        if(this.state.isLoading) {
            return <div className="text-center">
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        }

        if(this.state.notFound) {
            return <NotFound/>;
        }

        if(this.state.serverError) {
            return <ServerError/>;
        }

        return (
            <div>
                <div>
                    <Row>
                        <p className="gray-text">Администрирование</p>
                    </Row>
                </div>
                <div>
                    <Form>
                        <Row>
                            <Input placeholder='Ф.И.О.'
                                   className='search-bar'
                                   id="FIO" name='FIO' type='text'
                                   value={this.state.FIO.value}
                                   onChange={(event) => {this.handleInputChange(event)}}
                            />
                            <Button size='sm' className='search-button' onClick={() => this.FindUser(this.state.FIO.value)}><img src={search} width={25} height={25} alt='Search'/></Button>
                        </Row>
                    </Form>
                </div>
                {
                    this.state.user ? (
                        <div>
                            <ListGroup horizontal className='table-top-line' key={"TABLE"}>
                                <ListGroupItem style={{width:250}} key={"FIO"}>Фио</ListGroupItem>
                                <ListGroupItem style={{width:100}} key={"STATUS"}>Статус</ListGroupItem>
                                <ListGroupItem style={{width:150}} key={"POSITION"}>Должность</ListGroupItem>
                                <ListGroupItem style={{width:170}} key={"DEPARTMENT"}>Департамент</ListGroupItem>
                                <ListGroupItem style={{width:300}} key={"CONTACTS"}>Контактная информация</ListGroupItem>
                            </ListGroup>
                            {
                                this.state.user.map(
                                    user => //todo Пофиксить варнинг
                                        <div>
                                            <ListGroup horizontal="lg" key={user.id}>
                                                <ListGroupItem style={{width:250}} key={user.id+'.1'} tag = 'a' href={`/users/${user.username}`}>{user.name}</ListGroupItem>
                                                <ListGroupItem style={{width:100}} key={user.id+'.2'}>{this.SetUserStatus(user.status)}</ListGroupItem>
                                                <ListGroupItem style={{width:150}} key={user.id+'.3'}>
                                                    <Input type='text' name='position' id='position'
                                                           value={user.position}
                                                           onChange={(event) => this.handleInputChange(event)}/></ListGroupItem>
                                                <ListGroupItem style={{width:170}} key={user.id+'.4'}>
                                                    <Input type='text' name='position' id='position'
                                                           value={user.department}
                                                           onChange={(event) => this.handleInputChange(event)}/></ListGroupItem>
                                                <ListGroupItem style={{width:300}} key={user.id+'.5'}>
                                                    <Input type='text' name='position' id='position'
                                                           value={user.email}
                                                           onChange={(event) => this.handleInputChange(event)}/>
                                                    <Input type='text' name='position' id='position'
                                                           value={user.phone}
                                                           onChange={(event) => this.handleInputChange(event)}/>
                                                    <Input type='text' name='position' id='position'
                                                           value={user.tg}
                                                           onChange={(event) => this.handleInputChange(event)}/></ListGroupItem>
                                                <Button size='sm' color='danger' style={{height:30, marginTop:30, marginLeft:10}} key={user.id+'.6'} onClick={() => this.DeleteUser(user.id)}>Удалить</Button>
                                            </ListGroup>
                                        </div>
                                )
                            }
                        </div>
                    ):null
                }
                <Button size="sm" href='/users' style={{marginTop:10, marginLeft:10}} className='add-button'>
                    Сохранить
                </Button>
                <Button size="sm" href='/newUser' style={{marginTop:10, marginLeft:10}} className='add-button'>
                    Добавить сотрудника
                </Button>
            </div>
        )
    }

    FindUser(FIO){
        console.log(FIO)
    }

    DeleteUser(userID){
        this.setState({deleteUserID: userID})
        deleteUser(userID)
            .then(response => {
                alert('Пользователь удалён');
                this.componentDidMount(UsersAdminListEdit);//todo разобраться с unmount и update
            })
            .catch(error => {
                alert('Что-то пошло не так');
            });
    }
    SetUserStatus(userStatus){
        if(userStatus === '0'){
            return <TooltipWidgetHome/>
        }
        if(userStatus === '1'){
            return <TooltipWidgetAtWork/>
        }
        if(userStatus === '2'){
            return <TooltipWidgetIll/>
        }
        if(userStatus === '3'){
            return <TooltipWidgetHoliday/>
        }
    }
}

export default UsersAdminListEdit
