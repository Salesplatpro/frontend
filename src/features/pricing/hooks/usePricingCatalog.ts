import useSWR from 'swr'

import {
  fetchPricingCatalog,
  PRICING_ENDPOINT,
} from '../services/pricingService'

export const usePricingCatalog = () => {
  const { data, error, isLoading } = useSWR(
    PRICING_ENDPOINT,
    fetchPricingCatalog,
    {
      revalidateOnFocus: false,
    },
  )

  return {
    catalog: data?.data,
    error,
    isLoading,
  }
}
