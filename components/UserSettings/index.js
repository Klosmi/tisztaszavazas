import React, { useEffect, useState } from 'react';
/* import jwtDecode from 'jwt-decode'
import {
  Input,
  Form
} from 'antd';
 */

export default () => {
  return null
  con/* st ipcRenderer = electron.ipcRenderer || false;
  const [tokenInputValue, setTokenInputValue] = useState()

  useEffect(() => {
    if (ipcRenderer) {
      const { token } = ipcRenderer.sendSync('get-config')
      setTokenInputValue(token)
    }
  }, [])

  const handleInputChange = ({ target: { value: token }}) => {
    const config = ipcRenderer.sendSync('get-config')      
    ipcRenderer.send('set-config', { ...config, token });
    setTokenInputValue(token)
  }

  return (
    <>
      <Form.Item
        label="kulcs"
      >
        <Input
          placeholder="személyes kulcs"
          onChange={handleInputChange}
          value={tokenInputValue}  
          />
      </Form.Item>
      <p>{tokenInputValue && jwtDecode(tokenInputValue)?.name}</p>
      
    </>
  ) */
}
