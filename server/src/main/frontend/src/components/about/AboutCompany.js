import React, {Component} from 'react';
import NavigationPanel from "../navigation/NavigationPanel";
import {Row,Col,Button} from 'reactstrap';
import './AboutCompany.css'

let CompanyAboutText = 'Компания Workspace  – технологический и бизнес-партнер лидеров российского бизнеса и государственных структур. Компания трансформирует понимание современной экономики и технологическую экспертизу в решения, повышающие эффективность управления и конкурентоспособность компаний в цифровую эпоху.\n' +
    '\n' +
    'Workspace решает сложные задачи в сфере стратегического развития и повышения  операционной эффективности, оказывая услуги в области оптимизации бизнес-процессов, создания систем управления, управления данными, анализа и моделирования, разработки, тестирования и сопровождения программного обеспечения, создания вычислительных центров и систем хранения и аутсорсинга обеспечивающих бизнес-процессов.'
let OfficeAboutText1 = 'Г. Москва, ул. Беговая, 67'
let OfficeAboutText2 = 'Г. Санкт-Петербург, ул. Ленина, 55'
let OfficePhoneText1 = '+7(812)-578-85-44'
let OfficePhoneText2 = '+7(812)-543-56-65'

export default class AboutCompany extends Component{

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
                    <div >
                        <div style={{margin:50,width:750,height:'auto'}}>
                            <div className='company-about-text'>{CompanyAboutText}</div>
                            <div className='office'>Офис:</div>
                            <Row style={{width:750}}>
                                <Col>
                                     <div style={{height:'auto'}}>{OfficeAboutText1}</div>
                                    <div style={{height:'auto',marginBottom:50}}>{OfficeAboutText2}</div>
                                </Col>
                                <Col>
                                    <div style={{height:'auto'}}>{OfficePhoneText1}</div>
                                    <div style={{height:'auto'}}>{OfficePhoneText2}</div>
                                </Col>
                            </Row>
                            {this.state.CurUser.currentUser.privileges.includes('Edit_About') && <Button style={{marginRight:50}} disabled='true' size='sm' className='company-button' href='/about/edit'>Редактировать</Button>}
                            <Button size='sm' className='company-button' href='/about/newEmployee'>Новый сотрудник</Button>
                        </div>
                    </div>
                </Col>
            </Row>
        )
    }
}