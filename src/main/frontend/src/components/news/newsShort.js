import React, {Component} from "react";
import {Button, Col, Row} from 'reactstrap';
import './News.css';
import {Link} from "react-router-dom";


export default class ShortNews extends Component {

    constructor(props) {
        super(props);
        this.state = {
            CurUser: JSON.parse(localStorage.getItem('app')),
        }
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }


    render() {
        return (
            <Col sm={{size:1.5}} style={{backgroundColor: 'white', borderRadius:10,overflow: 'auto', height:'100%', paddingBottom: 20, width: '20%'}}>
                <div style={{width:210}}>
                    <div style={{margin:10}} >
                        <Link to='/news/1'><div className='news-text'>Путин выплатит семьям со школьниками по 10 тысяч рублей</div></Link>
                        <div className='news-small'>28.04.2021</div>
                    </div>
                    {this.state.CurUser.currentUser.privileges.includes('Manage_News') && <Link to='/news/add'><Button size='sm' className='news-add-button'>Добавить новость</Button></Link>}
                </div>
            </Col>
        )
    }
}
