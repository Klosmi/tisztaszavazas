const abbrevDistrictName = settlementName => {
  if (settlementName && settlementName.substr && settlementName.substr(0,8) === 'Budapest'){
    return settlementName.replace('Budapest ', 'BP ').replace('. kerület', '').replace('.ker', '')
  }
  return settlementName
}

module.exports = abbrevDistrictName
