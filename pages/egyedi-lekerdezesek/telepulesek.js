import React from 'react'
import ResponsiveLayout from '../../components/ResponsiveLayout';
import AllSettlements from '../../components/AllSettlements';
import getStaticPropsforTelepules from '../../serverSideScripts/getStaticPropsforTelepules'
import countiesAndOevks from '../../data/countiesAndOevks.json'

const TelepulesekPage = ({
  allSettlements,
  votersNumberDataObject,
  szavazatokTelepulesenkent,
}) => {
  return (
    <ResponsiveLayout menu={false}>
      <AllSettlements
        allSettlements={allSettlements}
        votersNumberDataObject={votersNumberDataObject}
        countiesAndOevks={countiesAndOevks}
        szavazatokTelepulesenkent={szavazatokTelepulesenkent}
      />
    </ResponsiveLayout>
  )
}

export default TelepulesekPage

export const getStaticProps = getStaticPropsforTelepules