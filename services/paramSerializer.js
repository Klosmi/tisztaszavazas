const paramSerializer = (query = {}) => {
  const params = Object.entries(query).filter(([_, value]) => !!value)

  return params.reduce((acc, [key, value], i) => {
    let nextParam;
    if (Array.isArray(value)) {
      nextParam = value.reduce((acc, arrItem, i) => `${acc}${i ? '&' : ''}${key}=${encodeURIComponent(arrItem)}`, '')
    } else  {
      nextParam = `${key}=${encodeURIComponent(value)}`
    }
    
    return `${acc}${i ? '&' : ''}${nextParam}`
  }, params.length ? '?' : '') 
}

module.exports = paramSerializer
