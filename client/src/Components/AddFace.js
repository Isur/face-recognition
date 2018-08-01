import React from "react";
import { Form, Segment, Button, Dropdown } from 'semantic-ui-react';
import axios from 'axios';

class AddFace extends React.Component{
    constructor(){
        super();
        this.state = {
            imageURL: '',
            personGroupId: '',
            personId: '',
            personGroups: [],
            persons: [],
            groupOptions: [],
            personOptions: [],
            fileOrURL: 'file',
            file: null,
        }
        this.onChange = this.onChange.bind(this);
        this.submit = this.submit.bind(this);
        this.dropdownChangePerson = this.dropdownChangePerson.bind(this);
        this.dropdownChangeGroup = this.dropdownChangeGroup.bind(this);
        this.onChangeFile = this.onChangeFile.bind(this);
    }

    componentDidMount(){
        axios.get('/get/persongroups').then((res) => {
            this.setState({
                personGroups: res.data
            }, () => {
                let options = [];
                let i = 0
                this.state.personGroups.map(item => {
                    options[i] = {};
                    options[i].text = item.name;
                    options[i].value = item.personGroupId;
                    options[i].key = i;
                    i++;
                });
                this.setState({groupOptions: options});
            })
        })
    }



    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    submit = (event) => {
        event.preventDefault();
        if(this.state.fileOrURL === 'url'){
            axios({
                method: 'post',
                url: '/add/addFace',
                data:{
                    personId: this.state.personId,
                    personGroupId: this.state.personGroupId,
                    image: this.state.imageURL
                }
            })
        } else if(this.state.fileOrURL === 'file'){
            axios({
                method: 'post',
                url: `/add/addFaceFile/persongroup/${this.state.personGroupId}/persons/${this.state.personId}`,
                headers:{
                    "Content-Type": "application/octet-stream",
                },
                data: this.state.file
            }).then(res => console.log(res)).catch(err => console.log(err));
        }  
    }

    dropdownChangeGroup = (event, data) => {
        this.setState({
            personGroupId: data.value
        }, () => {
            axios({
                method: 'get',
                url: `/get/personlist/${this.state.personGroupId}`,
            }).then(res => {
                this.setState({
                    persons: res.data
                }, () => {
                    let options = [];
                    let i = 0
                    this.state.persons.map(item => {
                    options[i] = {};
                    options[i].text = item.name;
                    options[i].value = item.personId;
                    options[i].key = i;
                    i++;
                });
                this.setState({personOptions: options});
                })
            })
        })
    }

    dropdownChangePerson = (event, data) => {
        this.setState({
            personId: data.value
        }, () => {console.log(this.state.personId)})
    }

    onChangeFile = (event, data) => {
        this.setState({
            file: event.target.files[0]
        }, () => console.log(data));
    }

    onChangeRadio = (event, data) => {
        this.setState({
            fileOrURL: data.value
        })
    }

    render(){
        console.log(this.state.fileOrURL);
        return(
            <Segment>
            <Form>
                <Form.Group fluid widths={4}>
                    <Form.Input placeholder="URL zdjęcia" onChange={this.onChange} name="imageURL" type="text" disabled={this.state.fileOrURL=== 'file'} />
                    <Form.Radio label="URL" name="fileOrURL" value="url" onChange={this.onChangeRadio} checked={this.state.fileOrURL==='url'}/>
                </Form.Group>
                <Form.Group fluid widths={4}>
                    <Form.Input placeholder="Plik" name="imageFile" type="file" onChange={this.onChangeFile} disabled={this.state.fileOrURL==='url'} /> 
                    <Form.Radio label="Plik" name="fileOrURL" value="file" onChange={this.onChangeRadio} checked={this.state.fileOrURL==='file'}/>
                </Form.Group>
                <Form.Group fluid widths={4}>
                    <Dropdown placeholder="Grupa" name="personGroupId" options={this.state.groupOptions} compact selection onChange={this.dropdownChangeGroup} />
                    <Dropdown placeholder="Osoba" name="personId" options={this.state.personOptions} compact selection onChange={this.dropdownChangePerson} />
                </Form.Group>
                <Button type="submit" onClick={this.submit}> Dodaj </Button>
            </Form>
            </Segment>
        )
    }
}

export default AddFace;