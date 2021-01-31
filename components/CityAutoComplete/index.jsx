import React, { useState } from 'react'
import { AutoComplete } from 'antd'
import { CaretDownOutlined } from '@ant-design/icons'
import styled from 'styled-components'

const Wrap = styled.div`
  position: relative;
  border: none;
`

const CaretDownStyled = styled(CaretDownOutlined)`
  position: absolute;
  z-index: 4;
  right: 6px;
  top: 10px;
`

const CityAutoComplete = ({
  onSelect,
  onSearch,
  onChange: propOnChange,
  options = [],
  value: propValue = '',
  ...rest
}) => {
  const [value, setValue] = useState(propValue)
  // const [isOpen, setIsOpen] = useState(false)

  const onChange = (value, { label }) => {
    setValue(label || value);
    propOnChange(label || value)
    if (!value && !label) onSearch(null)
  }

  const handleOnSelect = (...attr) => {
    onSelect(...attr)
  }

  return (
    <Wrap>
      <AutoComplete
        value={propValue || value}
        options={options}
        onSelect={handleOnSelect}
        onSearch={onSearch}
        onChange={onChange}
        placeholder="Település"
        spellCheck={false}
        {...rest}
      />
      {!!options?.length && !value && <CaretDownStyled />}
    </Wrap>    
  );
};

export default CityAutoComplete
