import React from "react";
import { Icon, Menu, Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const MenuItem = (props) => {
    return(
        <Menu.Item> 
            <Link to={`/${props.funcParam}`}>  
                { props.ButtonText }
                <Icon name={props.icon} />
            </Link>
        </Menu.Item>
    );
}

const DropdownItem = (props) => {
    return(
            <Dropdown.Item>
                <Link to={`/${props.funcParam}`}>
                    <Icon name={props.icon} />
                    {props.ButtonText}
                </Link>
            </Dropdown.Item>
    )
}

const MainMenu = (props) => {
    return(
        <Menu >
            <MenuItem funcParam="home" ButtonText="Home"  icon="home"/>
            <MenuItem funcParam="analyze" ButtonText="Analiza"  icon="image"/>
            <MenuItem funcParam="identify" ButtonText="Identyfikuj"  icon="image"/>
            <Dropdown item text='Dodaj' button icon='plus' className='icon'>
                <Dropdown.Menu>
                    <DropdownItem funcParam="addface" ButtonText="Twarz" icon="plus" />
                    <DropdownItem funcParam="addperson" ButtonText="Osoba" icon="plus" />
                    <DropdownItem funcParam="addpersongroup" ButtonText="Grupa osób" icon="plus" />
                </Dropdown.Menu>
            </Dropdown>
            <MenuItem funcParam="show" ButtonText="Wyświetl" icon="users"/>
        </Menu> 
    )
}

export default MainMenu;