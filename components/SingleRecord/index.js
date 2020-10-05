import React, { useState, useEffect, useContext } from 'react';
import {
  Spin,
} from 'antd';
import { ObjectInspector, TableInspector } from 'react-inspector';
import tszService from '../../services/tszService';
import styled from 'styled-components';
import { AppContext } from '../../pages';

const InspectorStyle = styled.div`
  ol > li {
    font-size: 16px !important;
    line-height: 1.5em !important;
    cursor: pointer !important;

    &[aria-expanded="true"]{
      div > span:nth-child(3){
        opacity: .3
      }
    }
  }
`

export default ({ id }) => {
  const [singleSzkResult, setSingleSzkResult] = useState()

  const { election } = useContext(AppContext)

  useEffect(() => {
    ;(async () => {
      setSingleSzkResult()
      if (!id) return;
      const { data } = await tszService.getSingleSzk(id, election)
      setSingleSzkResult(data)
    })();
  }, [id]);

  if (!singleSzkResult) return <Spin />

  return (
    <InspectorStyle>
      <ObjectInspector
        expandLevel={Array.isArray(singleSzkResult) ? undefined : 1}
        data={singleSzkResult}
      />
    </InspectorStyle>
  )
}
