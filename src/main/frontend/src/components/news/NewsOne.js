import React, {Component} from "react";
import './News.css';
import NavigationPanel from "../navigation/NavigationPanel";
import {Row, Col, Button, Input} from 'reactstrap';
import ShortNews from "./NewsShort";
import {deleteNews, loadImageByID, loadNews, loadNewsByID} from "../../util/APIUtils";
import {Link} from "react-router-dom";

export default class NewsOne extends Component {

    constructor(props) {
        super(props);
        this.state ={
            CurUser: JSON.parse(localStorage.getItem('app')),
            news: '',
            image:''
        }
        this.loadOneNews = this.loadOneNews.bind(this)
        this.getNewsImage = this.getNewsImage.bind(this)
    }

    componentDidMount() {
        this._isMounted = true;
        this.loadOneNews(this.props.match.params.id);
        this.getNewsImage(this.props.match.params.id);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    loadOneNews(id){
        loadNewsByID(id)
            .then(response=>{
                    this.setState({news:response})
                }
            )
    }

    getNewsImage(id){
        loadImageByID(id)
            .then(response => {
                this.setState({image: response})
            })
            .catch(error => {
                alert('Что-то пошло не так.');
            });
    }

    deleteNewsByID(NewsId){
        deleteNews(NewsId)
            .then(response => {
                alert('Новость удалена.');
                this.props.history.push(`/news`);
            })
            .catch(error => {
                alert('Что-то пошло не так.');
            });
    }

    render () {
        return(
            <Row>
                <NavigationPanel/>
                <Col sm={{size:1.5}} style={{backgroundColor: 'white', borderRadius: 10,overflow: 'auto', height:'100%', paddingBottom: 20, marginRight: '2%', width: '53%'}}>

                                            <div style={{width:570, marginBottom:30}}>
                                                <div className='news-title'>{this.state.news.title}</div>
                                                <div className='news-date'>{this.state.news.date}</div>
                                                <Row>
                                                    <Col>
                                                        <div style={{width:200,paddingLeft:20}}><img src={this.state.image.url} alt='nobody' className='news-image'/></div>
                                                    </Col>
                                                    <Col >
                                                        <div style={{width:330}} className='news-text'>{this.state.news.topText}</div>
                                                    </Col>
                                                </Row>
                                                <div style={{width:560,paddingLeft:20,height:'auto',paddingTop:5,paddingBottom:25}} className='news-text'>{this.state.news.bottomText}</div>
                                                {this.state.CurUser.currentUser.privileges.includes('Manage_News') && <div><Link to={'/news/edit/'+this.state.news.id}><Button size='sm' className='news-edit-button'>Редактировать</Button></Link>
                                                    <Button size='sm' color='danger' className='news-delete-button' onClick={()=>this.deleteNewsByID(this.state.news.id)}>Удалить</Button></div>}
                                            </div>
                </Col>
                <ShortNews/>
            </Row>
        )
    }
}