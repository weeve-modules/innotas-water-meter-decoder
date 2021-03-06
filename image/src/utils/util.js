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
const formatTimeDiff = (t1, t2) => {
  const diff = Math.max(t1, t2) - Math.min(t1, t2)
  const SEC = 1000,
    MIN = 60 * SEC,
    HRS = 60 * MIN
  const hrs = Math.floor(diff / HRS)
  const min = Math.floor((diff % HRS) / MIN).toLocaleString('en-US', { minimumIntegerDigits: 2 })
  const sec = Math.floor((diff % MIN) / SEC).toLocaleString('en-US', { minimumIntegerDigits: 2 })
  const ms = Math.floor(diff % SEC).toLocaleString('en-US', { minimumIntegerDigits: 4, useGrouping: false })
  return `${hrs}:${min}:${sec}`
}
const isValidURL = str => {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ) // fragment locator
  return !!pattern.test(str)
}
module.exports = {
  formatPayload,
  formatTimeDiff,
  isValidURL,
}
