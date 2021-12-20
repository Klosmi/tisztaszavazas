const If = ({ condition, children }) => {
  if (condition) return children
  return null
}

export default If
