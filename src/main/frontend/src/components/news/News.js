import React, {Component} from "react";
import nobody from "../../media/nobody.jpg";
import './News.css';
import NavigationPanel from "../navigation/NavigationPanel";
import {Row, Col, Button, Input} from 'reactstrap';
import ShortNews from "./newsShort";
import {deleteNews, loadImageByID, loadNews} from "../../util/APIUtils";
import {Link} from "react-router-dom";

export default class News extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
        this.state ={
            CurUser: JSON.parse(localStorage.getItem('app')),
            news: null,
            image: [],
            isLoading: false
        }
        this.loadAllNews = this.loadAllNews.bind(this)
        this.getNewsImage = this.getNewsImage.bind(this)
        this.ImgLoaded = this.ImgLoaded.bind(this)
    }


    componentDidMount() {
        this.loadAllNews()
        this._isMounted = true;
    }


    componentWillUnmount() {

        this._isMounted = false;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(!this.state.isLoading){
        let idVar = setInterval(() => {
            this.loadAllNews()
            if(this.state.isLoading)clearInterval(idVar)
        }, 2000);}
    }

    ImgLoaded(){
        this.setState({isLoading: true})
    }


    loadAllNews(){
        loadNews()
            .then(response => {
                this.setState({news: response})
                if(response){
                this.state.news.map(
                    news=>{
                        this.getNewsImage(news.id)
                    })
                    this.setState({isLoading:true})
                }
            })
            .catch(error => {
            });
    }

    getNewsImage(id){
        if(id){
            loadImageByID(id)
                .then(response => {
                })
                .catch(error => {
                    alert('Что-то пошло не так2.');
                });}
    }


    deleteNewsByID(NewsId){
        deleteNews(NewsId)
            .then(response => {
                alert('Новость удалена.');
                this.props.history.go(`/news`);
            })
            .catch(error => {
                alert('Что-то пошло не так.');
            });
    }

    render () {
        if (this.state.isLoading) {
        return(
            <Row>
                <NavigationPanel/>
                <Col sm={{size:1.5}} style={{backgroundColor: 'white', borderRadius: 10,overflow: 'auto', height:'100%', paddingBottom: 20, marginRight: '2%', width: '53%'}}>
                    {
                        this.state.news ? (
                            <div>
                                {
                                    this.state.news.map(
                                        (news, index) =>(
                                            <div style={{width:570, marginBottom:30}}>
                                                <div className='news-title'>{news.title}</div>
                                                <div className='news-date'>{news.date}</div>
                                                <Row>
                                                    <Col>
                                                        <div style={{width:200,paddingLeft:20}}><img src={process.env.REACT_APP_API_BASE_URL+'/news/see/'+news.id+'/image'} onLoad={()=>this.ImgLoaded()} alt={news.id} className='news-image'/></div>
                                                    </Col>
                                                    <Col >
                                                        <div style={{width:330}} className='news-text'>{news.topText}</div>
                                                    </Col>
                                                </Row>
                                                <div style={{width:560,paddingLeft:20,height:'auto',paddingTop:5,paddingBottom:25}} className='news-text'>{news.bottomText}</div>
                                                {this.state.CurUser.currentUser.privileges.includes('Manage_News') && <div><Link to={'/news/edit/'+news.id}><Button size='sm' className='news-edit-button'>Редактировать</Button></Link>
                                                    <Button size='sm' color='danger' className='news-delete-button' onClick={()=>this.deleteNewsByID(news.id)}>Удалить</Button></div>}
                                            </div>)
                                    ).reverse()
                                }
                            </div>
                        ) : null
                    }
                </Col>
                <ShortNews/>
            </Row>
        )
    }else{
            return <div className="text-center">
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        }
    }
}
