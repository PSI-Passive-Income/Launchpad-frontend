import React, { createContext, useState, SVGProps, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { Bars, LoaderProvider as AgneyLoaderProvider } from '@agney/react-loading'
import Overlay from '../Overlay/Overlay'
import Loader from './Loader'

const loadingProps: SVGProps<SVGSVGElement> = {
  width: 150,
  fill: '#2fcbeb',
}

interface LoadersContext {
  setLoading: (loading: boolean) => void
}

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${({ theme }) => theme.zIndices.loader - 1};
`

export const Context = createContext<LoadersContext>({
  setLoading: () => null,
})

const LoaderProvider: React.FC = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false)

  const setLoading = useCallback((loading: boolean) => setIsLoading(loading), [setIsLoading])
  const props = useMemo(() => ({ setLoading }), [setLoading])

  return (
    <AgneyLoaderProvider indicator={<Bars {...loadingProps} />}>
      <Context.Provider value={props}>
        {isLoading && (
          <LoadingWrapper>
            <Overlay show />
            <Loader loading={isLoading} />
          </LoadingWrapper>
        )}
        {children}
      </Context.Provider>
    </AgneyLoaderProvider>
  )
}

export default LoaderProvider
