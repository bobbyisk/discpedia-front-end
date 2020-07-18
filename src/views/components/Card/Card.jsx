import React from 'react';
import {
    Card, CardImg, CardText, CardBody, CardLink,
    CardTitle, CardSubtitle, CardHeader
} from 'reactstrap';
import ButtonUI from '../Button/Button';

class Cards extends React.Component {
    render() {
        const {title, img, genre, artist, stock, sold, price} = this.props.data

        return (
            <div className="m-2">
                <Card style={{width: 200, height: 350}}>
                    <CardHeader><b>{title}</b></CardHeader>
                    <CardBody>
                        <CardText><b>{artist}</b></CardText>
                        <CardImg src={img} alt="Card image cap" width='50' height='150'/>
                        {/* <CardTitle>Genre: <i>{genre}</i></CardTitle> */}
                        <small><b>{
                            new Intl.NumberFormat(
                            "id-ID",
                            { style: "currency", currency: "IDR" }).format(price)
                        }</b></small>
                        <CardText>
                            <small className="text-muted">Stock: {stock}</small>
                            <small className="text-muted ml-2">Sold: {sold}</small>
                        </CardText>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default Cards;