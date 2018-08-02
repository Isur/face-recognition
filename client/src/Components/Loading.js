import React from 'react';
import { Message, Icon } from 'semantic-ui-react';

const Loading = () => {
    return(
        <Message icon size="massive">
            <Icon name='circle notched' loading size="huge"/>
                <Message.Content>
                    <Message.Header>Wczytywanie danych</Message.Header>
                    Proszę chwilkę zaczekać
                </Message.Content>
        </Message>
    )
}

export default Loading;