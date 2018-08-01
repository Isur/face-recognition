import React from "react";
import { Icon, Menu, Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const MenuItem = (props) => {
    return(
        <Menu.Item> 
            <Link to={`/${props.funcParam}`}>  
                <Icon name={props.icon} />
                { props.ButtonText }
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
        <Menu icon="labeled">
            <MenuItem funcParam="home" ButtonText="Home"  icon="home"/>
            <MenuItem funcParam="analyze" ButtonText="Analiza"  icon="image"/>
            <MenuItem funcParam="identify" ButtonText="Identyfikuj"  icon="image"/>
            <Dropdown item text='Add' color="blue">
                <Dropdown.Menu>
                    <DropdownItem funcParam="addface" ButtonText="Twarz" icon="plus" />
                    <DropdownItem funcParam="addperson" ButtonText="Osoba" icon="plus" />
                    <DropdownItem funcParam="addpersongroup" ButtonText="Grupa osób" icon="plus" />
                </Dropdown.Menu>
            </Dropdown>

        </Menu> 
    )
}

export default MainMenu;