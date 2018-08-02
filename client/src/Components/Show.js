import React from "react";
import { Segment, Dropdown, Button, Card, Divider } from 'semantic-ui-react';
import axios from 'axios';

const MyCard = (props) => {
    return(
        <Card>
      <Card.Content>
        <Card.Header>{props.fullName}</Card.Header>
        <Card.Meta>{props.name}</Card.Meta>
        <Card.Description>
          Ta osoba ma w bazie <strong> {props.faces.length} </strong> twarzy
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <div className='ui one buttons'>
          <Button onClick={() => props.deletePerson(props.id)}basic color='red'>
            Usuń osobę
          </Button>
        </div>
      </Card.Content>
    </Card>
    );
}

class ShowAll extends React.Component{
    constructor(){
        super();
        this.state = {
            personGroupsOptions: [],
            personGroupId: '',
            persons: [],
        }
    }

    componentDidMount(){
        this.setPersonGroupDropdownOptions();
    }

    setPersonGroupDropdownOptions = () => {
        this.getPersonGroups()
            .then(res => {
                const options = res.map(item => {
                    let opt = {}
                    opt.text = item.name;
                    opt.value = item.personGroupId;
                    opt.key = item.personGroupId;
                    return opt;
                })
                this.setState({
                    personGroupsOptions: options
                })
            })
            .catch(err => console.log(err));
    }

    getPersonGroups = () => {
        return new Promise((resolve, reject) => {
            axios.get('/get/persongroups')
                .then(res => resolve(res.data))
                .catch(err => reject(err));
        })
    }

    getPersons = () => {
        return new Promise((resolve, reject) => {
            axios.get(`/get/personlist/${this.state.personGroupId}`)
                .then(res => resolve(res.data))
                .catch(err => reject(err));
        })  
    }

    dropdownChange = (event, data) => {
        this.setState({
            personGroupId: data.value,
        }, () => {
            this.getPersons().then(res =>{
                this.setState({
                    persons: res
                })
            });
        });
    }

    deletePerson = (id) =>{
        axios({
            method: 'delete',
            url: `delete/person/?personGroupId=${this.state.personGroupId}&personId=${id}`,
        }).then(res => {
                console.log(res);
                this.getPersons().then(res => {this.setState({
                    persons: res
                })
            });
        })
    }

    deleteGroup = () => {
        if(this.state.personGroupId === null || this.state.personGroupId === ''){
            alert("Wybierz grupę!");
            return;
        }
        axios({
            method: 'delete',
            url: `delete/persongroup/${this.state.personGroupId}`,
        }).then(res => {
            console.log(res);
            this.setPersonGroupDropdownOptions();
        });

    }

    render(){
        this.state.persons.map(item => console.log(item));
        return(
            <Segment>
                <label>
                    Wybierz grupę
                </label>
                <Divider />
            <Dropdown placeholder="Grupa" options={this.state.personGroupsOptions} selection onChange={this.dropdownChange} />
            {this.state.personGroupId &&  <div><Divider />
            <Button negative onClick={this.deleteGroup}> Usuń Grupę </Button>
            <Divider horizontal>
             Liczba osób w grupie: {this.state.persons.length}
            </Divider></div>}
            <Divider />
            <Card.Group>
                {this.state.persons.map(item => (
                    <MyCard key={item.personId} id={item.personId} name={item.name} fullName={item.userData} faces={item.persistedFaceIds} deletePerson={this.deletePerson}/>
                ))}
            </Card.Group>
            </Segment>
        );
    }
}

export default ShowAll;