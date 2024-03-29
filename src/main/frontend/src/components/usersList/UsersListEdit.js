import React, {Component} from 'react';
import {deleteUser, getAllUsers} from "../../util/APIUtils";
import NotFound from "../../common/NotFound";
import ServerError from "../../common/ServerError";
import {Button, Col, Form, Input, ListGroup, ListGroupItem, Row} from 'reactstrap';
import "./UsersList.css";
import search from '../../media/search.png'
import {
    TooltipWidgetAtWork,
    TooltipWidgetHoliday,
    TooltipWidgetHome,
    TooltipWidgetIll
} from "../../user/profile/TooltipWidget";
import NavigationPanel from "../navigation/NavigationPanel";

let userStatus = ''

class UsersListEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: false,
            deleteUserID: '',
            FIO: {value:''},
            CurUser: JSON.parse(localStorage.getItem('app'))
        }
        this.loadAllUsers = this.loadAllUsers.bind(this);
        this.SetUserStatus = this.SetUserStatus.bind(this);
        this.DeleteUser = this.DeleteUser.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.setUserStatus = this.setUserStatus.bind(this);
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

    setUserStatus(Status){
        if(Status === '0'){userStatus = 'работает дома'}
        if(Status === '1'){userStatus = 'работает в офисе'}
        if(Status === '2'){userStatus = 'на больничном'}
        if(Status === '3'){userStatus = 'в отпуске'}
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
            <Row>
                <NavigationPanel/>
                <Col sm={{ size: 4.4 }} style={{backgroundColor: 'white',borderRadius:10,overflow: 'auto', height:'100%',paddingBottom:20, width: '75%'}}>
                    <div>
                        <Form>
                            <Row style={{width:'auto', marginRight: '1%', marginLeft: '1%'}}>
                                <Input placeholder='Поиск'
                                       className='search-bar'
                                       id="FIO" name='FIO' type='text'
                                       value={this.state.FIO.value}
                                       onChange={(event) => {this.handleInputChange(event)}}
                                />
                                <img src={search} width={25} height={25} alt='Search' className='search-image'/>
                            </Row>
                        </Form>
                    </div>
                    {
                        this.state.user ? (
                            <div style={{marginRight: '1%', marginLeft: '1%', overflowX: 'auto'}}>
                                <ListGroup horizontal className='table-top-line' key={"TABLE"}>
                                    <ListGroupItem style={{width:'25%', overflowX: 'auto'}} key={"FIO"}>Фио</ListGroupItem>
                                    <ListGroupItem style={{width:'9%', overflowX: 'auto'}} key={"STATUS"}><div style={{marginLeft:-10}}>Статус</div></ListGroupItem>
                                    <ListGroupItem style={{width:'18%', overflowX: 'auto'}} key={"POSITION"}>Должность</ListGroupItem>
                                    <ListGroupItem style={{width:'19%', overflowX: 'auto'}} key={"DEPARTMENT"}>Департамент</ListGroupItem>
                                    <ListGroupItem style={{width:'29%', overflowX: 'auto'}} key={"CONTACTS"}>Контактная информация</ListGroupItem>
                                </ListGroup>
                                {
                                    this.state.user.map(
                                        user => //todo Пофиксить варнинг
                                            ( this.setUserStatus(user.status.toLowerCase()) ||
                                                (user.name.toLowerCase().indexOf(this.state.FIO.value.toLowerCase()) !== -1)
                                                || (user.position.toLowerCase().indexOf(this.state.FIO.value.toLowerCase()) !== -1)
                                                || (user.department.toLowerCase().indexOf(this.state.FIO.value.toLowerCase()) !== -1)
                                                || (user.email.toLowerCase().indexOf(this.state.FIO.value.toLowerCase()) !== -1)
                                                || (user.tg.toLowerCase().indexOf(this.state.FIO.value.toLowerCase()) !== -1)
                                                || (user.phone.toLowerCase().indexOf(this.state.FIO.value.toLowerCase()) !== -1)
                                                || (userStatus.toLowerCase().indexOf(this.state.FIO.value.toLowerCase()) !== -1))  &&
                                            <div>
                                                <ListGroup horizontal key={user.id}>
                                                    <ListGroupItem style={{width:'25%', overflowX: 'auto'}} key={user.id+'.1'} tag = 'a' href={`/users/${user.username}`}>{user.name}</ListGroupItem>
                                                    <ListGroupItem style={{width:'9%', overflowX: 'auto'}} key={user.id+'.2'}>{this.SetUserStatus(user.status)}</ListGroupItem>
                                                    <ListGroupItem style={{width:'18%', overflowX: 'auto'}} key={user.id+'.3'}>{user.position}</ListGroupItem>
                                                    <ListGroupItem style={{width:'19%', overflowX: 'auto'}} key={user.id+'.4'}>{user.department}</ListGroupItem>
                                                    <ListGroupItem style={{width:'29%', overflowX: 'auto'}} key={user.id+'.5'}>{user.email}<br/>{user.phone}<br/>Telegram: @{user.tg}
                                                        {user.username !== this.state.CurUser.currentUser.username && <Button size='sm' color='danger' style={{height:30, marginTop:5}} key={user.id+'.6'} onClick={() => this.DeleteUser(user.id)}>Удалить сотрудника</Button>}
                                                    </ListGroupItem>
                                                </ListGroup>
                                            </div>
                                    )
                                }
                            </div>
                        ):null
                    }
                    <Button size="sm" href='/users' style={{marginTop:10, marginLeft:10}} className='add-button'>
                        Выйти из редактирования
                    </Button>
                    <Button size="sm" href='/newUser' style={{marginTop:10, marginLeft:10}} className='add-button'>
                        Добавить сотрудника
                    </Button>
                </Col>
            </Row>
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
                this.componentDidMount(UsersListEdit);//todo разобраться с unmount и update
            })
            .catch(error => {
                if (error.status === 403) {
                    alert('Упс, кажется у вас недостаточно прав');
                } else {
                    alert('Что-то пошло не так');
                }
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

export default UsersListEdit
