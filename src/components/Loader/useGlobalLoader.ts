import { useContext, useEffect } from 'react'
import { Context } from './LoaderContext'

const useGlobalLoader = (loading: boolean) => {
  const { setLoading } = useContext(Context)

  useEffect(() => {
    setLoading(loading)
  }, [setLoading, loading])
}

export default useGlobalLoader
