import React, { useState, useEffect } from 'react';
import { AutoComplete } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons'
import styled from 'styled-components'

const optionFilter = (input, { value }) => (
  value.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
)

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

const StreetAutoComplete = ({
  onSelect,
  options: initialOptions,
  onChange,
  value,
  ...rest
}) => {
  const [options, setOptions] = useState()

  useEffect(() => {
    setOptions(initialOptions);
  }, [initialOptions])

  const onSearch = subStr => {
    const filteredOptions = initialOptions.filter(({ value }) => value.toUpperCase().includes(subStr.toUpperCase()))
    setOptions(filteredOptions)
  }

  const handleOnSelect = (...attr) => {
    onSelect(...attr)
  }

  return (
    <Wrap>
      <AutoComplete
        value={value}
        options={options}
        onSelect={handleOnSelect}
        onSearch={onSearch}
        onChange={onChange}
        placeholder="Közterület"
        filterOption={optionFilter}
        spellCheck={false}
        {...rest}
      />
      {!!options?.length && !value && <CaretDownStyled />}
    </Wrap>
  );
};

export default StreetAutoComplete
