import React from "react";
import { Form, Segment, Button, Dropdown, Message } from 'semantic-ui-react';
import axios from 'axios';

class AddPerson extends React.Component{
    constructor(){
        super();
        this.state = {
            name: '',
            userData: '',
            personGroupId: '',
            personGroups: [],
            options: [],
            errorName: true,
            errorUserData: true,
            errorPersonGroupId: true,
            error: true,
            success: '',
            message: 'Wypełnij wszystkie pola.',
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
    validataAll = () => {
        this.validateName();
        this.validatePersonGroupId();
        this.validateUserData();
    }
    validateName = () => {
        if(this.state.name === '')
            this.setState({errorName: true}, () => this.isError());
        else 
            this.setState({errorName: false}, () => this.isError());
    }
    validateUserData = () => {
        if(this.state.userData === '')
            this.setState({errorUserData: true}, () => this.isError());
        else 
            this.setState({errorUserData: false}, () => this.isError());
    }
    validatePersonGroupId = () => {
        if(this.state.personGroupId === '')
            this.setState({errorPersonGroupId: true}, () => this.isError());
        else 
            this.setState({errorPersonGroupId: false}, () => this.isError());
    }



    onChange = (event) => {
        const name = event.target.name;
        this.setState({
            [name]: event.target.value
        }, () => {
            switch(name){
                case 'name':
                    this.validateName();
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
        this.validataAll();
        axios({
            method: 'post',
            url: '/add/addPerson',
            data:{
                name: this.state.name,
                personGroupId: this.state.personGroupId,
                userData: this.state.userData
            }
        }).then(res => {
            if(res.data.error === undefined ){
                this.setState({
                    success: true,
                    message: "Oosba doddana!" 
                })
            } else {
                this.setState({
                    success: false,
                    message: 'Nie udało się dodać osoby!'
                })
            }
        })
    }

    dropdownChange = (event, data) => {
        this.setState({
            personGroupId: data.value
        }, () => this.validatePersonGroupId())
    }

    render(){
        return(
            <Segment>
            <Form>
                <Form.Input error={this.state.errorName}  placeholder="Imie" onChange={this.onChange} name="name" value={this.state.name}/>
                <Form.Input error={this.state.errorUserData}  placeholder="Pełne imię i nazwisko" onChange={this.onChange} name="userData" value={this.state.userData}/>
                <Dropdown error={this.state.errorPersonGroupId}  placeholder="Grupa" options={this.state.options} compact selection onChange={this.dropdownChange} />
                <Button disabled={this.state.error} type="submit" onClick={this.submit}> Dodaj </Button>
            </Form>
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

export default AddPerson;