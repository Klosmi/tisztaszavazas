import React from 'react'
import ResponsiveLayout from '../../components/ResponsiveLayout';
import AllSettlements from '../../components/AllSettlements';
import getStaticPropsforTelepules from '../../serverSideScripts/getStaticPropsforTelepules'
import countiesAndOevks from '../../data/countiesAndOevks.json'

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
        countiesAndOevks={countiesAndOevks}
      />
    </ResponsiveLayout>
  )
}

export default TelepulesekPage

export const getStaticProps = getStaticPropsforTelepules