const reduceSzavazatok = ([{ ellenzek, fidesz, osszes }]) => {
  const result = {}
  for (let { _id, szavazatok } of ellenzek){
    result[_id] = { ...(result[_id] || {}), ellenzek: szavazatok }
  }
  for (let { _id, szavazatok } of fidesz){
    result[_id] = { ...(result[_id] || {}), fidesz: szavazatok }
  }
  for (let { _id, szavazatok } of osszes){
    result[_id] = { ...(result[_id] || {}), osszes: szavazatok }
  }
  return result
}

module.exports = reduceSzavazatok
