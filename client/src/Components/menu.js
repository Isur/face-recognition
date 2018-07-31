import React from "react";
import { Icon, Menu } from 'semantic-ui-react';
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

const MainMenu = (props) => {
    return(
        <Menu icon="labeled" inverted>
            <MenuItem funcParam="home" ButtonText="Home"  icon="home"/>
            <MenuItem funcParam="analyze" ButtonText="Analiza"  icon="image"/>
            <MenuItem funcParam="identify" ButtonText="Identyfikuj"  icon="image"/>
        </Menu> 
    )
}

export default MainMenu;