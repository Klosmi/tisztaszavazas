import React, { useState, useEffect } from 'react';
import { AutoComplete } from 'antd';

export default ({ onSelect, options: initialOptions, onChange, value }) => {
  const [options, setOptions] = useState()

  useEffect(() => {
    setOptions(initialOptions);
  }, [initialOptions])  

  const onSearch = subStr => {
    const filteredOptions = initialOptions.filter(({ value }) => value.toUpperCase().includes(subStr.toUpperCase()))
    setOptions(filteredOptions)
  }

  return (
    <AutoComplete
      value={value}
      options={options}
      style={{
        width: 200,
      }}
      onSelect={onSelect}
      onSearch={onSearch}
      onChange={onChange}
      placeholder="Közterület"
      spellCheck={false}
    />
  );
};