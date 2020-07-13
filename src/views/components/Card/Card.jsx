import React from 'react';
import {
    Card, CardImg, CardText, CardBody, CardLink,
    CardTitle, CardSubtitle, CardHeader
} from 'reactstrap';
import ButtonUI from '../Button/Button';

class Cards extends React.Component {
    render() {
        const {title, img, genre, artist, stock} = this.props.data

        return (
            <div className="m-2">
                <Card style={{width: 200, height: 350}}>
                    <CardHeader><b>{title}</b></CardHeader>
                    <CardBody>
                        <CardText><b>{artist}</b></CardText>
                        <CardImg src={img} alt="Card image cap" width='50' height='150'/>
                        {/* <CardTitle>Genre: <i>{genre}</i></CardTitle> */}
                        <small><b>Rp1.000.000</b></small>
                        <CardText>
                            <small className="text-muted">Stock: {stock}</small>
                            <small className="text-muted ml-2">Sold: </small>
                        </CardText>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default Cards;