import React, { Fragment, useEffect, useState } from 'react'
import PhoneCard from '../PhoneCard/PhoneCard'
import allDevices from './devices'
import scores from './scores'
import { Slider } from 'react-semantic-ui-range'
import 'semantic-ui-css/semantic.min.css';
import { Segment, Grid } from 'semantic-ui-react';
const PhonesDisplay = props => {

    const [devices, setDevices] = useState(allDevices);
    const [antutu, setAntutu] = useState(0);
    const [bl, setBl] = useState(0);
    const [edgeScores, setEdgeScores] = useState({});

    const settings3 = {
        start: scores.minPerformance,
        min: 0,
        max: scores.topPerformance,
        step: 100,
        onChange: (value) => {
            setAntutu(value)
            setDevices(allDevices.filter(phone => phone.antutu >= value))
        }
    }

    const settings2 = {
        start: scores.minBatteryLife,
        min: 0,
        max: scores.topBatteryLife,
        step: 1,
        onChange: (value) => {
            setBl(value)
            setDevices(allDevices.filter(phone => phone.batterylife >= value))
        }
    }

    const calcScoreForDevice = (antutu, batterylife) => {
        const benchScore = ((antutu - edgeScores.minPerformance) / (edgeScores.topPerformance - edgeScores.minPerformance));//preformance score
        const batteryScore = ((batterylife - edgeScores.minBatteryLife) / (edgeScores.topBatteryLife - edgeScores.minBatteryLife));//battery life score
        const totalScore = (benchScore + batteryScore) / 2 * 100;//Total score without considiration to price
        return totalScore;
    }

    const sortedDevices = (input_devices) => {
        return input_devices.sort((b, a) => calcScoreForDevice(a.antutu, a.batterylife) - calcScoreForDevice(b.antutu, b.batterylife))
            .filter(device => device.antutu > 0 && device.batterylife > 0)
            .filter(device => calcScoreForDevice(device.antutu, device.batterylife) > 0)
    }

    useEffect(() => {
        setEdgeScores(scores);
        setDevices(allDevices);
    }, []);


    const firstColoumn = sortedDevices(devices).filter((device, index) => (parseInt(index) % 3) === 0).map((device, index) => {
        return (
            <PhoneCard key={index} device={device} score={calcScoreForDevice(device.antutu, device.batterylife)} />
        )
    })
    const secondColoumn = sortedDevices(devices).filter((device, index) => (parseInt(index) % 3) === 1).map((device, index) => {
        return (
            <PhoneCard key={index} device={device} score={calcScoreForDevice(device.antutu, device.batterylife)} />
        )
    })
    const thirdColoumn = sortedDevices(devices).filter((device, index) => (parseInt(index) % 3) === 2).map((device, index) => {
        return (
            <PhoneCard key={index} device={device} score={calcScoreForDevice(device.antutu, device.batterylife)} />
        )
    })

    return (
        <Fragment>
            <Grid style={{ textAlign: 'center' }} padded>
                <Grid.Column width={3}></Grid.Column>
                <Grid.Column width={10}>
                    <Segment inverted>
                            antutu: {antutu} points
                            <Slider color="red" inverted value={antutu} settings={settings3} />
                            
                            <br/>
                            battery life: {bl} h
                            <Slider color="teal" inverted value={bl} settings={settings2} />
                            

                    </Segment>
                </Grid.Column>
                <Grid.Column width={3}></Grid.Column>
            </Grid>
            <div className="ui grid">
                <div className="two wide column"></div>
                <div className="four wide column">
                    {firstColoumn}
                </div>
                <div className="four wide column">
                    {secondColoumn}
                </div>
                <div className="four wide column">
                    {thirdColoumn}
                </div>
                <div className="two wide column"></div>
            </div>
        </Fragment>
    )
}


export default PhonesDisplay;