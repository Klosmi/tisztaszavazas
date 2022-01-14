const readJsonFile = (path = 'data/settlementsSimplified.json') => {
  const fs = require('fs')
  const result = fs.readFileSync(`${process.cwd()}/${path}`, () => null)
  return JSON.parse(result)
}

module.exports = readJsonFile
