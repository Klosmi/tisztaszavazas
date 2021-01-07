import React, { useRef, useContext } from 'react';
import styled from 'styled-components'
import {
  Select
} from 'antd';
import { AppContext } from '../Layout'

const {
  Option
} = Select

const StyledArea = styled.div`
  position: fixed;
  bottom: 40px;
  right: 0px;
  width: 300px;
`

const ElectionSelector = () => {
  const areaEl = useRef(null);

  const { election, setElection } = useContext(AppContext)

  return (
    <>
    <StyledArea ref={areaEl} />
      <p>választás:</p>
      <Select
        bordered={false}
        value={election}
        onChange={setElection}
        getPopupContainer={() => areaEl.current}
        placeholder="Választás"
        >
        <Option value="ogy2018">2018 országgyűlési</Option>
        <Option value="onk2019">2019 önkormányzati</Option>
        <Option value="idbo620">2020 időközi országgyűlési - Borsod 6</Option>
      </Select>
    </>
  )
}

export default ElectionSelector
