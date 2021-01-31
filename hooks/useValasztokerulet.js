import { useEffect, useState } from "react"
import tszService from "../services/tszService"

const getVkDetails = ({ leiras, election, id }) => {
  const [vk, setVk] = useState()

  useEffect(() => {
    if (!id && !leiras) return
    let query

    if (id){
      tszService.getById({ path: 'valasztokeruletek', id, election })
      .then(({ data }) => setVk(data))
    } else {
      query = [
        { $match: { leiras } }
      ]
      tszService.aggregate({ query, election, path: '/valasztokeruletek' })
      .then(({ data }) => setVk(data[0]))
    }
  }, [leiras, election, id])

  return vk
}

const getAllVks = ({ election }) => {
  const [vkResult, setVkResult] = useState()

  const handleVkResult = ({ data }) => {
    data = data.sort((a, b) => a.leiras?.localeCompare(b.leiras))
    setVkResult(data)
  }

  useEffect(() => {
    tszService.tszGet({
      path: '/valasztokeruletek',
      query: { limit: 200 },
      election
    }).then(handleVkResult)
  }, [election])

  return vkResult
}

export default {
  getVkDetails,
  getAllVks,
}
