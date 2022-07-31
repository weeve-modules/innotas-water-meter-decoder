const { NESTED_RESPONSE } = require('../config/config')
const formatPayload = json => {
  let t = null
  if (!json.rxInfo[0]['time']) {
    t = Date.now()
  } else {
    if (json.rxInfo[0]['time'].toString() == parseInt(json.rxInfo[0]['time']).toString())
      t = new Date(parseInt(json.rxInfo[0]['time'])).getTime()
    else t = new Date(json.rxInfo[0]['time']).getTime()
  }
  let output = {
    //convert ISO date time to timestamp
    timestamp: t,
    devEUI: json['devEUI'],
    deviceName: json['deviceName'],
  }
  let fields = []
  //not nested
  if (fields.length == 0 && NESTED_RESPONSE == 'no') {
    Object.keys(json.data).forEach(key => {
      if (json.data[key] === false) output[key] = 'false'
      else if (json.data[key] === true) output[key] = 'true'
      else output[key] = json.data[key]
    })
  }
  //nested, no custom fields
  if (fields.length == 0 && NESTED_RESPONSE == 'yes') {
    output['data'] = json.data
  }
  return output
}
module.exports = {
  formatPayload,
}
