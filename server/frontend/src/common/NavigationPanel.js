import React, {Component} from "react";
import {Col} from 'reactstrap';
import './NavigationPanel.css';
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';

export default class NavigationPanel extends Component{

    constructor(props) {
        super(props);
        this.state ={
            user: JSON.parse(localStorage.getItem('app'))
        }
    }


    render() {
        if(this.state.user.currentUser.privileges.includes('Manage_Roles')){
        return(
            <Col sm={{ size: 2.7}} className='col-navigation'>
                <a href='/'><div style={{paddingTop:10}} className='row-navigation'>Главная</div></a>
                <a href='/' className='navigation-link-red'><div className='row-navigation'>Дни рождения</div></a>
                <a href={`/users/${this.state.user.currentUser.username}`}><div className='row-navigation'>Карточка сотрудника</div></a>
                <a href='/users'><div className='row-navigation'>Адресная книга сотрудников</div></a>
                <a href='/' className='navigation-link-red'><div className='row-navigation'>Бронирование переговорных</div></a>
                <a href='/manageUsers' ><div className='row-navigation'>Управление сотрудниками</div></a>
                <a href='/roleManager'><div className='row-navigation'>Управление ролями</div></a>
                <a href='/about' ><div className='row-navigation'>О компании</div></a>
                <a href='/news'><div className='row-navigation'>Новости</div></a>
                <Calendar className='calendar'/>
            </Col>
        )}
        else{
            return(
            <Col sm={{ size: 2.7}} className='col-navigation2'>
                <a href='/'><div style={{paddingTop:10}} className='row-navigation'>Главная</div></a>
                <a href='/' className='navigation-link-red'><div className='row-navigation'>Дни рождения</div></a>
                <a href={`/users/${this.state.user.currentUser.username}`}><div className='row-navigation'>Карточка сотрудника</div></a>
                <a href='/users'><div className='row-navigation'>Адресная книга сотрудников</div></a>
                <a href='/about' ><div className='row-navigation'>О компании</div></a>
                <a href='/news' ><div className='row-navigation'>Новости</div></a>
            </Col>)
        }
    }
}