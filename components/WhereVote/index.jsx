import React, { useReducer, useState } from 'react';
import {
  Popover,
  Input,
  PageHeader,
} from 'antd';
import styled from 'styled-components'
import tszService from '../../services/tszService';
import CityAutoComplete from '../CityAutoComplete';
import StreetAutoComplete from '../StreetAutoComplete';
import zipService from '../../services/zipService';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import useValasztas from '../../hooks/useValasztas';

const Table = styled.div`
  display: flex;
  flex-direction: column;
`

const Thead = styled.div`
  display: flex;
  flex-direction: row;
`

const Th = styled.div`
  font-weight: bold;
  min-width: ${({ width = 200 }) => width }px;
  padding-left: 12px;

  &.hsz {
    min-width: 80px;
    padding-left: 6px;
  }

  &.vk {
    min-width: 350px;
  }
`

const Tbody = styled.div`
  display: flex;
  flex-direction: column;
`

const RowWrap = styled.div`
  display: flex;
  ${({ lg, sm }) => {
    if (lg){
      return 'flex-direction: row;'
    }
    return `
      flex-direction: column;
      margin-bottom: 32px;
    `

  }}

  input:disabled {
    cursor: pointer;
  }
`

const RowWrapInner = styled.div`
  display: flex;
  flex-direction: ${({ sm }) => sm ? 'row' : 'column' };
`

const CityAutoCompleteStyled = styled(CityAutoComplete)`
  min-width: 200px;
  width: 100%;
`

const StreetAutoCompleteStyled = styled(StreetAutoComplete)`
  min-width: 200px;
  width: 100%;
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

const PageHeaderStyled = styled(PageHeader)`
  padding: 16px 4px;
