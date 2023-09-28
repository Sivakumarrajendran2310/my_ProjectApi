

const express = require('express');
const app = express();
const mqtt = require('mqtt')

const PORT = 7000;
const host = 'broker.emqx.io'
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtt://${host}:${port}`
const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: 'emqx',
    password: 'public',
    reconnectPeriod: 1000,
})

const topic = 'lights/controller'
const topic1 = 'temp/values'
const topic2 = 'humidity/values'
const topic3 = 'moisture/values'
const topic4 = 'motor_state/values'


let att1;
let att2;
let att3;
let att4;

client.on('connect', () => {
    console.log('Connected')
    client.subscribe([topic, topic1, topic2, topic3, topic4], () => {
        console.log(`Subscribe to topic '${topic1},${topic1}`)
    })

})
client.on('message', async (data, payload) => {
    console.log("RecivedMessage :" + payload.toString());
    if (data == topic1) {
        console.log(JSON.parse(payload.toString()))
        att1 = JSON.parse(payload.toString());
    }
    if (data == topic2) {
        console.log(JSON.parse(payload.toString()))
        att2 = JSON.parse(payload.toString());
    }
    if (data == topic3) {
        console.log(JSON.parse(payload.toString()))
        att3 = JSON.parse(payload.toString());
    }
    if (data == topic4) {
        console.log(JSON.parse(payload.toString()))
        att4 = JSON.parse(payload.toString());
    }
})
///////////////////smart watch/////////////////////////////////


app.get('/lights-on', function (req, res) {
    client.publish(topic, '1', { qos: 0, retain: false }, (error) => {
        if (error) {
            console.error(error)
        }
        console.log(topic);
        console.log("lights-on");
        res.send("lights-on");
    })
});

app.get('/lights-off', function (req, res) {
    client.publish(topic, '0', { qos: 0, retain: false }, (error) => {
        if (error) {
            console.error(error)
        }
        console.log(topic);
        console.log("lights-off");
        res.send("lights-off");
    })
});
app.get('/temp-value', function (req, res) {
    return res.json(att1)
});
app.get('/humidity-value', function (req, res) {
    return res.json(att2)
});
app.get('/moisture-value', function (req, res) {
    return res.json(att3)
});
app.get('/pump-value', function (req, res) {
    return res.json(att4)
});
app.get('/', function (req, res) {
    res.status(200).send("<h2>Augmented Reality Api Running</h2>")
});
var server = app.listen(PORT || 7000, '0.0.0.0', function () {
    console.log("Example app listening at :", PORT)
})
