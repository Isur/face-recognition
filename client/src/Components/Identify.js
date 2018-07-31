import React from 'react';
import { Form , Button, Icon, Label, Image, Table, Segment, TableCell } from 'semantic-ui-react';
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
    console.log(props.candidates)
    return(
    <Table  celled inverted selectable>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell> Osoba </Table.HeaderCell>
                <Table.HeaderCell> Pewność </Table.HeaderCell>
            </Table.Row>
        </Table.Header>
        <Table.Body>
        {props.candidates.map((can) => 
            <TableRow key={can.personId} element={can.name} value={can.confidence} />)}
        </Table.Body>
    </Table>
    )
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

class Identify extends React.Component{
    constructor(){
        super();
        this.state = {
            imageURL: '',
            result: '',
            resultReady: false,
            faceIds: [],
            candidates: []
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
        }).then(res => this.setState({result: res.data, resultReady: false, faceIds: res.data.map((data) => data.faceId)}, () =>  
            axios({
                method: 'post',
                url: '/face/identify',
                data:{
                    faceIds: this.state.faceIds,
                    personGroupId: "presidents"
                }
            }).then(res => this.setState({result: res.data, resultReady: false, candidates: res.data[0].candidates}, () => {
            var i = 0; 
            var cans = this.state.candidates;   
            this.state.candidates.map((item) => {
                    axios({
                        method: 'get',
                        url: `/get/person/?personId=${item.personId}&personGroupId=presidents`
                    }).then(res => {
                        cans[i].name = res.data.name;
                        i ++;
                        this.setState({candidates: cans}, () => this.setState({resultReady: true}))
                    });
                })
                
            }
        ))    
    ));
    
    }

    InputChange = (event) =>{
        this.setState({
            imageURL: event.target.value
        })
    }

    render(){
        return(
            <Segment inverted>
            <Form>
                <Form.Input placeholder="Adres do zdjęcia" onChange={this.InputChange} />
                <Button onClick={this.getResult}>Prześlij</Button>
            </Form>
           {this.state.resultReady && <div><Image src={this.state.imageURL} /> <ResultTable candidates={this.state.candidates} /> </div>}
            </Segment>
        )
    }
}

export default Identify;