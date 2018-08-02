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

const ResultTable = (props) =>{
    return(
    <Table  celled  selectable>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell> Osoba </Table.HeaderCell>
                <Table.HeaderCell> Pewność </Table.HeaderCell>
            </Table.Row>
        </Table.Header>
        <Table.Body>
        {props.candidates.map((candidate) =>
            <TableRow key={candidate.personId} element={candidate.personName} value={candidate.confidence} />)}
        </Table.Body>
    </Table>
    )
}

class Identify extends React.Component{
    constructor(){
        super();
        this.state = {
            imageURL: '',
            resultReady: false,
            candidates: [],
        }
        this.InputChange = this.InputChange.bind(this);
        this.getResult = this.getResult.bind(this);
    }

    getFaceId = () => {
      return new Promise((resolve, reject) => {
        axios({
          method: 'post',
          url: '/face/detect',
          data:{
            imageURL: this.state.imageURL
          }
        })
        .then(res=>resolve(res.data.map(item => item.faceId)))
        .catch(err => reject(err));
      })
    }

    identifyFace = (faceIds) => {
      return new Promise((resolve, reject) => {
        axios({
          method: 'post',
          url: '/face/identify',
          data:{
            faceIds: faceIds,
            personGroupId: "presidents"
          }
        })
        .then(res => resolve(res.data))
        .catch(err => reject(err));
      })
    }



    getName = (personId) => {
      return new Promise((resolve, reject) => {
        axios({
          method: 'get',
          url: `/get/person/?personId=${personId}&personGroupId=presidents`
        })
        .then(res => resolve(res.data.name))
        .catch(err => reject(err));
      })
    }

    setFaceAndCandidates = (faceAndCandidates) =>{
      return new Promise((resolve, reject) => {
        const results = faceAndCandidates.candidates.map(
            async (item) => this.getName(item.personId).then(res => {item.personName = res; return item})
         );
        Promise.all(results).then((res) => resolve(res));
      })
    }

    getResult = (event) => {
      event.preventDefault();
      this.getFaceId()
        .then(res => this.identifyFace(res)
          .then(res => this.setFaceAndCandidates(res[0])
            .then(res => this.setState({candidates: res, resultReady: true}))
          )
          .catch(err => console.log(err))
        )
        .catch(err => console.log(err));
    }

    InputChange = (event) =>{
        this.setState({
            imageURL: event.target.value,
            resultReady: false
        })
    }

    render(){
        return(
            <Segment>
            <Header size='huge'> Rozpoznanie twarzy </Header>
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