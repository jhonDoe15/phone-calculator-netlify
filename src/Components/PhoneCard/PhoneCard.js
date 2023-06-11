import React from 'react';
import { Card, Icon, Image } from 'semantic-ui-react'

const PhoneCard = ({device, score}) => {

    const getTwoDecimalPoints = (score) => {
        if (score) {
           return score.toFixed(3); 
        }
        return score;
    }

    console.log("here")

    return (
        <Card>
            <Image src={device.image_url} size="small" className="centered" style={{backgroundColor: 'black', color: 'white'}} />
            <Card.Content style={{backgroundColor: 'black', color: 'white'}}>
                <Card.Header style={{backgroundColor: 'black', color: 'white'}}>{device.device_name}</Card.Header>
                <Card.Meta style={{backgroundColor: 'black', color: 'white'}}>
                    <span className='date'>Launched in {device.year}</span>
                </Card.Meta>
                <Card.Description style={{ textAlign: 'left', fontSize: '1.3em',backgroundColor: 'black', color: 'white' }}>
                    IR: {device.has_ir === true ? "True" : "False"}<br />
                    NFC: {device.has_nfc === true ? "True" : "False"}<br />
                    DUALSIM: {device.has_dual_sim === true ? "True" : "False"}<br />
                    3.5mm Jack: {device.has_headphone_jack === true ? "True" : "False"}<br />
                    Battery Life: {device.battery_life}<br />
                    Price: {device.price}$<br />
                    Screen Size: {device.screen_size}<br />
                    Antutu: {device.antutu_score}<br />
                </Card.Description>
            </Card.Content>
            <Card.Content extra style={{backgroundColor: 'black', color: 'white'}}>
                <Icon color="red" name='certificate' />
                {getTwoDecimalPoints(score)}
            </Card.Content>
        </Card>
    )
}

export default PhoneCard;
