import React from "react";
import { Form, Segment, Button, Message } from 'semantic-ui-react';
import axios from 'axios';
import Loading from './Loading';


class AddPersonGroup extends React.Component{
    constructor(){
        super();
        this.state = {
            name: '',
            personGroupId: '',
            userData: '',
            error: true,
            errorName: true,
            errorPersonGroupId: true,
            errorUserData: true,
            message: 'Wypełnij wszystkie pola',
            success: ''
        }
        this.onChange = this.onChange.bind(this);
        this.submit = this.submit.bind(this);
    }

    validateName = () => {
        if(this.state.name === '')
            this.setState({errorName: true}, () => this.isError());
        else 
            this.setState({errorName: false}, () => this.isError());
    }

    validatePersonGroupId = () => {
        if(this.state.personGroupId === '')
            this.setState({errorPersonGroupId: true}, () => this.isError());
        else 
            this.setState({errorPersonGroupId: false}, () => this.isError());
    }

    validateUserData = () => {
        if(this.state.userData === '')
            this.setState({errorUserData: true}, () => this.isError());
        else 
            this.setState({errorUserData: false}, () => this.isError());
    }

    isError = () => {
        if(this.state.errorName || this.state.errorPersonGroupId || this.state.errorUserData){
            this.setState({
                error : true,
                message : "Brak lub błędnie wprowadzone dane.",
                success: '',
            })
         } else {
             this.setState({
                 error: false,
                 success: '',
             })
         }
    }
    validateAll = () => {
        this.validateName();
        this.validatePersonGroupId();
        this.validateUserData();
    }
    onChange = (event) => {
        const name = event.target.name;
        this.setState({
            [name]: event.target.value
        },() => { 
            switch(name){
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
        })
    }

    submit = (event) => {
        event.preventDefault();
        this.validateAll();
        if(this.state.error === false){
            this.setState({loading: true})
            axios({
                method: 'post',
                url: '/add/addPersonGroup',
                data:{
                    name: this.state.name,
                    userData: this.state.userData,
                    id: this.state.personGroupId
                }
            }).then(res => {
                if(res.data.error === undefined ){
                    this.setState({
                        success: true,
                        message: "Grupa doddana!",
                        loading: false,
                    })
                } else {
                    this.setState({
                        success: false,
                        message: 'Nie udało się dodać grupy!',
                        loading: false,
                    })
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
                <Button disabled={this.state.error} type="submit" onClick={this.submit}> Dodaj </Button>
            </Form>
            {this.state.loading && <Loading />}
            {this.state.error && <Message error>
                {this.state.message}     
            </Message>}
            {this.state.success === true && <Message positive>
                {this.state.message}            
            </Message>}
            {this.state.success === false && <Message negative>
                {this.state.message}            
            </Message>}
            </Segment>
        )
    }
}

export default AddPersonGroup;