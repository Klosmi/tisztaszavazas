import React from 'react'
import ResponsiveLayout from '../../components/ResponsiveLayout';
import AllSettlements from '../../components/AllSettlements';
import getStaticPropsforTelepules from '../../serverSideScripts/getStaticPropsforTelepules'

const TelepulesekPage = ({
  allSettlements,
}) => {
  return (
    <ResponsiveLayout menu={false}>
      <AllSettlements allSettlements={allSettlements} />
    </ResponsiveLayout>
  )
}

export default TelepulesekPage

export const getStaticProps = getStaticPropsforTelepules