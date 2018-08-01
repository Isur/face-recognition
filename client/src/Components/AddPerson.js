import React from "react";
import { Form, Segment, Button, Dropdown } from 'semantic-ui-react';
import axios from 'axios';

class AddPerson extends React.Component{
    constructor(){
        super();
        this.state = {
            name: '',
            userData: '',
            personGroupId: '',
            personGroups: [],
            options: []
        }
        this.onChange = this.onChange.bind(this);
        this.submit = this.submit.bind(this);
        this.dropdownChange = this.dropdownChange.bind(this);
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
                this.setState({options: options});
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
        axios({
            method: 'post',
            url: '/add/addPerson',
            data:{
                name: this.state.name,
                personGroupId: this.state.personGroupId,
                userData: this.state.userData
            }
        })
    }

    dropdownChange = (event, data) => {
        this.setState({
            personGroupId: data.value
        })
    }

    render(){
        console.log(this.state.options);
        return(
            <Segment>
            <Form>
                <Form.Input placeholder="Imie" onChange={this.onChange} name="name"/>
                <Form.Input placeholder="Pełne imię i nazwisko" onChange={this.onChange} name="userData"/>
                <Dropdown placeholder="Grupa" options={this.state.options} compact selection onChange={this.dropdownChange} />
                <Button type="submit" onClick={this.submit}> Dodaj </Button>
            </Form>
            </Segment>
        )
    }
}

export default AddPerson;