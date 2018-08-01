import React from "react";
import { Form, Segment, Button, Message } from 'semantic-ui-react';
import axios from 'axios';



class AddPersonGroup extends React.Component{
    constructor(){
        super();
        this.state = {
            name: '',
            personGroupId: '',
            userData: '',
            error: true,
            errorName: false,
            errorPersonGroupId: false,
            errorUserData: false,
            message: ''
        }
        this.onChange = this.onChange.bind(this);
        this.submit = this.submit.bind(this);
    }

    validateName = () => {
        if(this.state.name === '')
            this.setState({errorName: true});
        else 
            this.setState({errorName: false});
    }

    validatePersonGroupId = () => {
        if(this.state.personGroupId === '')
            this.setState({errorPersonGroupId: true});
        else 
            this.setState({errorPersonGroupId: false});
    }

    validateUserData = () => {
        if(this.state.userData === '')
            this.setState({errorUserData: true});
        else 
            this.setState({errorUserData: false});
    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
        switch(event.target.name){
            case 'name':
                this.validateName();
                break;
            case 'personGroupId':
                this.validatePersonGroupId();
                break;
            case 'userData':
                this.validateUserData();
                break;
            default:
                break;
        }
        if(this.state.errorName || this.state.errorPersonGroupId || this.state.errorUserData){
           this.setState({
               error : true,
               message : "Brak lub błędnie wprowadzone dane.",
           })
        }
    }

    submit = (event) => {
        event.preventDefault();
        if(this.state.error === false){
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
    }

    render(){
        return(
            <Segment>
            <Form>
                <Form.Input error={this.state.errorName} placeholder="Nazwa grupy" onChange={this.onChange} name="name" value={this.state.name}/>
                <Form.Input error={this.state.errorPersonGroupId} placeholder="Id grupy" onChange={this.onChange} name="personGroupId" value={this.state.personGroupId}/>
                <Form.Input error={this.state.errorUserData} placeholder="Dodatkowa informacja" onChange={this.onChange} name="userData" value={this.state.userData}/>
                <Button type="submit" onClick={this.submit}> Dodaj </Button>
            </Form>
            {this.state.error && <Message error>
                {this.state.message}                
            </Message>}
            </Segment>
        )
    }
}

export default AddPersonGroup;