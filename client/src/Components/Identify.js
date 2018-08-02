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
            file: null,
            fileOrURL: 'file'
        }
        this.InputChange = this.InputChange.bind(this);
        this.getResult = this.getResult.bind(this);
    }

    getFaceId = () => {
      return new Promise((resolve, reject) => {
        if(this.state.fileOrURL === 'url'){
            axios({
            method: 'post',
            url: '/face/detect',
            data:{
                imageURL: this.state.imageURL
            }
            })
            .then(res=>resolve(res.data.map(item => item.faceId)))
            .catch(err => reject(err));
        } else if (this.state.fileOrURL === 'file'){
            axios({
                method: 'post',
                url: `/face/detect/file`,
                headers:{
                    "Content-Type": "application/octet-stream",
                },
                data: this.state.file
            })
            .then(res=>resolve(res.data.map(item => item.faceId)))
            .catch(err => reject(err));
        }
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
    InputChange = (event) =>{
        this.setState({
            imageURL: event.target.value
        })
    }
    onChangeRadio = (event, data) => {
        this.setState({
            fileOrURL: data.value,
            candidates: []
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
            <Header size='huge'> Rozpoznanie twarzy </Header>
            <Form>
            <Form.Group widths={4}>
                    <Form.Input placeholder="URL zdjęcia" onChange={this.InputChange} name="imageURL" type="text" disabled={this.state.fileOrURL=== 'file'} />
                    <Form.Radio label="URL" name="fileOrURL" value="url" onChange={this.onChangeRadio} checked={this.state.fileOrURL==='url'}/>
                </Form.Group>
                <Form.Group widths={4}>
                    <Form.Input placeholder="Plik" name="imageFile" type="file" onChange={this.onChangeFile} disabled={this.state.fileOrURL==='url'} /> 
                    <Form.Radio label="Plik" name="fileOrURL" value="file" onChange={this.onChangeRadio} checked={this.state.fileOrURL==='file'}/>
                </Form.Group>
                <Button onClick={this.getResult}>Prześlij</Button>
            </Form>
           {this.state.resultReady && this.state.fileOrURL ==='url' && <Image src={this.state.imageURL}size="medium" />}
           {this.state.resultReady &&  <ResultTable candidates={this.state.candidates} />}
            </Segment>
        )
    }
}

export default Identify;