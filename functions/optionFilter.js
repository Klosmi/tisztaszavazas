const optionFilter = (input, option) => (
  option.label.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
)

export default optionFilter
