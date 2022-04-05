import React from 'react'
import { Button, Container } from 'react-bootstrap'
import { useEmailLoginLogout, useUserEmail, useUserEmailInfo } from 'state/hooks'
import UserReaction from './userReaction'
import UserSignUp from './userSignUp'
import UserLogin from './userLogin'
import UserComment from './userComment'
import ShowComments from './showComments'

// import { useUserEmail, useUserEmailInfo, useEmailLoginLogout } from '../../state/hooks'

interface Props {
  topicId: string
}

const UserComments: React.FC<Props> = ({ topicId }) => {
  useEmailLoginLogout()

  const { logOut } = useUserEmail()
  const { isLogIn, isSignUp } = useUserEmailInfo()

  const handleLogOut = () => {
    logOut()
  }
  return (
    <div className="card">
      <Container className="themed-container">
        <UserReaction campaignId={topicId} />
        {isLogIn ? (
          <div style={{ display: 'flex', justifyContent: 'end' }}>
            <Button color="secondary" onClick={handleLogOut}>
              log Out
            </Button>
          </div>
        ) : (
          <>
            <UserLogin />
            <UserSignUp />
          </>
        )}
        <UserComment campaignId={topicId} />
        <ShowComments campaignId={topicId} />
      </Container>
    </div>
  )
}

export default UserComments
