import apiClient from "./index"

export interface GoldRecord {
  date: string
  price: number
}

export const fetchGoldHistory = async (
  symbol: string = "XAU",
  curr: string = "VND",
) => {
  const response = await apiClient.get(
    `https://www.goldapi.io/api/${symbol}/${curr}`,
    {
      headers: {
        "x-access-token": "goldapi-b7760745ce3d98f965fa50709012f90e-io",
      },
    },
  )
  return response.data
}
