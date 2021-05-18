import React, {Component} from "react";
import nobody from "../../media/nobody.jpg";
import './News.css';
import NavigationPanel from "../navigation/NavigationPanel";
import {Row, Col, Button, Input} from 'reactstrap';
import ShortNews from "./newsShort";
import {deleteNews, loadNews, loadNewsByID} from "../../util/APIUtils";
import {Link} from "react-router-dom";

let NewsText1 = 'Пособия могут получать семьи, в которых доход на человека меньше прожиточного минимума — 1203 руб. Напомним, что до первого апреля сумма пособия была размером с половину прожиточного минимума на душу населения, а уже с первого апреля есть возможность пересчитать её. Половина останется, если в семье получаемая соответственная сумма прожиточного минимума выходит на среднедушевой доход.'
let NewsText2 = 'И если даже 75% не позволяет семье выйти на хороший уровень дохода, то размер пособия будет составлять 100% прожиточного минимума, — говорит Исаева.\n' +
    'Также с апреля текущего месяца будет учитываться доход семьи с декабря 2019 по ноябрь 2020. Что касается изменений в показаниях к доступности выплат определенным категориям населения, изменения затронули семьи, в которых проходит обучение студент-очник возрастом не более 23 лет; семьи с детьми-инвалидами (сумма будет поступать без учёта компенсационных выплат по уходу за детьми с ОВЗ); семьи-опекуны.'

export default class NewsOne extends Component {

    constructor(props) {
        super(props);
        this.state ={
            CurUser: JSON.parse(localStorage.getItem('app')),
            news: ''
        }
        this.loadOneNews = this.loadOneNews.bind(this)
    }

    componentDidMount() {
        this._isMounted = true;
        // this._isMounted && this.loadOneNews(this.props.match.params.id);
    }


    componentWillUnmount() {
        this._isMounted = false;
    }

    loadOneNews(id){
        // loadNewsByID(id)
        //     .then(response => {
        //         this.setState({news: response})
        //         console.log(this.state.news)
        //     })
        //     .catch(error => {
        //         alert('Что-то пошло не так.');
        //     });
    }

    deleteNewsByID(NewsId){
        // const deleteNewsRequest = {
        //     id: NewsId
        // };
        // deleteNews(deleteNewsRequest)
        //     .then(response => {
        //         alert('Новость удалена.');
        //     })
        //     .catch(error => {
        //         alert('Что-то пошло не так.');
        //     });
    }

    render () {
        return(
            <Row>
                <NavigationPanel/>
                <Col sm={{size:1.5}} style={{backgroundColor: 'white', borderRadius: 10,overflow: 'auto', height:'100%', paddingBottom: 20, marginRight: '2%', width: '53%'}}>

                                            <div style={{width:570, marginBottom:30}}>
                                                <div className='news-title'>123</div>
                                                <div className='news-date'>123</div>
                                                <Row>
                                                    <Col>
                                                        <div style={{width:200,paddingLeft:20}}><img src={nobody} alt='nobody' className='news-image'/></div>
                                                    </Col>
                                                    <Col >
                                                        <div style={{width:330}} className='news-text'>{NewsText1}</div>
                                                    </Col>
                                                </Row>
                                                <div style={{width:560,paddingLeft:20,height:'auto',paddingTop:5,paddingBottom:25}} className='news-text'>{NewsText2}</div>
                                                {this.state.CurUser.currentUser.privileges.includes('Manage_News') && <div><Link to='/news/edit'><Button size='sm' className='news-edit-button'>Редактировать</Button></Link>
                                                    <Button size='sm' color='danger' className='news-delete-button' onClick={()=>this.deleteNewsByID('id')}>Удалить</Button></div>}
                                            </div>
                </Col>
                <ShortNews/>
            </Row>
        )
    }
}