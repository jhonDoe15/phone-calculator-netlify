import React, { Fragment, useEffect, useState, lazy, Suspense } from 'react'
// import allDevices from './allDevices'
// import scores from './scores'
import { Slider } from 'react-semantic-ui-range'
import axios from 'axios'
// import 'semantic-ui-css/semantic.min.css';
import { Segment, Grid, Checkbox, Card } from 'semantic-ui-react';

const PhoneCard = lazy(() => import('../PhoneCard/PhoneCard'));

const renderLoader = () => <h2>Loading... 🥴</h2>;

const PhonesDisplay = () => {

    const [devices, setDevices] = useState([]);
    const [sliderAntutu, setSliderAntutu] = useState(0);
    const [bl, setBl] = useState(0);
    const [ir, setIr] = useState(false);
    const [considerPrice, setConsiderPrice] = useState(false);
    const [nfc, setNfc] = useState(false);
    const [dualSim, setDualSim] = useState(false);
    const [hj, setHj] = useState(false);
    const [edgeScores, setEdgeScores] = useState({});
    const [fileteredDevices, setFileteredDevices] = useState([])

    const settings3 = {
        start: edgeScores.minPerformance,
        min: edgeScores.minPerformance,
        max: edgeScores.topPerformance,
        step: 30000,
        onChange: (value) => {
            setSliderAntutu(value)
        }
    }

    const settings2 = {
        start: edgeScores.minBatteryLife,
        min: edgeScores.minBatteryLife,
        max: edgeScores.topBatteryLife,
        step: 1,
        onChange: (value) => {
            setBl(value)
        }
    }

    const requestHeaders = {
        "Access-Control-Allow-Origin":"*",
        'Content-Type': 'application/json'
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
        // console.log("current toggles", sliderAntutu, bl, hj, dualSim, ir, nfc)
        return input_devices
            .filter(device => device.antutu_score > 0 && device.battery_life > 0 && device.price > 1)
            .filter(phone => phone.antutu_score >= sliderAntutu)
            .filter(phone => phone.battery_life >= bl)
            .filter(phone => (phone.has_nfc && nfc) || !nfc)
            .filter(phone => (phone.has_headphone_jack && hj) || !hj)
            .filter(phone => (phone.has_dual_sim && dualSim) || !dualSim)
            .filter(phone => (phone.has_ir && ir) || !ir)
    }

    const maxScore = () => {
        if(fileteredDevices.length > 0){
            const device = fileteredDevices.reduce(function (a, b) {
                const score = Math.max(calcScoreForDevice(a.antutu_score, a.battery_life, a.price), calcScoreForDevice(b.antutu_score, b.battery_life, b.price));
                return calcScoreForDevice(a.antutu_score, a.battery_life, a.price) === score ? a : b;
            })
            return calcScoreForDevice(device.antutu_score, device.battery_life, device.price);
        }

        return 0
    }

    // const MAX_SCORE = maxScore();

    const calcPoints = (score) => {
        return score / maxScore() * 100;
    }

    const sortedDevices = (input_devices) => {
        return filteredDevices(input_devices)
        .sort((b, a) => calcPoints(calcScoreForDevice(a.antutu_score, a.battery_life, a.price)) - calcPoints(calcScoreForDevice(b.antutu_score, b.battery_life, b.price)))
        .filter(device => calcPoints(calcScoreForDevice(device.antutu_score, device.battery_life, device.price)) > 0)
        // console.log("devices: ", devices)
        // console.log("input_devices: ", input_devices)
        // console.log("filtered input_devices: ", filteredDevices(input_devices))
        // return return_list
    }

    const getMinAntutu = (devices) => {
        return devices.filter(device => device.antutu_score > 0).reduce((prev, curr) => prev.antutu_score > curr.antutu_score ? curr : prev).antutu_score
    }
    const getMaxAntutu = (devices) => {
        return devices.reduce((prev, curr) => prev.antutu_score < curr.antutu_score ? curr : prev).antutu_score
    }
    const getMinBatteryLife = (devices) => {
        return devices.filter(device => device.battery_life > 0).reduce((prev, curr) => prev.battery_life > curr.battery_life ? curr : prev).battery_life
    }
    const getMaxBatteryLife = (devices) => {
        return devices.reduce((prev, curr) => prev.battery_life < curr.battery_life ? curr : prev).battery_life
    }

    useEffect(async () => {
        await axios.get(`http://localhost:5000/phone/all`, {}, requestHeaders)
            .then(res => {
                const devices = res.data;
                setDevices(devices);
                setEdgeScores({
                    minPerformance: getMinAntutu(devices),
                    topPerformance: getMaxAntutu(devices),
                    minBatteryLife: getMinBatteryLife(devices),
                    topBatteryLife: getMaxBatteryLife(devices)
                });
                setBl(getMinBatteryLife(devices))
                setSliderAntutu(getMinAntutu(devices))
            })
    }, []);


    useEffect(() => {
        // debugger;
        if(devices.length>0){
            // console.log(fileteredDevices)
            setFileteredDevices(sortedDevices(devices));
            // console.log(fileteredDevices)
        }
    }, [devices, sliderAntutu, bl, ir, considerPrice, nfc, dualSim, hj])
    

    return (
        <Fragment>
            <Grid style={{ textAlign: 'center' }} padded>
                <Grid.Column width={3}></Grid.Column>
                <Grid.Column width={10}>
                    <Segment inverted >
                        antutu: {sliderAntutu} points
                            <Slider color="red" inverted value={sliderAntutu} settings={settings3} />

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
                    <Suspense fallback={renderLoader()}>
                        <Card.Group>
                        {
                        fileteredDevices.length === 0 ? 
                            <h2>No phones matched criteria</h2>
                        : 
                            fileteredDevices.map(device => {
                                return (
                                    <PhoneCard
                                        style={{ display: 'inline-block' }}
                                        key={device.id}
                                        device={device}
                                        score={calcPoints(calcScoreForDevice(device.antutu_score, device.battery_life, device.price))}
                                    />
                                )
                            })
                        }
                        </Card.Group>
                    </Suspense>
                </div>
                <div className="three wide column"></div>
            </div>
        </Fragment>
    )
}


export default PhonesDisplay;