import { useEffect, useState } from "react"
import tszService from "../services/tszService"

const useValasztas = ({ election }) => {
  const [electionData, setElectionData] = useState()

  useEffect(() => {
    if (!election) return
    tszService.getElection({ kod: election })
    .then(([data]) => setElectionData(data))

  }, [election])

  return electionData
}

export default useValasztas
