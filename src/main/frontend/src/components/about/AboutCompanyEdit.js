import React, {Component} from 'react';
import NavigationPanel from "../navigation/NavigationPanel";
import {Button, Col, Form, FormGroup, Input, Row} from 'reactstrap';
import './AboutCompany.css'

export default class AboutCompanyEdit extends Component{

    constructor(props) {
        super(props);
        this.state = {
            about: {value: ''},
            offices: {value: ''},
            phones: {value: ''}
        }
        this.saveInfo = this.saveInfo.bind(this);
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

    saveInfo(){

    }

    render() {
        return(
            <Row>
                <NavigationPanel/>
                <Col sm={{ size: 5.5 }} style={{backgroundColor: 'white',borderRadius:10,height:'auto',paddingBottom:10, width: '75%'}}>
                    <div style={{width:835}}>
                        <div style={{margin:50,width:750,height:'auto'}}>
                            <Form>
                                <FormGroup>
                                    <Input id='about' name='about' type='textarea' placeholder="О компании"
                                           value={this.state.about.value}
                                           style={{height:200}}
                                           onChange={(event) => {this.handleInputChange(event)}}
                                    />
                                </FormGroup>
                            <div className='office'>Офис:</div>
                            <Row style={{width:750}}>
                                <Col>
                                    <Input id='offices' name='offices' type='textarea' placeholder="Адреса компании"
                                           value={this.state.offices.value}
                                           style={{height:100,marginBottom:50}}
                                           onChange={(event) => {this.handleInputChange(event)}}
                                    />
                                </Col>
                                <Col>
                                    <Input id='phones' name='phones' type='textarea' placeholder="Телефоны компании"
                                           value={this.state.phones.value}
                                           style={{height:100,marginBottom:50}}
                                           onChange={(event) => {this.handleInputChange(event)}}
                                    />
                                </Col>
                            </Row>
                            <Button style={{marginRight:50}} size='sm' className='company-button' onClick={this.saveInfo}>Сохранить</Button>
                            </Form>
                        </div>
                    </div>
                </Col>
            </Row>
        )
    }
}