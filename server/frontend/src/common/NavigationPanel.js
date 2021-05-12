import React, {Component} from "react";
import {Col} from 'reactstrap';
import './NavigationPanel.css';
import {Link} from "react-router-dom";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

export default class NavigationPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: JSON.parse(localStorage.getItem('app'))
        }
    }

    render() {
        return (
            <Col sm={{size: 2.7}}>
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
                    {this.state.user.currentUser.privileges.includes('Manage_Users') &&
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
                    {/*<FullCalendar*/}
                    {/*    plugins={[ dayGridPlugin ]}*/}
                    {/*    initialView="dayGridMonth"*/}
                    {/*/>*/}
                </Col>
            </Col>
        )
    }
}