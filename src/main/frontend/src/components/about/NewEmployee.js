import React, {Component} from 'react';
import NavigationPanel from "../navigation/NavigationPanel";
import {Col, Row} from 'reactstrap';
import './AboutCompany.css'

let NewEmployeeText = 'При приеме на работу нужно:\n' +
    'Заполнить все бланки, которые мы Вам дадим, представить оригиналы и копии всех необходимых документов по списку, который мы тоже Вам дадим, передать свою трудовую книжку и подписать Трудовой договор и Обязательство о сохранении коммерческой тайны. Процесс завершается получением электронной пластиковой карточки вместе с правилами пользования ею. Если Вы потеряете карточку, то сразу\n' +
    'приходите к нам в службу персонала за новой и приносите 200 рублей (штраф, равный стоимости карточки*). \n' +
    'Если карточка размагнитилась и\n' +
    'перестала работать, то также подходите к нам со старой, мы вам выдадим новую.\n' +
    '\n' +
    'Просим предоставить нам документы из этого списка:\n' +
    'Сертификаты (дипломы, свидетельства) о прохождении дополнительного обучения;\n' +
    'Свидетельства о заключении/расторжении брака;\n' +
    'Свидетельства о рождении детей;\n' +
    'Военные билеты либо приписные свидетельства;\n' +
    'Новые паспортные данные;\n' +
    'Адреса согласно регистрации и адреса фактического проживания (с индексами!), если они менялись.\n' +
    '\n' +
    'Режим работы:\n' +
    'Вы должны быть на работе не позднее 9:00. Окончание рабочего дня не ранее 19:00. \n' +
    '\n'
let OfficeAboutText1 = 'Г. Москва, ул. Беговая, 67'
let OfficeAboutText2 = 'Г. Санкт-Петербург, ул. Ленина, 55'
let OfficePhoneText = '+7(812)-578-85-44 +7(812)-543-56-65'

export default class NewEmployee extends Component{

    constructor(props) {
        super(props);
        this.state ={
            CurUser: JSON.parse(localStorage.getItem('app'))
        }
    }

    render() {
        return(
            <Row>
                <NavigationPanel/>
                <Col sm={{ size: 5.5 }} style={{backgroundColor: 'white',borderRadius:10,overflow: 'auto', height:'100%',paddingBottom:10, width: '75%'}}>
                    <div style={{margin:50,width:750,height:'auto'}}>
                        <div className='company-about-text'>{NewEmployeeText}</div>
                        <div className='office'>Дополнительная информация:</div>
                        <Row style={{width:750}}>
                            <Col>
                                <div style={{height:'auto'}}>{OfficeAboutText1}</div>
                                <div style={{height:'auto',width:270}}>{OfficeAboutText2}</div>
                            </Col>
                            <Col>
                                <div style={{height:'auto',width:150}}>{OfficePhoneText}</div>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        )
    }
}