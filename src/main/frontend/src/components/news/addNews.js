import {Component} from "react";
import defaultImg from "../../media/defaultImg.png";
import './News.css';
import NavigationPanel from "../navigation/NavigationPanel";
import {Row, Col, Button, Input} from 'reactstrap';
import ShortNews from "./newsShort";
import {addNews, deleteNews, loadNews} from "../../util/APIUtils";
import {formatDate} from "../../util/Helpers";
import {Link} from "react-router-dom";

let imageToUpload = ''


export default class NewsAdd extends Component {

    constructor(props) {
        super(props);
        this.state ={
            CurUser: JSON.parse(localStorage.getItem('app')),
            news: '',
            title: {value: ''},
            CurrentDate: '',
            text1: {value: ''},
            text2: {value: ''},
            file: '',
            fileName: 'default',
            fileUrl: defaultImg
        }
        this.handleInputChange = this.handleInputChange.bind(this)
        this.onChange = this.onChange.bind(this)
        this.addNewNews = this.addNewNews.bind(this)
    }

    componentDidMount() {
        this._isMounted = true;
    }


    componentWillUnmount() {
        this._isMounted = false;
    }

    addNewNews(){
        const addNewNewsRequest = {
            title: this.state.title.value,
            topText: this.state.text1.value,
            bottomText: this.state.text2.value,
            multipartImage: imageToUpload,
            // Date: this.state.CurrentDate
        }
        addNews(addNewNewsRequest)
            .then(response => {
                alert('Новость добавлена')
            })
            .catch(error => {
                alert('Что-то пошло не так.');
            });
    }

    // on123(e) {
    //     if(e.target.files.length !== 0) {
    //         this.state.file = e.target.files[0]
    //         let image = this.getBinary(e)
    //         console.log(image)
    //         this.setState({fileUrl: URL.createObjectURL(e.target.files[0])})
    //         this.state.fileName = e.target.files[0].name
    //     }
    // }

    onChange(e){
        let file = e.target.files[0];
        let reader = new FileReader();
        let binaryBlob = null
        reader.onloadend = function() {
            let data=(reader.result).split(',')[1];
            binaryBlob = atob(data);
            console.log('done')
            // console.log(binaryBlob)
        }
        reader.readAsDataURL(file);
        console.log(binaryBlob)
        return binaryBlob
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

    render () {

        let date = new Date();
        this.state.CurrentDate = formatDate(date)

        return(
            <Row>
                <NavigationPanel/>
                <Col sm={{size:1.5}} style={{backgroundColor: 'white', borderRadius: 10,overflow: 'auto', height:'100%', paddingBottom: 20, marginRight: '2%', width: '53%'}}>
                    <div style={{width:570, marginBottom:30}}>
                        <div style={{paddingLeft:20,paddingTop:5}}>
                            <Input name='title' type='text' placeholder='Заголовок новости' value={this.state.title.value}
                                   onChange={(event)=>this.handleInputChange(event)}
                            />
                        </div>
                        <div className='news-date'>{this.state.CurrentDate}</div>
                        <Row>
                            <Col>
                                <img style={{paddingLeft:20}} src={this.state.fileUrl} alt={this.state.fileName} id = 'fileUpload' className='news-image'/>
                                <div style={{width:200,paddingLeft:20}}>
                                    <Input type='file' onChange={(event)=>this.onChange(event)}/>
                                    <a>Разрешение: 250x325</a>
                                </div>
                            </Col>
                            <Col >
                                <div style={{width:330}} className='news-text'>
                                    <Input name='text1' type='textarea' placeholder='Введите текст новости. Максимум 400 символов.' value={this.state.text1.value}
                                           style={{height:260}} onChange={(event)=>this.handleInputChange(event)}
                                /></div>
                            </Col>
                        </Row>
                        <div style={{width:570,paddingLeft:20,height:'auto',paddingTop:5,paddingBottom:25}} className='news-text'>
                            <Input name='text2' type='textarea' placeholder='Введите текст новости.' value={this.state.text2.value}
                                   style={{height:160}} onChange={(event)=>this.handleInputChange(event)}
                            />
                        </div>
                        {this.state.CurUser.currentUser.privileges.includes('Manage_News') && <div>
                            <Link to='/news'><Button size='sm' color='danger' className='news-cancel' >Отменить</Button></Link>
                            <Button size='sm' className='news-publish' onClick={()=>this.addNewNews()}>Опубликовать</Button>
                            </div>}
                    </div>
                </Col>
                <ShortNews/>
            </Row>
        )
    }
}
