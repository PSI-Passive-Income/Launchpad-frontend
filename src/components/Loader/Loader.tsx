import React from 'react'
import { useLoading } from '@agney/react-loading'
import styled from 'styled-components'

const LoaderSection = styled.section<{ $loading: boolean }>`
  position: absolute;
  display: ${({ $loading }) => ($loading ? 'block' : 'none')};
  top: 50%;
  left: 50%;
  margin: auto;
  z-index: 99;
`

interface Props {
  loading: boolean
}

const Loader: React.FC<Props> = ({ loading }) => {
  const { containerProps, indicatorEl } = useLoading({ loading })

  return (
    <LoaderSection $loading={loading} {...containerProps}>
      {indicatorEl} {/* renders only while loading */}
    </LoaderSection>
  )
}

export default Loader
