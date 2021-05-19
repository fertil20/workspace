import React, {Component} from "react";
import {Button, Col, Row} from 'reactstrap';
import './News.css';
import {Link} from "react-router-dom";
import {loadAllShorts} from "../../util/APIUtils";


export default class ShortNews extends Component {

    constructor(props) {
        super(props);
        this.state = {
            CurUser: JSON.parse(localStorage.getItem('app')),
            shorts: ''
        }
        this.loadShorts = this.loadShorts.bind(this)
    }

    componentDidMount() {
        this.loadShorts()
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    loadShorts(){
        loadAllShorts()
            .then(response=>{
                this._isMounted && this.setState({shorts:response})
            })
    }



    render() {
        return (
            <Col sm={{size:1.5}} style={{backgroundColor: 'white', borderRadius:10,overflow: 'auto', height:'100%', paddingBottom: 20, width: '20%'}}>
                <div style={{width:210}}>
                    {
                        this.state.shorts ? (
                            <div>
                                {
                                    this.state.shorts.map(
                                        shorts =>
                                            <div style={{margin:10}} >
                                                <div className='news-text'><a href={`/news/show/${shorts.id}`}>{shorts.title}</a></div>
                                                <div className='news-small'>{shorts.date}</div>
                                            </div>
                                    ).reverse()
                                }
                            </div>
                        ) : null
                    }
                    {this.state.CurUser.currentUser.privileges.includes('Manage_News') && <Link to='/news/add'><Button size='sm' className='news-add-button'>Добавить новость</Button></Link>}
                </div>
            </Col>
        )
    }
}
