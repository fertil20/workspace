import React, {Component} from 'react';
import {getAllUsers} from "../util/APIUtils";
import NotFound from "../common/NotFound";
import ServerError from "../common/ServerError";
import {ListGroup, ListGroupItem, Button, Row, Input, Form, Col} from 'reactstrap';
import "./UsersAdminList.css";
import search from '../media/search.png'
import {
    TooltipWidgetAtWork,
    TooltipWidgetHoliday,
    TooltipWidgetHome,
    TooltipWidgetIll
} from "../user/profile/TooltipWidget";
import NavigationPanel from "../common/NavigationPanel";
//todo пофиксить отображение одинаковых статусов
class UsersAdminList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            CurUser: JSON.parse(localStorage.getItem('app')),
            user: null,
            isLoading: false,
            deleteUserID: '',
            FIO: {value:''}
        }
        this.loadAllUsers = this.loadAllUsers.bind(this);
        this.SetUserStatus = this.SetUserStatus.bind(this);
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
                <Row>
                    <NavigationPanel/>
                    <Col sm={{ size: 4.4 }} style={{backgroundColor: 'white',borderRadius:10,height:'auto',paddingBottom:20}}>
                <div>
                    <Form>
                        <Row style={{width:865}}>
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
                            <ListGroup horizontal className='table-top-line' key={"TABLE"} style={{marginLeft:5}}>
                                <ListGroupItem style={{width:200}} key={"FIO"}>Фио</ListGroupItem>
                                <ListGroupItem style={{width:70}} key={"STATUS"}><div style={{marginLeft:-10}}>Статус</div></ListGroupItem>
                                <ListGroupItem style={{width:150}} key={"POSITION"}>Должность</ListGroupItem>
                                <ListGroupItem style={{width:160}} key={"DEPARTMENT"}>Департамент</ListGroupItem>
                                <ListGroupItem style={{width:230}} key={"CONTACTS"}>Контактная информация</ListGroupItem>
                            </ListGroup>
                            {
                                this.state.user.map(
                                    user => //todo Пофиксить варнинг
                                        <div>
                                        <ListGroup horizontal="lg" key={user.id} style={{marginLeft:5}}>
                                            <ListGroupItem style={{width:200}} key={user.id+'.1'} tag = 'a' href={`/users/${user.username}`}>{user.name}</ListGroupItem>
                                            <ListGroupItem style={{width:70}} key={user.id+'.2'}>{this.SetUserStatus(user.status)}</ListGroupItem>
                                            <ListGroupItem style={{width:150}} key={user.id+'.3'}>{user.position}</ListGroupItem>
                                            <ListGroupItem style={{width:160}} key={user.id+'.4'}>{user.department}</ListGroupItem>
                                            <ListGroupItem style={{width:230}} key={user.id+'.5'}>{user.email}<br/>{user.phone}<br/>Telegram: @{user.tg}</ListGroupItem>
                                        </ListGroup>
                                        </div>
                                )
                            }
                        </div>
                    ):null
                }
                        {this.state.CurUser.currentUser.privileges.includes('Manage_Users') && <div>
                            <Button size="sm" href='/editUsers' style={{marginTop:10, marginLeft:10}} className='add-button'>
                                Редактировать
                            </Button>
                            <Button size="sm" href='/newUser' style={{marginTop:10, marginLeft:10}} className='add-button'>
                                Добавить сотрудника
                            </Button>
                        </div>}
                    </Col>
                </Row>
            </div>
        )
    }

    FindUser(FIO){
        console.log(FIO)
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
