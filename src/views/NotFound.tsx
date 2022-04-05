import React from 'react'
import styled from 'styled-components'
import Page from 'components/layout/Page'

const StyledNotFound = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  justify-content: center;
`

const NotFound = () => {
  return (
    <Page>
      <StyledNotFound>Oops, page not found</StyledNotFound>
    </Page>
  )
}

export default NotFound
