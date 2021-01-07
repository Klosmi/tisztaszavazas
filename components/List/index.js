import React, { useState } from 'react';
import {
  Button,
  Pagination,
  Spin,
  Input,
  Select,
  Alert,
} from 'antd';
import FreeTable, { applyCustomField } from 'free-table'
import styled from 'styled-components';
import diacriticRegex from '../../functions/diacriticRegex'
import { useRouter } from 'next/router'

const { Option, OptGroup } = Select;

const InputWrap = styled.div`
  display: flex;
  flex-direction: row;
  div {
    min-width: 250px;
  }
`
export default ({ listData, columns, onPageChange, paginator, isLoading, onFilter, totalCont, schema }) => {
  const initialState = { param: null, value: null }
  const [state, setState] = useState(initialState)
  const [query, setQuery] = useState({})
  const [searchMode, setSearchMode] = useState('fuzzy')
  const router = useRouter()


  const getParamType = param => (
    schema.find(({ path }) => path === param)?.type
  )

  const SzkLink = (rowData) => {
    const handleSzkClick = () => (
      router.push(`szavazokor-adatai/${rowData.data._id}`)
    )

    return (
      <td>
        <Button
          type="link"
          onClick={handleSzkClick}
        >
          Megnéz
        </Button>
      </td>
    )
  }

  const getQuery = (param, value) => {
    let searchValue = value;
    if (searchMode === 'fuzzy' && getParamType(param) === String) {
      searchValue = `/${diacriticRegex(value)}/i`
    }

    return {
      [param]: searchValue
    }
  }

  const handleSelectChange = (param) => {
    setState({ ...state, param, value: null })
    // setQuery({ ...query, [param]: query[param] })
  }

  const handleSearchChange = ({ target: { value } }) => {
    setState({ ...state, value })
    setQuery({ /* ...query, */ ...getQuery(state.param, value) })
  }

  const handleSearchSubmit = () => {
    onFilter({ query })
  }
  
  const handleResetClick = () => {
    setState(initialState)
    setQuery({})
    onFilter({})
  }

  const selectAfter = (
    <Select defaultValue={searchMode} onChange={setSearchMode}>
      <Option value="fullmatch">teljes egyezés</Option>
      <Option value="fuzzy">hasonlóság</Option>
      <Option value="regex">regex</Option>
    </Select>
  )


  if (!listData) return null

  return (
    <>
      <InputWrap>
        <Select
          onChange={handleSelectChange}
          placeholder="mező"
          value={state.param}
          >
          <OptGroup label="Közigazgatási egység">
            <Option value="kozigEgyseg.kozigEgysegNeve">Közigazgatási egység neve</Option>
            <Option value="kozigEgyseg.megyeNeve">Megye neve</Option>
          </OptGroup>
          <OptGroup label="Szavazókör adatai">
            <Option value="szavazokorSzama">Szavazókör száma</Option>
            <Option value="szavazokorCime">Szavazókör címe</Option>
            <Option value="akadalymentes">Akadálymentes-e</Option>
            <Option value="valasztokSzama">Névjegyzékbe vettek száma</Option>
          </OptGroup>     
          <OptGroup label="Választókerület">
            <Option value="valasztokerulet.leiras">Választókerület teljes neve</Option>
            <Option value="valasztokerulet.szam">Választókerület sorszáma</Option>
          </OptGroup>  
          <OptGroup label="Szavazókörhoz tartozó közterület">
            <Option value="kozteruletek.leiras">leírása</Option>
            <Option value="kozteruletek.kozteruletNev">a közterület neve</Option>
            <Option value="kozteruletek.kezdoHazszam">a legkisebb hászáma</Option>
            <Option value="kozteruletek.vegsoHazszam">a legnagyobb hászáma</Option>
            <Option value="kozteruletek.megjegyzes">oldala</Option>
          </OptGroup>  
        </Select>
        <Input
          onPressEnter={handleSearchSubmit}
          placeholder="keresett érték"
          onChange={handleSearchChange}
          value={state.value}
          addonAfter={getParamType(state.param) === String && selectAfter}          
        />
        <Button onClick={handleSearchSubmit}>Keresés</Button>
      </InputWrap>
      <br />
      {!totalCont && !isLoading && (
        <Alert
          message="Nincs találálat"
          type="warning"
        />        
      )}
      {!!totalCont && (
        <>
          <span><strong>Összesen: {totalCont}</strong></span>
          <Button style={{ float: 'right' }} onClick={handleResetClick}>Visszaállítás</Button>
          <br /> <br />
          <Pagination
            showSizeChanger
            total={totalCont}
            pageSizeOptions={[25, 100, 250, 1000]}
            onChange={(page, pageSize) => onPageChange(page, pageSize, query)}
            current={paginator.page}
            pageSize={paginator.pageSize}
          />
          <FreeTable
            columns={columns}
            data={listData}
            options={[
              applyCustomField({ 
                id: 'szklink',
                Component: SzkLink,
                HeadComponent: () => <th />,
                colIndex: 3
              })
            ]}
          />
        </>
      )}
      {!!isLoading && <Spin />}       
    </>
  )
}