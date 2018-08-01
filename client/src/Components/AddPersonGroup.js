import React from "react";
import { Form, Segment, Button } from 'semantic-ui-react';
import axios from 'axios';



class AddPersonGroup extends React.Component{
    constructor(){
        super();
        this.state = {
            name: '',
            personGroupId: '',
            userData: '',
        }
        this.onChange = this.onChange.bind(this);
        this.submit = this.submit.bind(this);
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
            url: '/add/addPersonGroup',
            data:{
                name: this.state.name,
                userData: this.state.userData,
                id: this.state.personGroupId
            }
        })
    }

    render(){
        return(
            <Segment>
            <Form>
                <Form.Input placeholder="Nazwa grupy" onChange={this.onChange} name="name"/>
                <Form.Input placeholder="Id grupy" onChange={this.onChange} name="personGroupId"/>
                <Form.Input placeholder="Dodatkowa informacja" onChange={this.onChange} name="userData"/>
                <Button type="submit" onClick={this.submit}> Dodaj </Button>
            </Form>
            </Segment>
        )
    }
}

export default AddPersonGroup;