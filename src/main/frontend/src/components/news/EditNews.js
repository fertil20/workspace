import {Component} from "react";
import './News.css';
import NavigationPanel from "../navigation/NavigationPanel";
import {Button, Col, Input, Row} from 'reactstrap';
import ShortNews from "./NewsShort";
import {deleteNews, editNews, loadImageByID, loadNewsByID} from "../../util/APIUtils";
import {formatDate} from "../../util/Helpers";
import {Link} from "react-router-dom";

let NewsText1 = 'Пособия могут получать семьи, в которых доход на человека меньше прожиточного минимума — 1203 руб. Напомним, что до первого апреля сумма пособия была размером с половину прожиточного минимума на душу населения, а уже с первого апреля есть возможность пересчитать её. Половина останется, если в семье получаемая соответственная сумма прожиточного минимума выходит на среднедушевой доход.'
let NewsText2 = 'И если даже 75% не позволяет семье выйти на хороший уровень дохода, то размер пособия будет составлять 100% прожиточного минимума, — говорит Исаева.\n' +
    'Также с апреля текущего месяца будет учитываться доход семьи с декабря 2019 по ноябрь 2020. Что касается изменений в показаниях к доступности выплат определенным категориям населения, изменения затронули семьи, в которых проходит обучение студент-очник возрастом не более 23 лет; семьи с детьми-инвалидами (сумма будет поступать без учёта компенсационных выплат по уходу за детьми с ОВЗ); семьи-опекуны.'

export default class NewsEdit extends Component {

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
            fileUrl: '',
            id: ''
        }
        this.handleInputChange = this.handleInputChange.bind(this)
        this.onChange = this.onChange.bind(this)
        this.saveNews = this.saveNews.bind(this)
        this.deleteNewsByID = this.deleteNewsByID.bind(this)
    }

    saveNews(){
        const addNewNewsRequest ={
            title: this.state.title.value,
            text1: this.state.text1.value,
            text2: this.state.text2.value,
            file: this.state.file,
        }
        editNews(this.state.id, addNewNewsRequest.title,addNewNewsRequest.text1,addNewNewsRequest.text2,addNewNewsRequest.file)
            .then(response => {
                alert('Успешно отредактировано.')
                this.props.history.push(`/news/show/`+this.state.id);
            })
            .catch(error => {
                alert('Что-то пошло не так.');
            });
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
                    this.setState({
                            title:{value:response.title},
                            text1:{value:response.topText},
                            text2:{value:response.bottomText},
                        id: response.id
                    })
                }
            )
    }

    getNewsImage(id){
        loadImageByID(id)
            .then(response => {
                this.setState({file:response,fileUrl: response.url})

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

    onChange(e) {
        if(e.target.files.length !== 0) {
            this.setState({file: e.target.files[0]})
            this.setState({fileUrl: URL.createObjectURL(e.target.files[0])})
            this.state.fileName = e.target.files[0].name
        }
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
                            <Input name='title' type='text' placeholder='Заголовок новости' required value={this.state.title.value} maxLength={100}
                                   onChange={(event)=>this.handleInputChange(event)}
                            />
                        </div>
                        <div className='news-date'>{this.state.CurrentDate}</div>
                        <Row>
                            <Col>
                                <img style={{paddingLeft:20}} src={this.state.fileUrl} alt={this.state.fileName} className='news-image'/>
                                <div style={{width:200,paddingLeft:20}}>
                                    <Input type='file' accept="image/png, image/jpeg" onChange={(event)=>this.onChange(event)}/>
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
                            <Link to='/news'><Button size='sm'  className='news-publish' >Отменить</Button></Link>
                            <Button style={{marginLeft:20}} size='sm' color='danger' className='news-delete-button' onClick={()=>this.deleteNewsByID(this.state.id)}>Удалить</Button>
                            <Button size='sm' className='news-publish' onClick={()=>this.saveNews()}>Сохранить</Button>
                        </div>}
                    </div>
                </Col>
                <ShortNews/>
            </Row>
        )
    }
}