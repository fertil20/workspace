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

class UsersAdminList extends Component {
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
        this._isMounted && this.loadAllUsers();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

/*    componentDidUpdate(prevState) {
        if(this.state.deleteUserID !== prevState.deleteUserID) {
            this.loadAllUsers();
        }
    }*/

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
                        <Button size='sm' className='add-button' href='/newUser'>Добавить сотрудника</Button>
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
                                            <ListGroupItem style={{width:150}} key={user.id+'.3'}>{user.position}</ListGroupItem>
                                            <ListGroupItem style={{width:170}} key={user.id+'.4'}>{user.department}</ListGroupItem>
                                            <ListGroupItem style={{width:300}} key={user.id+'.5'}>{user.email}<br/>{user.phone}<br/>@{user.tg}</ListGroupItem>
                                            <Button size='sm' color='danger' style={{height:30, marginTop:30, marginLeft:10}} key={user.id+'.6'} onClick={() => this.DeleteUser(user.id)}>Удалить</Button>
                                        </ListGroup>
                                        </div>
                                )
                            }
                        </div>
                    ):null
                }
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
                this.componentDidMount(UsersAdminList);//todo разобраться с unmount и update
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

export default UsersAdminList
