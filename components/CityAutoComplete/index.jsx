import React, { useState } from 'react';
import { AutoComplete } from 'antd';

export default ({ onSelect, onSearch, onChange: propOnChange, options = [], value: propValue = '' }) => {
  const [value, setValue] = useState(propValue)

  const onChange = (value, { label }) => {
    setValue(label || value);
    propOnChange(label || value)
    if (!value && !label) onSearch(null)
  }

  return (
    <AutoComplete
      value={propValue || value}
      options={options}
      style={{
        width: 200,
      }}
      onSelect={onSelect}
      onSearch={onSearch}
      onChange={onChange}
      placeholder="Település"
      spellCheck={false}
    />
  );
};