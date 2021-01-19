import { useEffect, useState } from "react"
import tszService from "../services/tszService"

const useValasztokerulet = ({ oevkSzama, megye, election }) => {
  const [vk, setVk] = useState()

  useEffect(() => {
    if (!oevkSzama || !megye) return
    const query = [
      { $match: {
        leiras: { $regex: megye },
        szam: +oevkSzama
      } }
    ]
    tszService.aggregate(query, election, '/valasztokeruletek')
    .then(({ data }) => setVk(data[0]))
  }, [oevkSzama, megye, election])

  return vk
}

export default useValasztokerulet
