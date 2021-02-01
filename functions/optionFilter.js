import diacriticRegex from './diacriticRegex'

const optionFilter = (input, option) => {
  return option.label.toString().match(new RegExp(`^${diacriticRegex(input)}`, 'i'))
}

export default optionFilter
