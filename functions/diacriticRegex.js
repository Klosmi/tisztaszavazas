export default str => {
  return str
    .replace(/[ö]/ig, '[öő]')
    .replace(/[o]/ig, '[oóöő]')
    .replace(/[a]/ig, '[aá]')
    .replace(/[e]/ig, '[eé]')
    .replace(/[i]/ig, '[ií]')
    .replace(/[ü]/ig, '[üű]')
    .replace(/[u]/ig, '[uúüű]')
}
