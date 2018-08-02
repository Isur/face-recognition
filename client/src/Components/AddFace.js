import React from "react";
import { Form, Segment, Button, Dropdown, Message } from 'semantic-ui-react';
import axios from 'axios';
import Loading from './Loading';

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
            errorImage: true,
            errorPersonGroupId: true,
            errorPersonId: true,
            error: true,
            success: '',
            message: "Wypełnij wszystkie pola."
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
                let options = this.state.personGroups.map(item => {
                    let option = {};
                    option.text = item.name;
                    option.value = item.personGroupId;
                    option.key = item.personGroupId;
                    return option;
                });
                this.setState({groupOptions: options});
            })
        })
    }

    isError = () => {
        if(this.state.errorImage || this.state.errorPersonGroupId || this.state.errorPersonId){
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
        this.validateImage();
        this.validatePersonGroupId();
        this.validatePersonId();
    }

    validatePersonId = () => {
        if(this.state.personId === '')
            this.setState({errorPersonId: true}, () => this.isError());
        else
            this.setState({errorPersonId: false}, () => this.isError());
    }

    validatePersonGroupId = () => {
        if(this.state.personGroupId === '')
            this.setState({errorPersonGroupId: true}, () => this.isError());
        else
            this.setState({errorPersonGroupId: false}, () => this.isError());
    }

    validateImageUrl = () => {
        if(this.state.imageURL === '')
            this.setState({errorImage: true}, () => this.isError());
        else
            this.setState({errorImage: false}, () => this.isError());
    }

    validateImageFile = () => {
        if(this.state.file === null)
            this.setState({errorImage: true}, () => this.isError());
        else
            this.setState({errorImage: false}, () => this.isError());
    }

    validateImage = () => {
        if(this.state.fileOrURL === 'url')
            this.validateImageUrl();
        else if( this.state.fileOrURL === 'file')
            this.validateImageFile();
    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        }, () =>  this.validateImage())
    }

    submit = (event) => {
        event.preventDefault();
        this.validateAll();
        if(this.state.error === false){
            this.setState({loading: true})
            if(this.state.fileOrURL === 'url'){
                axios({
                    method: 'post',
                    url: '/add/addFace',
                    data:{
                        personId: this.state.personId,
                        personGroupId: this.state.personGroupId,
                        image: this.state.imageURL
                    }
                }).then(res => {
                    if(res.data.error === undefined ){
                        this.setState({
                            success: true,
                            message: "Twarz doddana!" ,
                            loading: false
                        })
                    } else {
                        this.setState({
                            success: false,
                            message: 'Nie udało się dodać twarzy!',
                            loading: false
                        })
                    }
                }).catch(err => {
                    this.setState({
                        success: false,
                        message: "Wysyłanie nie powiodło się!",
                        loading: false
                    })
                })
            } else if(this.state.fileOrURL === 'file'){
                axios({
                    method: 'post',
                    url: `/add/addFaceFile/persongroup/${this.state.personGroupId}/persons/${this.state.personId}`,
                    headers:{
                        "Content-Type": "application/octet-stream",
                    },
                    data: this.state.file
                }).then(res => {
                    if(res.data.error === undefined ){
                        this.setState({
                            success: true,
                            message: "Twarz doddana!",
                            loading: false
                        })
                    } else {
                        this.setState({
                            success: false,
                            message: 'Nie udało się dodać twarzy!',
                            loading: false
                        })
                    }
                }).catch(err => {
                    this.setState({
                        success: false,
                        message: "Wysyłanie nie powiodło się!",
                        loading: false
                    })
                });
            }  
        }
    }

    dropdownChangeGroup = (event, data) => {
        this.setState({
            personGroupId: data.value,
            loading: true
        }, () => {
            axios({
                method: 'get',
                url: `/get/personlist/${this.state.personGroupId}`,
            }).then(res => {
                this.setState({
                    persons: res.data
                }, () => {
                    let options = this.state.persons.map(item => {
                    let option = {};
                    option.text = item.name;
                    option.value = item.personId;
                    option.key = item.personId;
                    return option;
                });
                this.setState({personOptions: options,loading: false}, () => this.validatePersonGroupId());
                })
            })
        })
    }

    dropdownChangePerson = (event, data) => {
        this.setState({
            personId: data.value
        }, () => this.validatePersonId())
    }

    onChangeFile = (event, data) => {
        if(event.target.files.length !== 0)
            this.setState({
                file: event.target.files[0]
            }, () => this.validateImage());
        else 
            this.setState({
                file: null
            }, () => this.validateImage());
    }

    onChangeRadio = (event, data) => {
        this.setState({
            fileOrURL: data.value
        }, () => this.validateImage())
    }

    render(){
        return(
            <Segment>
            <Form>
                <Form.Group  widths={4}>
                    <Form.Input error={this.state.errorImage && this.state.fileOrURL==='url'} placeholder="URL zdjęcia" onChange={this.onChange} name="imageURL" type="text" disabled={this.state.fileOrURL=== 'file'} />
                    <Form.Radio label="URL" name="fileOrURL" value="url" onChange={this.onChangeRadio} checked={this.state.fileOrURL==='url'}/>
                </Form.Group>
                <Form.Group  widths={4}>
                    <Form.Input error={this.state.errorImage && this.state.fileOrURL==='file'} placeholder="Plik" name="imageFile" type="file" onChange={this.onChangeFile} disabled={this.state.fileOrURL==='url'} /> 
                    <Form.Radio label="Plik" name="fileOrURL" value="file" onChange={this.onChangeRadio} checked={this.state.fileOrURL==='file'}/>
                </Form.Group>
                <Form.Group  widths={4}>
                    <Dropdown error={this.state.errorPersonGroupId} placeholder="Grupa" name="personGroupId" options={this.state.groupOptions} compact selection onChange={this.dropdownChangeGroup} />
                    <Dropdown error={this.state.errorPersonId}placeholder="Osoba" name="personId" options={this.state.personOptions} compact selection onChange={this.dropdownChangePerson} />
                </Form.Group>
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

export default AddFace;