const abbrevDistrictName = require("./abbrevDistrictName")

const reduceSzavazatok = ([{ ellenzek, fidesz, osszes }]) => {
  const result = {}
  for (let { _id, szavazatok } of ellenzek){
    const settlementName = abbrevDistrictName(_id)
    result[settlementName] = { ...(result[settlementName] || {}), ellenzek: szavazatok }
  }
  for (let { _id, szavazatok } of fidesz){
    const settlementName = abbrevDistrictName(_id)
    result[settlementName] = { ...(result[settlementName] || {}), fidesz: szavazatok }
  }
  for (let { _id, szavazatok } of osszes){
    const settlementName = abbrevDistrictName(_id)
    result[settlementName] = { ...(result[settlementName] || {}), osszes: szavazatok }
  }
  return result
}

module.exports = reduceSzavazatok
