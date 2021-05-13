import {Component} from "react";
import nobody from "../../media/nobody.jpg";
import './News.css';
import NavigationPanel from "../navigation/NavigationPanel";
import {Row,Col,Button} from 'reactstrap';

let NewsText1 = 'Пособия могут получать семьи, в которых доход на человека меньше прожиточного минимума — 1203 руб. Напомним, что до первого апреля сумма пособия была размером с половину прожиточного минимума на душу населения, а уже с первого апреля есть возможность пересчитать её. Половина останется, если в семье получаемая соответственная сумма прожиточного минимума выходит на среднедушевой доход.'
let NewsText2 = 'И если даже 75% не позволяет семье выйти на хороший уровень дохода, то размер пособия будет составлять 100% прожиточного минимума, — говорит Исаева.\n' +
    'Также с апреля текущего месяца будет учитываться доход семьи с декабря 2019 по ноябрь 2020. Что касается изменений в показаниях к доступности выплат определенным категориям населения, изменения затронули семьи, в которых проходит обучение студент-очник возрастом не более 23 лет; семьи с детьми-инвалидами (сумма будет поступать без учёта компенсационных выплат по уходу за детьми с ОВЗ); семьи-опекуны.'

export default class News extends Component {

    constructor(props) {
        super(props);
        this.state ={
            CurUser: JSON.parse(localStorage.getItem('app'))
        }
    }

    render () {
        return(
            <div>
                <Row>
                    <NavigationPanel/>
                    <Col sm={{size:1.5}} style={{backgroundColor: 'white',borderRadius:10,height:'auto',paddingBottom:20,marginRight:30}}>
                        <div style={{width:600}}>
                            <div className='news-title'>Кто может получить выплаты и при каких условиях</div>
                            <div className='news-date'>28.04.2021</div>
                            <Row>
                                <Col>
                                    <div style={{width:200,paddingLeft:20}}><img src={nobody} alt='nobody' className='news-image'/></div>
                                </Col>
                                <Col >
                                    <div style={{width:360,paddingLeft:20}} className='news-text'>{NewsText1}</div>
                                </Col>
                            </Row>
                            <div style={{width:560,paddingLeft:20,height:'auto',paddingTop:5,paddingBottom:25}} className='news-text'>{NewsText2}</div>
                            {this.state.CurUser.currentUser.privileges.includes('Manage_News') && <div><Button disabled='true' size='sm' className='news-edit-button'>Редактировать</Button>
                                <Button disabled='true' size='sm' color='danger' className='news-delete-button'>Удалить</Button></div>}
                        </div>
                    </Col>
                    <Col sm={{size:1.5}} style={{backgroundColor: 'white',borderRadius:10,height:'auto',paddingBottom:20}}>
                        <div style={{width:210}}>
                            <div style={{margin:10}} >
                                <div className='news-text'>Путин выплатит семьям со школьниками по 10 тысяч рублей</div>
                                <div className='news-small'>28.04.2021</div>
                            </div>
                            {this.state.CurUser.currentUser.privileges.includes('Manage_News') && <Button disabled='true' size='sm' className='news-add-button'>Добавить новость</Button>}
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}
