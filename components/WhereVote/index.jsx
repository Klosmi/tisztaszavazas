import React, { useContext, useReducer, useState } from 'react';
import {
  Popover,
  Input as AntdInput,
} from 'antd';
import styled from 'styled-components'
import tszService from '../../services/tszService';
import CityAutoComplete from '../CityAutoComplete';
import StreetAutoComplete from '../StreetAutoComplete';
import { AppContext } from '../Layout'

const Table = styled.div`
  display: flex;
  flex-direction: column;
`

const Thead = styled.div`
  display: flex;
  flex-direction: row;
  div {
    font-weight: bold;
    min-width: 200px;
    padding-left: 12px;

    &.hsz {
      min-width: 80px;
      padding-left: 6px;
    }

    &.vk {
      min-width: 350px;
    }
  }
`

const Tbody = styled.div`
  display: flex;
  flex-direction: column;
`

const RowWrap = styled.div`
  display: flex;
  flex-direction: row;
  input:disabled {
    cursor: pointer;
  }
`

const Input = styled(AntdInput)`
  ${({ width = 200 }) => `width: ${width}px;`}
`

const SzavazokorLinkWrap = styled.div`
  padding: 5px 12px;
  
  ${({ onClick, isPointer }) => {
    if (onClick) {
      return `
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }  
      `
    }
    if (isPointer) {
      return `cursor: pointer;`
    }
  }}
`

const OevkWrap = styled.div`
  width: 350px;
  padding: 5px 12px;
  ${({ isPointer }) => {
    if (isPointer) {
      return `cursor: pointer;`
    }
  }}
`

const reducer = (state, action = {}) => {
  console.log(action)
  const { type, id, key, value, result, cityList, streetList, totalCount } = action;
  switch(type){
    case 'EDIT': return state.map(record => (
      record.id === id ? {...record, [key]: value } : record
    ))
    case 'SEARCHSZK__SUCCESS': return state.map(record => (
      record.id === id ? { ...record, result, totalCount } : record
    ))
    case 'GET_CITY_LIST__SUCCESS': return state.map(record => (
      record.id === id ? { ...record, cityList } : record
    ))
    case 'GET_STREETS__SUCCESS': return state.map(record => (
      record.id === id ? { ...record, streetList } : record
    ))
    case 'CLEAR_CITY_LIST': return state.map(record => (
      record.id === id ? { ...record, cityList: [], result: undefined } : record
    ))
    case 'ADD_ROW': return [
      ...state,
      { id: +new Date() }
    ]
    default: return state
  }

}

const SzavazokorLink = ({ result, onClick, totalCount }) => {
  if (result?.length === 1) {
    const { _id, kozigEgyseg: { kozigEgysegNeve }, szavazokorSzama } = result[0]
    return (
      <>
        <SzavazokorLinkWrap onClick={() => onClick(_id)}>
          <span>{`${kozigEgysegNeve}`} <strong>{`${szavazokorSzama}. sz`}</strong></span>
        </SzavazokorLinkWrap>
      </>
    )
  }

  if (result?.length > 1) {
    if (totalCount <= 20) {
      const popoverContent = result.map(({ szavazokorCime, szavazokorSzama }) => <p>{szavazokorSzama} sz.: {szavazokorCime}</p>)
      return (
        <Popover content={popoverContent} trigger="hover, click">
          <SzavazokorLinkWrap
            isPointer>
            {totalCount} szavazókör
          </SzavazokorLinkWrap>
        </Popover>      
      )
    }

    return (
      <SzavazokorLinkWrap>
        {totalCount} szavazókör
      </SzavazokorLinkWrap>
    )
  }

  return <SzavazokorLinkWrap>-</SzavazokorLinkWrap>
}

const EvkLink = ({ result }) => {
  if (!result) return null;
  const allEvks = Object.keys(result.reduce((acc, { valasztokerulet }) => {
    acc[valasztokerulet.leiras] = valasztokerulet.szam
    return acc
  }, {}))

  if (allEvks?.length === 1) {
    return <OevkWrap>{allEvks[0]}</OevkWrap>
  }
  
  if (allEvks?.length > 1) {
    const popoverContent = allEvks.map(evk => <p>{evk}</p>)
    return (
      <Popover content={popoverContent} trigger="hover, click">
        <OevkWrap
          isPointer>
          {allEvks.length} választókerület
        </OevkWrap>
      </Popover>
    )
  }

  return null;
}

