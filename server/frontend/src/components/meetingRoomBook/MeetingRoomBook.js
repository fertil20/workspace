import React, {Component} from "react";
import NavigationPanel from "../navigation/NavigationPanel";
import {
    Row,
    Col,
    DropdownItem,
    UncontrolledButtonDropdown,
    DropdownMenu,
    DropdownToggle, Modal, ModalHeader, ModalBody, Input, ModalFooter, Button, Popover, PopoverHeader, PopoverBody
} from 'reactstrap';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import {formatDate} from "../../util/Helpers";
import './MeetingRoomBook.css';
import {getAllUsers, getMeetingRooms, getMeetings, Meeting} from "../../util/APIUtils";

let CurrentRoom = '1'
let Users = ''
let CurrentEventDate = ''
let TimeArray = [0,0,0,0,0,0,0,0,0]
let MenArray = [0,0,0,0,0,0,0,0,0]
let direct = 0
let EventName = ''
let EventBody = ''
let MeetingRooms = ''
let RoomAbout = ''

export default class MeetingRoomBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            endTime: {value: ''},
            begTime: {value: ''},
            CurrentEvent: '',
            toggle: false,
            search: {value: ''},
            events: [],
            timeOfStart: '-',
            timeOfEnd: '-',
            title: {value: ''},
            usersOnMeeting: [],
            user: JSON.parse(localStorage.getItem('app')),
            toggleEvent: false,
            meetingRooms: '',
            currentRoom: 1
        }
        this.handleDateClick = this.handleDateClick.bind(this);
        this.changeRoom = this.changeRoom.bind(this);
        this.changeToggle = this.changeToggle.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.changeColor = this.changeColor.bind(this);
        this.handleCheckBoxState = this.handleCheckBoxState.bind(this);
        this.showEventDetails = this.showEventDetails.bind(this);
        this.changeEventToggle = this.changeEventToggle.bind(this);
        this.loadAllMeetingRooms = this.loadAllMeetingRooms.bind(this);
    }

    loadMeetingsByRoomId() {
        getMeetings(this.state.currentRoom)
            .then(response => {
                this._isMounted && this.setState({events: response})
            })
            .catch(error => {
                alert('Что-то пошло не так.');
            });
    }

    loadAllMeetingRooms() {
        getMeetingRooms()
            .then(response => {
                this._isMounted && this.setState({meetingRooms: response})
                MeetingRooms = <DropdownMenu>{this.state.meetingRooms ? (<div>{
                    this.state.meetingRooms.map(
                    room =>
                        <DropdownItem onClick={() => this.changeRoom(room.id)}>Переговорная {room.id}</DropdownItem>
                    )}</div>):null}</DropdownMenu>
                RoomAbout = <div>
                    <div style={{fontWeight:'bold'}}>Описание: </div><div>{response[0].about}</div>
                    <div style={{fontWeight:'bold'}}>Адрес: </div><div>{response[0].address}</div>
                    <div style={{fontWeight:'bold'}}>Вместимость: </div><div>{response[0].maxPeople} человек</div>
                </div>
            })
            .catch(error => {
                alert('Что-то пошло не так.');
            });
    }

    componentDidMount() {
        this._isMounted = true;
        this.loadAllMeetingRooms()
        this.loadMeetingsByRoomId()
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleDateClick = (arg) => {
        this.loadMeetingsByRoomId()
        this.changeToggle(arg)
        CurrentEventDate = arg.dateStr
    }

    handleCheckBoxState(event, user) {
        const target = event.target;
        const inputName = target.name;
        if (event.target.checked) {
            this.state.usersOnMeeting.push(user)
        } else {
            let index = this.state.usersOnMeeting.indexOf(user)
            if (index !== -1) {
                this.state.usersOnMeeting.splice(index, 1);
            }
        }
    }

    createNewMeeting() {
        const MeetingRequest = {
            title: this.state.title.value,
            date: CurrentEventDate,
            color: 'red',
            timeOfStart: this.state.timeOfStart,
            timeOfEnd: this.state.timeOfEnd,
            organizerName: this.state.user.currentUser.name,
            usersId: this.state.usersOnMeeting
        }
        if (MeetingRequest.title !== '' && MeetingRequest.timeOfStart !== '-' && MeetingRequest.usersId.length !== 0) {
            Meeting(MeetingRequest, this.state.currentRoom)
                .then(response => {
                    this.setState({
                        toggle: false,
                        title: {value: ''},
                        usersOnMeeting: [],
                        timeOfStart: '-',
                        timeOfEnd: '-'
                    })
                    TimeArray = [0, 0, 0, 0, 0, 0, 0, 0, 0]
                    this.loadMeetingsByRoomId()
                })
                .catch(error => {
                    alert('Что-то пошло не так.');
                });
        } else {
            alert('Введите полную информацию о встрече')
        }
    }

    showEventDetails = (arg) => {
        let UsersOnEvent = ''
        EventName = <div>{arg.event.title}</div>
        UsersOnEvent = <div>{
            arg.event._def.extendedProps.users ? (
                <div>{
                    arg.event._def.extendedProps.users.map(
                        user =>
                            <div>{user.name}</div>
                    )
                }</div>
            ) : null
        }</div>
        EventBody = <div>
            <Row>
                <Col sm={{size: 5.4}} style={{marginLeft: 15, width: 150}}>
                    <div style={{fontWeight: 'bold'}}>Переговорная:</div>
                    <div style={{fontWeight: 'bold'}}>Адрес:</div>
                    <div style={{fontWeight: 'bold'}}>Организатор:</div>
                    <div style={{fontWeight: 'bold'}}>Дата:</div>
                    <div style={{fontWeight: 'bold'}}>Время:</div>
                </Col>
                <Col>
                    <div>{this.state.currentRoom} </div>
                    <div>{this.state.meetingRooms[this.state.currentRoom - 1].address}</div>
                    <div>{arg.event._def.extendedProps.organizerName}</div>
                    <div>{arg.event.start.toLocaleDateString()}</div>
                    <div>с {arg.event._def.extendedProps.timeOfStart}:00
                        до {arg.event._def.extendedProps.timeOfEnd}:00
                    </div>
                </Col>
            </Row>
            <div style={{marginTop: 10, fontWeight: 'bold'}}>Участники:</div>
            <div className='user-list' style={{width: 350}}>{UsersOnEvent}</div>
        </div>
        this.changeEventToggle(arg)
    }

    getUsers() {
        this.setState({toggleDropDown: false})
        getAllUsers()
            .then(response => {
                this._isMounted && this.setState({
                    users: response,
                    isLoading: false
                });
                Users = <div>
                    {
                        this.state.users ? (
                            <div className='user-list'>
                                {
                                    this.state.users.map(
                                        users =>
                                            <div className='user-element'>
                                                {users.name}
                                                <Input type='checkbox' name={users.id} style={{right: 35}}
                                                       onChange={(event) => {
                                                           this.handleCheckBoxState(event, users.id)
                                                       }}
                                                />
                                            </div>
                                    )
                                }
                            </div>
                        ) : null
                    }
                </div>
                this.setState({})
            })
            .catch(error => {
                if (error.status === 404) {
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

    getTimeByEventDate(date) {
        this.state.events.map(
            events => {
                if (events.date === date) {
                    let beg = events.timeOfStart - 9
                    let qua = events.timeOfEnd - events.timeOfStart + beg
                    for (let j = beg; j < qua; j++) {
                        TimeArray[j] = 1
                    }
                }
            }
        )
    }

    changeRoom(room) {
        this.state.currentRoom = room
        this.loadMeetingsByRoomId()
        RoomAbout = <div>
            <div style={{fontWeight: 'bold'}}>Описание:</div>
            <div>{this.state.meetingRooms[this.state.currentRoom - 1].about}</div>
            <div style={{fontWeight: 'bold'}}>Адрес:</div>
            <div>{this.state.meetingRooms[this.state.currentRoom - 1].address}</div>
            <div style={{fontWeight: 'bold'}}>Вместимость:</div>
            <div>{this.state.meetingRooms[this.state.currentRoom - 1].maxPeople} человек</div>
        </div>
    }

    changeToggle(arg) {
        if (this.state.toggle === true) {
            this.setState({toggle: false, title: {value: ''}, timeOfStart: '-', timeOfEnd: '-'})
            TimeArray = [0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
        if (this.state.toggle === false) {
            this.setState({toggle: true})
            this.getUsers()
            this.getTimeByEventDate(arg.dateStr)
        }
        this.setState({CurrentEvent: arg})
    }

    changeEventToggle() {
        if (this.state.toggleEvent === true) {
            this.setState({toggleEvent: false})
        }
        if (this.state.toggleEvent === false) {
            this.setState({toggleEvent: true})
        }
    }

    handleInputChange(event) {
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;

        this.setState({
            [inputName]: {
                value: inputValue,
            }
        });
    }

    copyArray(In, Out) {
        for (let i = 0; i < In.length; i++) {
            In[i] = Out[i]
        }

    }

    changeColor(button) {
        if (TimeArray[button] === 0) {
            if (!TimeArray.includes(2)) {
                TimeArray[button] = 2
                direct = button
                this.setState({
                    timeOfStart: button + 9,
                    timeOfEnd: button + 10
                })
            } else {
                this.copyArray(MenArray, TimeArray)
                if (direct < button) {

                    let i = button + 1
                    while (1) {
                        i = i - 1
                        if (i === -1 || TimeArray[i] === 1) {
                            this.copyArray(TimeArray, MenArray)
                            break
                        }
                        if (TimeArray[i] === 2) {
                            this.setState({
                                timeOfEnd: button + 10
                            })
                            break
                        }
                        TimeArray[i] = 2
                    }
                } else if (direct > button) {
                    let i = button - 1
                    while (1) {
                        i = i + 1
                        if (i === 9 || TimeArray[i] === 1) {
                            this.copyArray(TimeArray, MenArray)
                            break
                        }
                        if (TimeArray[i] === 2) {
                            this.setState({
                                timeOfStart: button + 9
                            })
                            break
                        }
                        TimeArray[i] = 2
                    }
                }
            }
        } else {
            this.setState({
                timeOfEnd: button + 9
            })
            let i = button
            direct = this.state.timeOfStart - 9
            while (1) {
                if (i === 9 || TimeArray[i] === 1) {
                    break
                }
                TimeArray[i] = 0
                i = i + 1
            }
            if (!TimeArray.includes(2)) {
                this.setState({
                    timeOfStart: '-',
                    timeOfEnd: '-'
                })
            }
        }
        this.setState({})
    }

    render() {
        return (
            <div>
                <div>
                    <Modal isOpen={this.state.toggleEvent} toggle={this.changeEventToggle}>
                        <ModalHeader toggle={this.changeEventToggle}>
                            {EventName}
                        </ModalHeader>
                        <ModalBody>
                            {EventBody}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={() => this.changeEventToggle()}>Понятно</Button>{' '}
                        </ModalFooter>
                    </Modal>
                    <Modal isOpen={this.state.toggle} toggle={this.changeToggle}>
                        <ModalHeader toggle={this.changeToggle}>
                            <div>Забронировать переговорную {this.state.currentRoom}</div>
                            <div>{formatDate(this.state.CurrentEvent.dateStr)} Организатор: {this.state.user.currentUser.name}
                                <Input type='text' name='title'
                                       placeholder='Введите название встречи'
                                       value={this.state.title.value}
                                       onChange={(event) => this.handleInputChange(event)}
                                /></div>
                        </ModalHeader>
                        <ModalBody>
                            <Row>
                                <Col>
                                    <div style={{marginBottom: 5}}>Время:</div>
                                    {(TimeArray[0] === 0) &&
                                    <Button size='sm' color='primary' className='time-block-empty'
                                            onClick={() => this.changeColor(0)}>Свободно 9:00-10:00</Button>}
                                    {(TimeArray[0] === 1) &&
                                    <Button size='sm' color='danger' className='time-block-booked'>Занято</Button>}
                                    {(TimeArray[0] === 2) &&
                                    <Button size='sm' color='success' className='time-block-booked'
                                            onClick={() => this.changeColor(0)}>Бронь 9:00-10:00</Button>}

                                    {(TimeArray[1] === 0) &&
                                    <Button size='sm' color='primary' className='time-block-empty'
                                            onClick={() => this.changeColor(1)}>Свободно 10:00-11:00</Button>}
                                    {(TimeArray[1] === 1) &&
                                    <Button size='sm' color='danger' className='time-block-booked'>Занято</Button>}
                                    {(TimeArray[1] === 2) &&
                                    <Button size='sm' color='success' className='time-block-booked'
                                            onClick={() => this.changeColor(1)}>Бронь 10:00-11:00</Button>}

                                    {(TimeArray[2] === 0) &&
                                    <Button size='sm' color='primary' className='time-block-empty'
                                            onClick={() => this.changeColor(2)}>Свободно 11:00-12:00</Button>}
                                    {(TimeArray[2] === 1) &&
                                    <Button size='sm' color='danger' className='time-block-booked'>Занято</Button>}
                                    {(TimeArray[2] === 2) &&
                                    <Button size='sm' color='success' className='time-block-booked'
                                            onClick={() => this.changeColor(2)}>Бронь 11:00-12:00</Button>}

                                    {(TimeArray[3] === 0) &&
                                    <Button size='sm' color='primary' className='time-block-empty'
                                            onClick={() => this.changeColor(3)}>Свободно 12:00-13:00</Button>}
                                    {(TimeArray[3] === 1) &&
                                    <Button size='sm' color='danger' className='time-block-booked'>Занято</Button>}
                                    {(TimeArray[3] === 2) &&
                                    <Button size='sm' color='success' className='time-block-booked'
                                            onClick={() => this.changeColor(3)}>Бронь 12:00-13:00</Button>}

                                    {(TimeArray[4] === 0) &&
                                    <Button size='sm' color='primary' className='time-block-empty'
                                            onClick={() => this.changeColor(4)}>Свободно 13:00-14:00</Button>}
                                    {(TimeArray[4] === 1) &&
                                    <Button size='sm' color='danger' className='time-block-booked'>Занято</Button>}
                                    {(TimeArray[4] === 2) &&
                                    <Button size='sm' color='success' className='time-block-booked'
                                            onClick={() => this.changeColor(4)}>Бронь 13:00-14:00</Button>}

                                    {(TimeArray[5] === 0) &&
                                    <Button size='sm' color='primary' className='time-block-empty'
                                            onClick={() => this.changeColor(5)}>Свободно 14:00-15:00</Button>}
                                    {(TimeArray[5] === 1) &&
                                    <Button size='sm' color='danger' className='time-block-booked'>Занято</Button>}
                                    {(TimeArray[5] === 2) &&
                                    <Button size='sm' color='success' className='time-block-booked'
                                            onClick={() => this.changeColor(5)}>Бронь 14:00-15:00</Button>}

                                    {(TimeArray[6] === 0) &&
                                    <Button size='sm' color='primary' className='time-block-empty'
                                            onClick={() => this.changeColor(6)}>Свободно 15:00-16:00</Button>}
                                    {(TimeArray[6] === 1) &&
                                    <Button size='sm' color='danger' className='time-block-booked'>Занято</Button>}
                                    {(TimeArray[6] === 2) &&
                                    <Button size='sm' color='success' className='time-block-booked'
                                            onClick={() => this.changeColor(6)}>Бронь 15:00-16:00</Button>}

                                    {(TimeArray[7] === 0) &&
                                    <Button size='sm' color='primary' className='time-block-empty'
                                            onClick={() => this.changeColor(7)}>Свободно 16:00-17:00</Button>}
                                    {(TimeArray[7] === 1) &&
                                    <Button size='sm' color='danger' className='time-block-booked'>Занято</Button>}
                                    {(TimeArray[7] === 2) &&
                                    <Button size='sm' color='success' className='time-block-booked'
                                            onClick={() => this.changeColor(7)}>Бронь 16:00-17:00</Button>}

                                    {(TimeArray[8] === 0) &&
                                    <Button size='sm' color='primary' className='time-block-empty'
                                            onClick={() => this.changeColor(8)}>Свободно 17:00-18:00</Button>}
                                    {(TimeArray[8] === 1) &&
                                    <Button size='sm' color='danger' className='time-block-booked'>Занято</Button>}
                                    {(TimeArray[8] === 2) &&
                                    <Button size='sm' color='success' className='time-block-booked'
                                            onClick={() => this.changeColor(8)}>Бронь 17:00-18:00</Button>}
                                    <Row>
                                        <div style={{marginLeft: 15}}>Бронь
                                            с {this.state.timeOfStart} до {this.state.timeOfEnd}</div>
                                    </Row>
                                </Col>
                                <Col>
                                    <div>Участники:</div>
                                    {Users}
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" onClick={this.changeToggle}>Отмена</Button>{' '}
                            <Button color="primary" onClick={() => this.createNewMeeting()}>Забронировать</Button>
                        </ModalFooter>
                    </Modal>
                </div>
                <Row>
                    <NavigationPanel/>
                    <Col sm={{size: 9}} style={{
                        backgroundColor: 'white',
                        borderRadius: 10,
                        height: 'auto',
                        paddingBottom: 20,
                        paddingRight: 20,
                        width: '75%'
                    }}>
                        <Row>
                            <div style={{width: '22%', margin: '1%'}}>
                                <UncontrolledButtonDropdown>
                                    <DropdownToggle nav caret>Переговорная</DropdownToggle>
                                    {MeetingRooms}
                                </UncontrolledButtonDropdown>
                                <div className='room-title'>Переговорная {this.state.currentRoom}.</div>
                                {RoomAbout}
                                <div className='choose-event'>Выберите дату брони.</div>
                            </div>
                            <div style={{width: '76%', paddingTop: 10}}>
                                <FullCalendar
                                    plugins={[dayGridPlugin, interactionPlugin]}
                                    initialView="dayGridMonth"
                                    dateClick={this.handleDateClick}
                                    events={this.state.events}
                                    eventContent={renderEventContent}
                                    locale='ru'
                                    firstDay={1}
                                    eventClick={this.showEventDetails}
                                />
                            </div>
                        </Row>
                    </Col>
                </Row>
            </div>
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