import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import Page from 'components/layout/Page'
import Authenticate from 'components/Authenticate'
import { Text } from 'components/Text'
import { useLoggedInUser, useUpdateUser } from 'state/hooks'
import { Button } from 'components/Button'
import UsernameInput from './components/UsernameInput'

const Hero = styled.div`
  align-items: center;
  background-image: url('/images/pan-bg-mobile.svg');
  background-repeat: no-repeat;
  background-position: top center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: auto;
  margin-bottom: 32px;
  padding-top: 116px;
  text-align: center;
`

const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
`

const Home: React.FC = () => {
  const { isLoggedIn, username } = useLoggedInUser()
  const [newUsername, setUsername] = useState(username)

  const handleChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value)
  }

  const updateUser = useUpdateUser()
  const handleUpdateUser = useCallback(async () => {
    await updateUser({ username: newUsername })
  }, [updateUser, newUsername])

  return (
    <Page>
      <Authenticate />
      <Hero>Hello World</Hero>

      {isLoggedIn ? (
        <>
          <LabelWrapper style={{ marginLeft: 16 }}>
            <Text>Set username</Text>
            <UsernameInput onChange={handleChangeUsername} value={newUsername ?? ''} />
          </LabelWrapper>
          <Button onClick={handleUpdateUser}>Update user</Button>
        </>
      ) : null}
    </Page>
  )
}

export default Home
