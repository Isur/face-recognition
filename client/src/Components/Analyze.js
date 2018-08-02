import React from 'react';
import { Form , Button, Image, Table, Segment, Header } from 'semantic-ui-react';
import axios from "axios";

const TableRow = (props) => {
    return(
        <Table.Row>
            <Table.Cell> {props.element} </Table.Cell>
            <Table.Cell> {props.value} </Table.Cell>
        </Table.Row>
    )
}

const ResultTable = (props) => {
    return(
    <Table  celled selectable>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell> Element </Table.HeaderCell>
                <Table.HeaderCell> Wartość </Table.HeaderCell>
            </Table.Row>
        </Table.Header>
        <Table.Body>
        <TableRow element="Płeć" value={props.fa.gender} />
        <TableRow element="Wiek" value={props.fa.age} />
        <TableRow element="Okulary" value={props.fa.glasses} />
        </Table.Body>
    </Table>
    )
}

class Analyze extends React.Component{
    constructor(){
        super();
        this.state = {
            imageURL: '',
            result: '',
            resultReady: false
        }
        this.InputChange = this.InputChange.bind(this);
        this.getResult = this.getResult.bind(this);
    }
    getResult = (event) => {
        event.preventDefault();
        axios({
            method: 'post',
            url: '/face/detect',
            data:{
                imageURL: this.state.imageURL
            }
        }).then(res => this.setState({result: res.data, resultReady: true}, () => console.log(this.state.result[0])));
    }

    InputChange = (event) =>{
        this.setState({
            imageURL: event.target.value
        })
    }

    render(){
        return(
            <Segment>
            <Header size='huge'> Analiza twarzy </Header>
            <Form>
                <Form.Input placeholder="Adres do zdjęcia" onChange={this.InputChange} />
                <Button onClick={this.getResult}>Prześlij</Button>
            </Form>
           {this.state.resultReady && <div><Image src={this.state.imageURL} /> <ResultTable fa={this.state.result[0].faceAttributes} /> </div>}
            </Segment>
        )
    }
}

export default Analyze;
