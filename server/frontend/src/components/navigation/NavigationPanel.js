import React, {Component} from "react";
import {Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row} from 'reactstrap';
import './NavigationPanel.css';
import {Link} from "react-router-dom";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import calendar1 from './NavigationPanel.css'
import interactionPlugin from "@fullcalendar/interaction";
import {getMeetings, getUserEvents} from "../../util/APIUtils";

let EventName = ''
let EventBody = ''

export default class NavigationPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: JSON.parse(localStorage.getItem('app')),
            events: [],
            toggleEvent: false
        }
        this.loadMeetingsByUsername = this.loadMeetingsByUsername.bind(this);
        this.showEventDetails = this.showEventDetails.bind(this);
        this.changeEventToggle = this.changeEventToggle.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        this.loadMeetingsByUsername()
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    loadMeetingsByUsername(){

        getUserEvents(this.state.user.currentUser.username)
            .then(response => {
                console.log(response)
                this._isMounted && this.setState({events: response})
            })
            .catch(error => {
                alert('Что-то пошло не так.');
            });
    }

    changeEventToggle(){
        if (this.state.toggleEvent === true){
            this.setState({toggleEvent: false})
        }
        if (this.state.toggleEvent === false){
            this.setState({toggleEvent: true})
        }
    }

    showEventDetails = (arg) => {
        let UsersOnEvent = ''
        EventName = <div>{arg.event.title}</div>
        UsersOnEvent = <div>{
            arg.event._def.extendedProps.users ?(
                <div>{
                    arg.event._def.extendedProps.users.map(
                        user=>
                            <div>{user.name}</div>
                    )
                }</div>
            ):null
        }</div>
        EventBody = <div>
            <Row>
                <Col sm={{size: 5.4}} style={{marginLeft:15,width:150}}>
                    <div style={{fontWeight:'bold'}}>Адрес:</div>
                    <div style={{fontWeight:'bold'}}>Организатор:</div>
                    <div style={{fontWeight:'bold'}}>Дата:</div>
                    <div style={{fontWeight:'bold'}}>Время:</div>
                </Col>
                <Col>
                    <div>{arg.event._def.extendedProps.address}</div>
                    <div>{arg.event._def.extendedProps.organizerName}</div>
                    <div>{arg.event.start.toLocaleDateString()}</div>
                    <div>с {arg.event._def.extendedProps.timeOfStart}:00 до {arg.event._def.extendedProps.timeOfEnd}:00</div>
                </Col>
            </Row>
            <div style={{marginTop:10, fontWeight: 'bold'}}>Участники:</div>
            <div className='user-list' style={{width:350}}>{UsersOnEvent}</div>
        </div>
        this.changeEventToggle(arg)
    }

    render() {
        return (
            <Col sm={{size: 2.7}}>
                <Modal isOpen={this.state.toggleEvent} toggle={this.changeEventToggle}>
                    <ModalHeader toggle={this.changeEventToggle}>
                        {EventName}
                    </ModalHeader>
                    <ModalBody>
                        {EventBody}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={()=>this.changeEventToggle()}>Понятно</Button>{' '}
                    </ModalFooter>
                </Modal>
                <Col sm={{size: 2.7}} className='col-navigation'>
                    <Link to='/'>
                        <div style={{paddingTop: 10}} className='row-navigation'>Главная</div>
                    </Link>
                    <Link to='/birthday' >
                        <div className='row-navigation'>Дни рождения</div>
                    </Link>
                    <Link to={`/users/${this.state.user.currentUser.username}`}>
                        <div className='row-navigation'>Карточка сотрудника</div>
                    </Link>
                    <Link to='/users'>
                        <div className='row-navigation'>Адресная книга сотрудников</div>
                    </Link>
                    {this.state.user.currentUser.privileges.includes('Booking') &&
                    <Link to='/meeting' >
                        <div className='row-navigation'>Бронирование переговорных</div>
                    </Link>}
                    {this.state.user.currentUser.privileges.includes('Manage_Roles') && <Link to='/roleManager'>
                        <div className='row-navigation'>Управление ролями</div>
                    </Link>}
                    <Link to='/about'>
                        <div className='row-navigation'>О компании</div>
                    </Link>
                    <Link to='/news'>
                        <div className='row-navigation'>Новости</div>
                    </Link>
                    <div style={{marginTop: 30}}/>
                    <div className='calendar'>
                    <FullCalendar
                        plugins={[ dayGridPlugin, interactionPlugin ]}
                        initialView="dayGridMonth"
                        locale='ru'
                        events={this.state.events}
                        eventContent={renderEventContent}
                        eventClick={this.showEventDetails}
                    /></div>
                </Col>
            </Col>
        )
    }
}

function renderEventContent(eventInfo) {
    return (
        <>
            <b>{eventInfo.timeText}</b>
            <i>{eventInfo.event.title}</i>
        </>
    )
}