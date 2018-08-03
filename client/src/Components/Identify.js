import React from 'react';
import { Form , Button, Image, Table, Segment, Header, Dropdown } from 'semantic-ui-react';
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
            fileOrURL: 'file',
            errorPersonGroupId: true,
        }
        this.InputChange = this.InputChange.bind(this);
        this.getResult = this.getResult.bind(this);
    }

    componentDidMount(){
       this.getPersonGroups().then(res => {
           this.getTrained(res).then(res => {
            console.log(res);
            let options = res.map(item => {
                let option = {};
                option.text = item.name;
                option.value = item.personGroupId;
                option.key = item.personGroupId;
                option.disabled = !item.trained;
                return option;
            });
            this.setState({options: options});
        })
       })
    }

    getTrained = (groups) => {
        return new Promise((resolve, reject) => {
            const results = groups.map(
                async (item) => this.isTrained(item.personGroupId).then(res => {item.trained = res; return item})
             );
            Promise.all(results).then((res) => resolve(res));
          })
    }

    isTrained = (id) => {
        return new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: `/train/trainstatus/`,
                data: {
                    personGroupId: id
                }
            }).then(res => resolve(res.data.status === 'succeeded'))
            .catch(err => console.log(err));
        })
    }

    getPersonGroups = () => {
        return new Promise((resolve, reject) => {
            axios.get('/get/persongroups').then((res) => {
                resolve(res.data);
            });
        }) 
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
            personGroupId: this.state.personGroupId
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
          url: `/get/person/?personId=${personId}&personGroupId=${this.state.personGroupId}`
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
      this.setState({loading: true}, () => {
                this.getFaceId()
                .then(res => this.identifyFace(res)
                .then(res => this.setFaceAndCandidates(res[0])
                .then(res => this.setState({candidates: res, resultReady: true, loading: false}))
                    .catch(err => console.log(err))
                )
                .catch(err => console.log(err))
            )
            .catch(err => console.log(err));
        })
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
            resultReady: false,
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

    validatePersonGroupId = () => {
        if(this.state.personGroupId === '')
            this.setState({errorPersonGroupId: true});
        else 
            this.setState({errorPersonGroupId: false});
    }

    dropdownChange = (event, data) => {
        this.setState({
            personGroupId: data.value
        }, () => this.validatePersonGroupId())
    }

    render(){
        return(
            <Segment>
            <Header size='huge'> Rozpoznanie twarzy </Header>
            <Form>
            {this.state.options && <Dropdown error={this.state.errorPersonGroupId}  placeholder="Grupa" options={this.state.options} compact labeled selection onChange={this.dropdownChange} />}
            {this.state.options && <label>*Jeśli opcja jest zablokowana, to znaczy, że grupa nie była trenowana </label> }
            <Form.Group widths={4}>
                    <Form.Input placeholder="URL zdjęcia" onChange={this.InputChange} name="imageURL" type="text" disabled={this.state.fileOrURL=== 'file'} />
                    <Form.Radio label="URL" name="fileOrURL" value="url" onChange={this.onChangeRadio} checked={this.state.fileOrURL==='url'}/>
                </Form.Group>
                <Form.Group widths={4}>
                    <Form.Input placeholder="Plik" name="imageFile" type="file" onChange={this.onChangeFile} disabled={this.state.fileOrURL==='url'} /> 
                    <Form.Radio label="Plik" name="fileOrURL" value="file" onChange={this.onChangeRadio} checked={this.state.fileOrURL==='file'}/>
                </Form.Group>
                <Button disabled={((this.state.file === null && this.state.fileOrURL === 'file') || (this.state.imageURL === '' && this.state.fileOrURL === 'url')) && this.state.errorPersonGroupId } onClick={this.getResult}>Prześlij</Button>
            </Form>
            {this.state.loading && <Loading />}
           {this.state.resultReady && this.state.fileOrURL ==='url' && <Image src={this.state.imageURL}size="medium" />}
           {this.state.resultReady &&  <ResultTable candidates={this.state.candidates} />}
            </Segment>
        )
    }
}

export default Identify;