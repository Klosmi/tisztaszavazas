import { useState } from 'react';

import {
  Button,
  Popover,
  Input,
  Space,
  Select,
} from 'antd';
import styled from 'styled-components';

const Error = styled.div`
  color: red;
`

const SettlementSaveLoad = ({
  onConfirmSave,
  isPopoverOpen,
  onClickSave,
  saveError,
  onCancel,
  onClickLoad,
  isLoadOpen,
  loadOptions,
  onCancelLoad,
  onConfirmLoad,
}) => {

  const [savingName, setSavingName] = useState('')
  const [selectedName, setSelectedName] = useState('')

  const handleSave = () => {
    onConfirmSave(savingName)
  }

  const handleLoad = () => {
    onConfirmLoad(selectedName)
  }

  return (
    <Space>
      <Popover
        placement="top"
        title="Település-beosztás mentése"
        visible={isPopoverOpen}
        onClose={() => setSaving(false)}
        content={<Space>
          <Input
            placeholder="a beosztás neve"
            value={savingName}
            onChange={({ target: { value }}) => setSavingName(value)}
          />
          <Button
            type="primary"
            onClick={handleSave}
            >
            Mentés
          </Button>
          <Button
            onClick={onCancel}
            >
            Mégsem
          </Button>
          <Error>
            {saveError}
          </Error>
        </Space>}
      >
        <Button 
          onClick={onClickSave}
          >
          Beosztás mentése
        </Button>
      </Popover>
      <Popover
        title="Beosztás betöltése"
        visible={isLoadOpen}
        content={
          <Space>
            <Select
              placeholder="Beosztás kiválasztása"
              onSelect={setSelectedName}
            >
              {
                loadOptions.map(({ id, name }) => (
                  <Select.Option key={id}>{name}</Select.Option>
                ))
              }
            </Select>
            <Button
              onClick={handleLoad}
              >
              Betöltés  
              </Button>
            <Button
              onClick={onCancelLoad}
              >
              Mégsem
            </Button>
          </Space>
        }
      >
        <Button
          onClick={onClickLoad}
          >
          Beosztás betöltése
        </Button>
      </Popover>
    </Space>
  )
}

export default SettlementSaveLoad
