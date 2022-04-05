import React, { useState, useMemo } from 'react'
import { Input, Button } from 'react-bootstrap'
import { useUserComments, useUserEmailInfo } from '../../state/hooks'

interface Props {
  campaignId: string
}

const UserComment: React.FC<Props> = ({ campaignId }) => {
  const { createComment } = useUserComments()
  const { user } = useUserEmailInfo()

  const [comment, setComment] = useState('')

  const Comment = (e: { preventDefault: () => void; target: { value: React.SetStateAction<string> } }) => {
    e.preventDefault()
    setComment(e.target.value)
  }

  const onSubmit = () => {
    createComment(comment, campaignId, user.id, user.userName)
    setComment('')
  }

  return (
    <div>
      <Input
        className="classNamem-control"
        type="textarea"
        name="text"
        id="exampleText"
        placeholder="Join the discussion"
        onChange={Comment}
        value={comment}
      />
      {user ? (
        <div className="SignUp_butn">
          <Button
            className="SignUp_butn"
            type="button"
            color="secondary"
            size="lg"
            disabled={!comment || !user}
            onClick={onSubmit}
          >
            {' '}
            Comment send
          </Button>
        </div>
      ) : null}
    </div>
  )
}
export default UserComment
