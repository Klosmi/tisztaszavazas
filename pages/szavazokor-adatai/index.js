import React from 'react'
import { useRouter } from 'next/router'
import Layot from '../../components/Layout'
import { Alert, Button } from 'antd';

const SingleSzkPageIndex = () => {
  const router = useRouter()


  return (
    <Layot>
      <Alert
        message="Válasszon szavazókört"
        showIcon
        description="Az összes szavazókör nézetben válasszon egy szavazókört"
        type="info"
        action={
          <Button
            size="small"
            onClick={() => router.push('/szavazokorok-listaja')}
            type="ghost">
            Megnézem
          </Button>
        }
      />
    </Layot>
  )
}

export default SingleSzkPageIndex
