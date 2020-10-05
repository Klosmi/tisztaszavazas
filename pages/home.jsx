import React, { useState } from 'react';
import styled from 'styled-components'
import Head from 'next/head';
import {
  Layout,
} from 'antd';

import 'antd/dist/antd.css';
import Router, { Route } from '../components/Router';
import UserSettings from '../components/UserSettings';
import AppSettings from '../components/AppSettings';
import AllRecords from '../components/AllRecords';
import SingleRecord from '../components/SingleRecord';
import Menu from '../components/Menu';
import Header from '../components/Header';
import WhereVote from '../components/WhereVote';
import CustomQueryContainer from '../components/CustomQueryContainer';

const {
  Content: AntContent,
} = Layout;

const Content = styled(AntContent)`
  padding: 48px 48px 48px 304px;
  margin-top: 64px;
`

const Home = () => {
  const [selectedMenuKey, setSelectedMenuKey] = useState()
  const [selectedSzkId, setSelectedSzkId] = useState()
  
  const handleMenuClick = async ({ key }) => {
    setSelectedMenuKey(key)
  };

  const handleSelectSzk = id => {
    setSelectedMenuKey('single-szk')
    setSelectedSzkId(id)
  }

  return (
    <>
      <Head>
        <title>Tisztaszavazás</title>
      </Head>
      <Header />
      <Menu
        onClick={handleMenuClick}
        selectedKeys={[selectedMenuKey]} 
      />
      <Content>
        <Router route={selectedMenuKey}>
          <Route slug="all-szk">
            <AllRecords onClickRecord={handleSelectSzk} />
          </Route>
          <Route slug="single-szk">
            <SingleRecord id={selectedSzkId} />
          </Route>
          <Route slug="user-settings">
            <UserSettings />
          </Route>
          <Route slug="app-settings">
            <AppSettings />
          </Route>
          <Route slug="where-vote">
            <WhereVote onSzavazokorClick={handleSelectSzk} />
          </Route>
          <Route slug="custom-query">
            <CustomQueryContainer />
          </Route>          
        </Router>
      </Content>
    </>
  );
};

export default Home;
