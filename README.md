# Innotas Water Sensor Decoder

|  |  |
| --- | --- |
| Name | Innotas Water Sensor Decoder |
| Version | v1.0.0 |
| DockerHub | [weevenetwork/innotas-water-meter-decoder](https://hub.docker.com/r/weevenetwork/innotas-water-meter-decoder) |
| Authors | Mesud Pasic |

- [Innotas Water Sensor Decoder](#Innotas-water-sensor-decoder)
  - [Description](#description)
  - [Features](#features)
  - [Environment Variables](#environment-variables)
    - [Module Specific](#module-specific)
    - [Set by the weeve Agent on the edge-node](#set-by-the-weeve-agent-on-the-edge-node)
  - [Dependencies](#dependencies)

## Description

Decoder for Innotas Water Sensor decodes "data" payload into human-friendly format. Depending on incoming fPort value output will provide:

- current meter reading in Liter
- meter reading on due day in Liter
- min. flow rate of last day
- max. flow rate of last day
- duration of standstill of last day
- number of last day’s meter starts
- flow volume in previous hour
- flow volume in previous 2 hours
- flow volume in previous 3 hours
- flow volume in previous 4 hours

- Incoming payload looks like this

```js
{
  "applicationID": "201",
  "applicationName": "101857881-102108017-",
  "deviceName": "B0B353FFFE40366A",
  "devEUI": "sLNT//5ANmo=",
  "rxInfo": [
    {
      "gatewayID": "cnb/AC4IAkQ=",
      "time": "2022-07-11T10:44:40.458589Z",
      "timeSinceGPSEpoch": null,
      "rssi": -98,
      "loRaSNR": 8.2,
      "channel": 5,
      "rfChain": 0,
      "board": 21,
      "antenna": 0,
      "location": {
        "latitude": 53.55903244018555,
        "longitude": 9.893827438354492,
        "altitude": 37,
        "source": "UNKNOWN",
        "accuracy": 0
      },
      "fineTimestampType": "NONE",
      "context": "+dHXLA==",
      "uplinkID": "kK0pNEsCSiOIz0uG0WEn3w==",
      "crcStatus": "CRC_OK"
    }
  ],
  "txInfo": {
    "frequency": 868100000,
    "modulation": "LORA",
    "loRaModulationInfo": {
      "bandwidth": 125,
      "spreadingFactor": 7,
      "codeRate": "4/5",
      "polarizationInversion": false
    }
  },
  "adr": true,
  "dr": 5,
  "fCnt": 300,
  "fPort": 3,
  "data": "AAADjQ==",
  "objectJSON": "",
  "tags": {
    "deviceProfileId": "0c86cf8b-a8b2-45b1-ad36-a59c20404b24",
    "deviceProfileName": "Innotas Wasserzähler Aufsatz"
  },
  "confirmedUplink": true,
  "devAddr": "AUIKYQ=="
}
```

- Decoded output passed to next module via POST call, depending on fPort will look like this

```js
{
	"timestamp": 1657536280458,
	"devEUI": "b0b353fffe40366a",
	"deviceName": "B0B353FFFE40366A",
	"currentMeterReading": 909,
	"maxFlowOfLastDay": 0,
	"durationStandStillLastDay": null,
	"lastDayMeterStarts": 0,
	"minFlowOfLastDay": 0
}

```

- Depending on environment variables NESTED_RESPONSE output can be nestd with few fields or with all fields in "data" property, for example:
- - when nested

```js
{
  timestamp: '1647945089527',
  devEUI: 'B0B353FFFE40366A',
  deviceName: 'B0B353FFFE40366A',
  data: {
    	currentMeterReading: 909,
      maxFlowOfLastDay: 0,
      durationStandStillLastDay: 1,
      lastDayMeterStarts: 0,
      minFlowOfLastDay: 0
  }
}
```

- - when not nested

```js
{
  timestamp: '1647945089527',
  devEUI: 'B0B353FFFE40366A',
  deviceName: 'B0B353FFFE40366A',
  currentMeterReading: 909,
  maxFlowOfLastDay: 0,
  durationStandStillLastDay: 1,
  lastDayMeterStarts: 0,
  minFlowOfLastDay: 0
}
```

## Features

- Parsing Melita.io data for water sensor

## Environment Variables

| Environment Variables | type | Description |
| --- | --- | --- |
| NESTED_RESPONSE | string | yes/no enum type, determines if sensor "date" property will be passed in data property or if properties will be extracted as single items and passed with rest of the payload |

### Module Specific

### Set by the weeve Agent on the edge-node

| Environment Variables | type   | Description                                    |
| --------------------- | ------ | ---------------------------------------------- |
| MODULE_NAME           | string | Name of the module                             |
| MODULE_TYPE           | string | Type of the module (Input, Processing, Output) |
| INGRESS_HOST          | string | Host where app is running                      |
| INGRESS_PORT          | string | Port where app is running                      |
| EGRESS_URLS           | string | HTTP ReST endpoint for the next module         |

## Dependencies

```js
"dependencies": {
    "body-parser": "^1.19.2",
    "express": "^4.17.3",
    "express-winston": "^4.2.0",
    "node-fetch": "^2.6.1",
    "winston": "^3.6.0"
}
```
