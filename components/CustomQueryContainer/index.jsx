import React, { useState, useEffect, useContext } from 'react';
import {
  Input,
  Button,
  Select,
  Layout,  
} from 'antd';
import tszService from '../../services/tszService';
import OevkCities from '../OevkCities';
import Router, { Route } from '../Router';
import { AppContext } from '../../pages';

const { Option } = Select;
const { Content } = Layout;


export default ({ id }) => {
  const [queryResult, setQueryResult] = useState()
  const [queryName, setQueryName] = useState()

  const { election } = useContext(AppContext)

  const handleOnQuery = async (query) => {
    const { data } = await tszService.aggregate(query, election)
    setQueryResult(data)
  }

  const handleSelectChange = value => {
    setQueryName(value)
  }

  return (
    <>
      <Select
        onChange={handleSelectChange}
        placeholder="Válasszon lekérdezést"
        value={queryName}
        style={{ width: "100%" }}
      >
        <Option value="oevk-telepules">OEVK települései és a szavazókörök száma</Option>
      </Select>
      <br /><br />
      <Content>
        <Router route={queryName}>
          <Route slug="x" />
          <Route slug="oevk-telepules">
            <OevkCities onQuery={handleOnQuery} queryResult={queryResult} />
          </Route>
        </Router>
      </Content>
    </>
  )
}
