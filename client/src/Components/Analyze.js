import React from 'react';
import { Form , Button, Image, Table, Segment, Header } from 'semantic-ui-react';
import axios from "axios";
import Loading from './Loading';

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
            resultReady: false,
            file: null,
            fileOrURL: 'file'
        }
        this.InputChange = this.InputChange.bind(this);
        this.getResult = this.getResult.bind(this);
        
    }
    getResult = (event) => {
        event.preventDefault();
        this.setState({loading:true}, () => {
            if(this.state.fileOrURL === 'url'){
                axios({
                    method: 'post',
                    url: '/face/detect',
                    data:{
                        imageURL: this.state.imageURL
                    }
                })
                    .then(res => this.setState({result: res.data, resultReady: true,loading:false}))
                    .catch(err => console.log(err));
            } else if(this.state.fileOrURL === 'file'){
                axios({
                    method: 'post',
                    url: `/face/detect/file`,
                    headers:{
                        "Content-Type": "application/octet-stream",
                    },
                    data: this.state.file
                })
                    .then(res => this.setState({result: res.data, resultReady: true, imageURL: null,loading:false}))
                    .catch(err => console.log(err));
            }
        })
    }

    InputChange = (event) =>{
        this.setState({
            imageURL: event.target.value
        })
    }
    onChangeRadio = (event, data) => {
        this.setState({
            fileOrURL: data.value,
            resultReady: false
        })
    }

    onChangeFile = (event, data) => {
        if(event.target.files.length !== 0)
            this.setState({
                file: event.target.files[0]
            });
        else 
            this.setState({
                file: null
            });
    }
    render(){
        return(
            <Segment>
            <Header size='huge'> Analiza twarzy </Header>
            <Form>
            <Form.Group widths={4}>
                    <Form.Input placeholder="URL zdjęcia" onChange={this.InputChange} name="imageURL" type="text" disabled={this.state.fileOrURL=== 'file'} />
                    <Form.Radio label="URL" name="fileOrURL" value="url" onChange={this.onChangeRadio} checked={this.state.fileOrURL==='url'}/>
                </Form.Group>
                <Form.Group widths={4}>
                    <Form.Input placeholder="Plik" name="imageFile" type="file" onChange={this.onChangeFile} disabled={this.state.fileOrURL==='url'} /> 
                    <Form.Radio label="Plik" name="fileOrURL" value="file" onChange={this.onChangeRadio} checked={this.state.fileOrURL==='file'}/>
                </Form.Group>
                <Button disabled={(this.state.file === null && this.state.fileOrURL === 'file') || (this.state.imageURL === '' && this.state.fileOrURL === 'url')} onClick={this.getResult}>Prześlij</Button>
            </Form>
            {this.state.loading && <Loading />}
           {this.state.resultReady && <div><Image src={this.state.imageURL} size="medium" /> <ResultTable fa={this.state.result[0].faceAttributes} /> </div>}
            </Segment>
        )
    }
}

export default Analyze;