const fetchSzkByAddress = ({
  state,
  dispatch,
  id,
  key,
  value,
  election,
}) => {;(async() => {
    dispatch({ type: 'SEARCHSZK', id, key, value })
    const record = state.find(r => r.id === id)    
    const { data: result, headers } = await tszService.getSzkByAddress({
      ...record, [key]: value
    },
    election)
    dispatch({ type: 'SEARCHSZK__SUCCESS', id, result, totalCount: headers['x-total-count'] })
})()}

const fetchCityList = ({
  dispatch,
  id,
  citySubstr,
  election,
}) => {;(async() => {
    dispatch({ type: 'GET_CITY_LIST', id, citySubstr })
    const cityList = await tszService.getCityList(citySubstr, election)
    dispatch({ type: 'GET_CITY_LIST__SUCCESS', id, cityList })
})()}

const fetchStreets = ({
  dispatch,
  id,
  cityId,
  election,
}) => {;(async() => {
    dispatch({ type: 'GET_STREETS', id })
    const streetList = await tszService.getSreets(cityId, election)
    dispatch({ type: 'GET_STREETS__SUCCESS', id, streetList })
})()}

export default ({ onSzavazokorClick }) => {
  const initialState = [
    { id: 'd1', city: '', result: null },
    { id: 'd2', city: '', result: null },
  ]
  const [state, dispatch] = useReducer(reducer, initialState)
  const { election } = useContext(AppContext)

  const[to, setTo] = useState();
  const debounce = (cb, t = 600) => {
    clearTimeout(to)
    setTo(setTimeout(cb, t))
  }

  const handleCityChange = (id, value) => {
    dispatch({ type: 'EDIT', id, key: 'city', value })
    dispatch({ type: 'EDIT', id, key: 'address', value: '' })
    debounce(() => fetchSzkByAddress({ state, dispatch, id, key: 'city', value, election }))
  }

  const handleAddressChange = (id, value) => {
    dispatch({ type: 'EDIT', id, key: 'address', value })
  }

  const handleAddressSelect = (id, value) => {
    dispatch({ type: 'EDIT', id, key: 'address', value })
    debounce(() => fetchSzkByAddress({state, dispatch, id, key: 'address', value, election }))
  }

  const handleHouseNrChange = (id, value) => {
    dispatch({ type: 'EDIT', id, key: 'houseNr', value })
    debounce(() => fetchSzkByAddress({state, dispatch, id, key: 'houseNr', value, election }))
  }
  
  const handleCitySelect = (id, value, cityId) => {
    dispatch({ type: 'EDIT', id, key: 'city', value })
    dispatch({ type: 'EDIT', id, key: 'address', value: '' })
    debounce(() => fetchSzkByAddress({state, dispatch, id, key: 'city', value, election }))
    debounce(() => fetchStreets({ dispatch, id, cityId, election })) 
  }
  
  const handleAddressSearch = async (id, citySubstr) => {
    if (!citySubstr || citySubstr.length < 3) return dispatch({ type: 'CLEAR_CITY_LIST', id })
    debounce(() => fetchCityList({ state, dispatch, id, citySubstr, election }), 900)
  }
  
  const handleLastRowClick = () => {
    const isBeforeLastRowEmpty = state[state.length - 1].city
    if (isBeforeLastRowEmpty) dispatch({ type: 'ADD_ROW' })
  }

  const Row = ({ id, city, address, houseNr, result, onClick, disabled, cityList, streetList, totalCount }) => (
    <RowWrap onClick={onClick} key={id}>
      <CityAutoComplete
        onSelect={(cityId, { label }) => handleCitySelect(id, label, cityId)}
        onChange={value => handleCityChange(id, value)}
        onSearch={value => handleAddressSearch(id, value)}
        options={cityList}
      />
      <StreetAutoComplete
        onSelect={value => handleAddressSelect(id, value)}
        onChange={value => handleAddressChange(id, value)}
        onSearch={() => null}
        options={streetList || []}
        value={address}
      />
      <Input
        disabled={disabled}
        width={80}
        value={houseNr}
        onChange={result?.length === 1 ? () => null : ({ target }) => handleHouseNrChange(id, target.value)}
      />
      <EvkLink result={result} />
      <SzavazokorLink result={result} totalCount={totalCount} onClick={onSzavazokorClick} />
    </RowWrap>
  )

  console.log({state})
  
  return (
    <Table>
      <Thead>
        <div>Város</div>
        <div>Cím</div>
        <div className="hsz">Házszám</div>
        <div className="vk">Választókerület</div>
        <div>Szavazókör</div>
      </Thead>
      <Tbody>
        {state.map(Row)}
        <Row disabled onClick={handleLastRowClick} />
      </Tbody>
    </Table>
  )
}
