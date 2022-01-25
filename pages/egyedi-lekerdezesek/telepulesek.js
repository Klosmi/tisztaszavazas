import React from 'react'
import ResponsiveLayout from '../../components/ResponsiveLayout';
import AllSettlements from '../../components/AllSettlements';
import getStaticPropsforTelepules from '../../serverSideScripts/getStaticPropsforTelepules'

const TelepulesekPage = ({
  allSettlements,
  votersNumberDataObject,
  szavazatokTelepulesenkent,
  countiesAndOevksObject,
  cityVotersNumberObject,
  szavazatokVarosiSzavazokorben,
  initialSettlementOevkGroupping,
  initialCitySzkOevkGroupping,
  countyBorders,
}) => {
  return (
    <ResponsiveLayout menu={false}>
      <AllSettlements
        allSettlements={allSettlements}
        votersNumberDataObject={votersNumberDataObject}
        countiesAndOevksObject={countiesAndOevksObject}
        szavazatokTelepulesenkent={szavazatokTelepulesenkent}
        cityVotersNumberObject={cityVotersNumberObject}
        szavazatokVarosiSzavazokorben={szavazatokVarosiSzavazokorben}
        initialSettlementOevkGroupping={initialSettlementOevkGroupping}
        initialCitySzkOevkGroupping={initialCitySzkOevkGroupping}
        countyBorders={countyBorders}
      />
    </ResponsiveLayout>
  )
}

export default TelepulesekPage

export const getStaticProps = getStaticPropsforTelepules