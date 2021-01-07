import React, { useState, createContext } from 'react'
import Layot from '../components/Layout'
import AllRecords from '../components/AllRecords';
import SingleRecord from '../components/SingleRecord';
import Menu from '../components/Menu';
import Header from '../components/Header';
import WhereVote from '../components/WhereVote';
import CustomQueryContainer from '../components/CustomQueryContainer';
import ElectionSelector from '../components/ElectionSelector';

const Home = () => (
  <Layot>
    <AllRecords />
  </Layot>
)

export default Home
