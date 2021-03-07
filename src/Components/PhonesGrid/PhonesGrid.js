import React, { Fragment, useEffect, useState } from 'react'
import PhoneCard from '../PhoneCard/PhoneCard'
import allDevices from './devices'
import scores from './scores'
import { Slider } from 'react-semantic-ui-range'
import 'semantic-ui-css/semantic.min.css';
import { Segment, Grid, Checkbox, Card } from 'semantic-ui-react';
const PhonesDisplay = props => {

    const [devices, setDevices] = useState(allDevices);
    const [antutu, setAntutu] = useState(0);
    const [bl, setBl] = useState(0);
    const [ir, setIr] = useState(false);
    const [considerPrice, setConsiderPrice] = useState(false);
    const [nfc, setNfc] = useState(false);
    const [dualSim, setDualSim] = useState(false);
    const [hj, setHj] = useState(false);
    const [edgeScores, setEdgeScores] = useState({});

    const settings3 = {
        start: scores.minPerformance,
        min: scores.minPerformance,
        max: scores.topPerformance,
        step: 10000,
        onChange: (value) => {
            setAntutu(value)
        }
    }

    const settings2 = {
        start: scores.minBatteryLife,
        min: scores.minBatteryLife,
        max: scores.topBatteryLife,
        step: 1,
        onChange: (value) => {
            setBl(value)
        }
    }



    const calcScoreForDevice = (antutu, batterylife, price) => {
        let divider = 1;
        if (considerPrice) {
            divider = price
        }
        const benchScore = ((antutu - edgeScores.minPerformance) / (edgeScores.topPerformance - edgeScores.minPerformance));//preformance score
        const batteryScore = ((batterylife - edgeScores.minBatteryLife) / (edgeScores.topBatteryLife - edgeScores.minBatteryLife));//battery life score
        const totalScore = (((benchScore + batteryScore) / 2) * 100) / divider;//Total score without considiration to price
        return totalScore;
    }

    const filteredDevices = (input_devices) => {
        return input_devices
            .filter(device => device.antutu > 0 && device.batterylife > 0 && device.price > 1)
            .filter(phone => phone.antutu >= antutu)
            .filter(phone => phone.batterylife >= bl)
            .filter(phone => (phone.nfc && nfc) || !nfc)
            .filter(phone => (phone.headphonejack && hj) || !hj)
            .filter(phone => (phone.dualsim && dualSim) || !dualSim)
            .filter(phone => (phone.ir && ir) || !ir)
    }

    const maxScore = () => {
        const device = filteredDevices(allDevices).reduce(function (a, b) {
            const score = Math.max(calcScoreForDevice(a.antutu, a.batterylife, a.price), calcScoreForDevice(b.antutu, b.batterylife, b.price));
            return calcScoreForDevice(a.antutu, a.batterylife, a.price) === score ? a : b;
        })
        return calcScoreForDevice(device.antutu, device.batterylife, device.price);
    }

    const MAX_SCORE = maxScore();

    const calcPoints = (score) => {
        return score / MAX_SCORE * 100;
    }
    
    const sortedDevices = (input_devices) => {
        return filteredDevices(input_devices).sort((b, a) => calcPoints(calcScoreForDevice(a.antutu, a.batterylife, a.price)) - calcPoints(calcScoreForDevice(b.antutu, b.batterylife, b.price)))
            .filter(device => calcPoints(calcScoreForDevice(device.antutu, device.batterylife, device.price)) > 0)
    }

    useEffect(() => {
        setEdgeScores(scores);
        setDevices(allDevices);
    }, []);


    const phones = sortedDevices(devices).map((device, index) => {
        return (
            <PhoneCard style={{ display: 'inline-block' }} key={index} device={device} score={calcPoints(calcScoreForDevice(device.antutu, device.batterylife, device.price))} />
        )
    })

    return (
        <Fragment>
            <Grid style={{ textAlign: 'center' }} padded>
                <Grid.Column width={3}></Grid.Column>
                <Grid.Column width={10}>
                    <Segment inverted >
                        antutu: {antutu} points
                            <Slider color="red" inverted value={antutu} settings={settings3} />

                        <br />
                            battery life: {bl} h
                            <Slider color="teal" inverted value={bl} settings={settings2} />
                        <br />
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <h3 style={{ marginRight: '1em' }}>NFC</h3>
                            <Checkbox onChange={(e, data) => setNfc(data.checked)} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <h3 style={{ marginRight: '1em' }}>IR</h3>
                            <Checkbox onChange={(e, data) => setIr(data.checked)} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <h3 style={{ marginRight: '1em' }}>Dual Sim</h3>
                            <Checkbox onChange={(e, data) => setDualSim(data.checked)} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <h3 style={{ marginRight: '1em' }}>Headphone Jack (3.5mm port)</h3>
                            <Checkbox onChange={(e, data) => setHj(data.checked)} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <h3 style={{ marginRight: '1em' }}>Consider Price</h3>
                            <Checkbox onChange={(e, data) => setConsiderPrice(data.checked)} />
                        </div>


                    </Segment>
                </Grid.Column>
                <Grid.Column width={3}></Grid.Column>
            </Grid>
            <div className="ui grid">
                <div className="three wide column"></div>
                <div className="twelve wide column">
                    <Card.Group>
                        {phones}
                    </Card.Group>
                </div>
                <div className="three wide column"></div>
            </div>
        </Fragment>
    )
}


export default PhonesDisplay;