`

const InputStyled = styled(Input)`
  height: 32px;
  ${({ sm, width }) => {
    if (sm) {
      return `min-width: ${width}px; width: ${width}px;`
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
    case 'GET_CITY_LIST__SUCCESS': 
    return state.map(record => (
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
            {totalCount} db szavaz??k??r
          </SzavazokorLinkWrap>
        </Popover>      
      )
    }

    return (
      <SzavazokorLinkWrap>
        {totalCount} db szavaz??k??r
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
          {allEvks.length} v??laszt??ker??let
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
    const cityList = await tszService.getCityList({ citySubstr, election })
    dispatch({ type: 'GET_CITY_LIST__SUCCESS', id, cityList })
})()}

const fetchStreets = ({
  dispatch,
  id,
  cityId,
  cityName,
  election,
}) => {;(async() => {
    dispatch({ type: 'GET_STREETS', id })
    const cityId = await tszService.getCityIdByName({ cityName, election })
    const streetList = await tszService.getSreets({ cityId, election })
    dispatch({ type: 'GET_STREETS__SUCCESS', id, streetList })
})()}

const WhereVote = ({ onSzavazokorClick, election }) => {
  const initialState = [
    { id: 'd1', zip: '', city: '', result: null },
    { id: 'd2', zip: '', city: '', result: null },
  ]

  const breakpoints = useBreakpoint()

  const [state, dispatch] = useReducer(reducer, initialState)

  const electionData = useValasztas({ election })

  const[to, setTo] = useState();
  const debounce = (cb, t = 600) => {
    clearTimeout(to)
    setTo(setTimeout(cb, t))
  }

  const handleZipChange = async (id, zip) => {
    if (!isNaN(+zip) && +zip <= 9999) {
      dispatch({ type: 'EDIT', id, key: 'zip', value: zip })
      if (zip > 999){
        dispatch({ type: 'EDIT', id, key: 'city', value: '' })
        
        const { data } = await zipService.getCity({ zip })

        const cityList = data[0]?.administrativeUnits
        .filter(({ name }) => name !== 'Budapest')
        .map(({ name }) => {
          const value = name.replace('. ker??let', '.ker')
          return { value, label: value }
        })

        if (cityList?.length === 1){
          const cityName = cityList[0].label
          dispatch({ type: 'EDIT', id, key: 'city', value: cityName })
          debounce(() => fetchSzkByAddress({state, dispatch, id, key: 'city', value: cityName, election }))
          debounce(() => fetchStreets({ dispatch, id, cityName, election }))       
        } else if (cityList?.length > 1){
          dispatch({ type: 'GET_CITY_LIST__SUCCESS', id, cityList })          
        }

      }
    }
  }

  const handleCityChange = (id, value) => {
    if (value === ''){
      handleZipChange(id, state?.find?.(row => row.id === id)?.zip)
      return
    }
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
  
  const handleCitySelect = (id, value, cityName) => {
    dispatch({ type: 'EDIT', id, key: 'city', value })
    dispatch({ type: 'EDIT', id, key: 'address', value: '' })
    debounce(() => fetchSzkByAddress({state, dispatch, id, key: 'city', value, election }))
    debounce(() => fetchStreets({ dispatch, id, cityName, election })) 
  }
  
  const handleAddressSearch = async (id, citySubstr) => {
    if (!citySubstr || citySubstr.length < 3) return dispatch({ type: 'CLEAR_CITY_LIST', id })
    debounce(() => fetchCityList({ state, dispatch, id, citySubstr, election }), 900)
  }
  
  const handleLastRowClick = () => {
    const isBeforeLastRowEmpty = state[state.length - 1].city
    if (isBeforeLastRowEmpty) dispatch({ type: 'ADD_ROW' })
  }

  const Row = ({ id, zip, city, address, houseNr, result, onClick, disabled, cityList, streetList, totalCount }) => (
    <RowWrap onClick={onClick} key={id} {...breakpoints}>
      <RowWrapInner {...breakpoints}>
        <InputStyled
          width={60}
          onChange={({ target }) => handleZipChange(id, target.value)}
          value={zip}
          placeholder="Ir??ny??t??sz??m"
          {...breakpoints}
        />
        <CityAutoCompleteStyled
          value={city}
          onSelect={(_cityId, { label }) => handleCitySelect(id, label, label)}
          onChange={value => handleCityChange(id, value)}
          onSearch={value => handleAddressSearch(id, value)}
          options={cityList}
        />
        <StreetAutoCompleteStyled
          onSelect={value => handleAddressSelect(id, value)}
          onChange={value => handleAddressChange(id, value)}
          onSearch={() => null}
          options={streetList || []}
          value={address}
        />
        <InputStyled
          width={80}
          disabled={disabled}
          placeholder="H??zsz??m"
          value={houseNr}
          onChange={result?.length === 1 ? () => null : ({ target }) => handleHouseNrChange(id, target.value)}
          {...breakpoints}
        />
      </RowWrapInner>
      <RowWrapInner {...breakpoints}>
        <EvkLink result={result} />
        <SzavazokorLink result={result} totalCount={totalCount} onClick={onSzavazokorClick} />
      </RowWrapInner>
    </RowWrap>
  )

console.log({state})

  return (
    <>
      <PageHeaderStyled
        title="Szavaz??k??r lakc??m alapj??n"
        breadcrumb={{ routes:   [{
          path: 'index',
          breadcrumbName: electionData?.leiras || '...',
        }]}}
      />    
      <Table>
        <Thead>
          {breakpoints.sm && (
            <>
              <Th width="60">Irsz</Th>
              <Th>V??ros</Th>
              <Th>C??m</Th>
              <Th className="hsz">H??zsz??m</Th>
            </>
          )}
          {breakpoints.lg && (
            <>
              <Th className="vk">V??laszt??ker??let</Th>
              <Th>Szavaz??k??r</Th>
            </>
          )}
        </Thead>
        <Tbody>
          {state.map(Row)}
          <Row disabled onClick={handleLastRowClick} />
        </Tbody>
      </Table>
    </>
  )
}

export default WhereVote
