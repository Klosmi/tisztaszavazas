import React from 'react'
import ResponsiveLayout from '../../components/ResponsiveLayout';
import AllSettlements from '../../components/AllSettlements';
import getStaticPropsforTelepules from '../../serverSideScripts/getStaticPropsforTelepules'

const TelepulesekPage = ({
  allSettlements,
  aggregatedElectionResultsObject,
  votersNumberDataObject,
}) => {
  return (
    <ResponsiveLayout menu={false}>
      <AllSettlements
        allSettlements={allSettlements}
        aggregatedElectionResultsObject={aggregatedElectionResultsObject}
        votersNumberDataObject={votersNumberDataObject}      
      />
    </ResponsiveLayout>
  )
}

export default TelepulesekPage

export const getStaticProps = getStaticPropsforTelepules