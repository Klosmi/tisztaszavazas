import React, { useEffect, useState } from 'react';

import {
  Select,
  Form
} from 'antd';

const { Option } = Select;

export default () => {
  // const ipcRenderer = electron.ipcRenderer || false;
  const [dbValue, setDbValue] = useState()
/* 
  useEffect(() => {
    if (ipcRenderer) {
      const { db } = ipcRenderer.sendSync('get-config')
      setDbValue(db)
    }
  }, [])

  const handleChange = (db) => {
    const config = ipcRenderer.sendSync('get-config')    
    ipcRenderer.send('set-config', { ...config, db });
    setDbValue(db)
  } */

  return (
    <>
      <Form.Item
        label="választás"
      >
        <Select
          // value={dbValue}
          // onChange={handleChange}
          placeholder="Választás"
          >
          <Option value="ogy2018">2018 országgyűlési</Option>
          <Option value="onk2019">2019 önkormányzati</Option>
          <Option value="idbo620">2020 időközi országgyűlési - Borsod 6</Option>
        </Select>
      </Form.Item>
    </>
  )
}
