import React, { useState, createContext } from 'react';
import styled from 'styled-components'
import Head from 'next/head';
import {
  Layout,
  Select
} from 'antd';

import Router, { Route } from '../components/Router';
import AllRecords from '../components/AllRecords';
import SingleRecord from '../components/SingleRecord';
import Menu from '../components/Menu';
import Header from '../components/Header';
import WhereVote from '../components/WhereVote';
import CustomQueryContainer from '../components/CustomQueryContainer';
import ElectionSelector from '../components/ElectionSelector';

const {
  Content: AntContent,
  Footer,
} = Layout;

const {
  Option
} = Select

const Content = styled(AntContent)`
  padding: 48px 48px 48px 304px;
  margin-top: 64px;
`

const StyledFooter = styled(Footer)`
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 3px;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    p {
      line-height: 1;
      margin: 0;
      color: darkgrey;
    }
`

export const AppContext = createContext()

const Home = () => {
  const [selectedMenuKey, setSelectedMenuKey] = useState()
  const [selectedSzkId, setSelectedSzkId] = useState()
  const [election, setElection] = useState('ogy2018')

  const handleMenuClick = ({ key }) => {
    setSelectedMenuKey(key)
    setSelectedSzkId(id)
  };

  return (
    <AppContext.Provider value={{ election, setElection }}>
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
          <Route slug="where-vote">
            <WhereVote onSzavazokorClick={handleSelectSzk} />
          </Route>
          <Route slug="custom-query">
            <CustomQueryContainer />
          </Route>          
        </Router>
      </Content>
      <StyledFooter>
        <ElectionSelector />
      </StyledFooter>      
    </AppContext.Provider>
  );
};

export default Home;
