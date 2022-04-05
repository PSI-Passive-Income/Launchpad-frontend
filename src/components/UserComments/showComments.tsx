import React, { useState } from 'react'
import { Form } from 'react-bootstrap'
import { useUserComments, useUserEmailInfo } from '../../state/hooks'
import dletImage from '../../assets/img/icons/delete.png'
import Edit from '../../assets/img/icons/edit.png'
import avatar from '../../assets/img/icons/avatar.png'

interface Props {
  campaignId: string
}

const ShowComments: React.FC<Props> = ({ campaignId }) => {
  const { ShowComment, updateComment, deleteComment, reply } = useUserComments()
  const { user, isLogIn } = useUserEmailInfo()
  const comments = ShowComment(campaignId)
  const [index, setIndex] = useState(0)
  const [replyId, setReplyId] = useState(0)
  const [replyValue, setReplyValue] = useState('')
  const [updatedComment, setUpdatedComment] = useState('')
  const [responseUpdateId, setReponseUpdateId] = useState(0)
  const [responseUpdateValue, setResponseUpdateValue] = useState('')

  const handleDelete = (id: number) => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Do You wanna delete')) {
      deleteComment(campaignId, id)
    }
  }
  const submitUpdate = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    updateComment(index, updatedComment, campaignId)
    setUpdatedComment('')
    setIndex(0)
  }
  const handleReply = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    reply(replyId, replyValue, campaignId, user.id, user.userName)
    setReplyValue('')
    setReplyId(0)
  }
  const handleResponseDelete = (id: number) => {
    // console.log(id)
    // eslint-disable-next-line no-alert
    if (window.confirm('Do You wanna delete')) {
      deleteComment(campaignId, id)
    }
  }
  const handleResponseUpdate = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    updateComment(responseUpdateId, responseUpdateValue, campaignId)
    setReponseUpdateId(0)
    setResponseUpdateValue('')
  }
  const closeBox = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setIndex(0)
    setReplyId(0)
    setUpdatedComment('')
    setReponseUpdateId(0)
  }

  const calculateTimeDuration = (data: string | number | Date) => {
    const commentTime = new Date(data)
    const difference = +new Date() - +commentTime
    const timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    }
    return timeLeft
  }

  return (
    <div style={{ maxHeight: '500px', overflow: 'hidden auto', margin: '50px 0px 0px 0px' }}>
      {Object.values(comments).map((comment: any) => {
        const time = calculateTimeDuration(comment.createdAt)
        return (
          <div>
            {comment.respondTo == null ? (
              <>
                <div className="row">
                  <div className="col-lg-1 col-sm-1">{/* <img src={avatar} role="presentation" alt='avatar' /> */}</div>
                  <div className="col-lg-10 col-sm-10">
                    <p>{comment.userName}</p>
                    <span>{comment.message}</span>
                    <div style={{ display: 'flex' }}>
                      {time.days > 0 ? (
                        <Form.Label>{time.days}d</Form.Label>
                      ) : time.hours > 0 ? (
                        <Form.Label for=" ">{time.hours}h</Form.Label>
                      ) : time.minutes > 0 ? (
                        <Form.Label>{time.minutes}min</Form.Label>
                      ) : (
                        <Form.Label>just now</Form.Label>
                      )}
                      <p aria-hidden>&nbsp;</p>
                      {isLogIn && user.id !== comment.userId ? (
                        <Form.Label className=" img-button" role="presentation" onClick={() => setReplyId(comment.id)}>
                          Reply
                        </Form.Label>
                      ) : null}
                    </div>
                  </div>
                  {isLogIn && user.id === comment.userId ? (
                    <div className="col-lg-1 col-sm-2">
                      <img
                        src={dletImage}
                        className="img-button"
                        alt="delete data"
                        role="presentation"
                        onClick={() => handleDelete(comment.id)}
                      />
                      <img
                        src={Edit}
                        className="img-button"
                        alt="update data"
                        role="presentation"
                        onClick={() => setIndex(comment.id)}
                      />
                    </div>
                  ) : null}
                </div>
                {comment.id === replyId ? (
                  <div className="col-lg-10 col-md-10">
                    <Form.Control
                      className="classNamem-control"
                      type="textarea"
                      name="text"
                      id="exampleText"
                      onChange={(e) => setReplyValue(e.target.value)}
                      value={replyValue}
                    />
                    <Form.Label className="img-button" role="presentation" onClick={handleReply}>
                      Send
                    </Form.Label>
                    <p className="img-button" role="presentation" onClick={closeBox}>
                      x
                    </p>
                  </div>
                ) : null}
                {comment.id === index ? (
                  <>
                    <Form.Control
                      className="classNamem-control"
                      type="textarea"
                      name="text"
                      id="exampleText"
                      onChange={(e) => setUpdatedComment(e.target.value)}
                      value={updatedComment}
                    />
                    <p className="img-button" role="presentation" onClick={submitUpdate}>
                      update
                    </p>
                    <p className="img-button" role="presentation" onClick={closeBox}>
                      x
                    </p>
                  </>
                ) : null}
              </>
            ) : null}
            {Object.values(comments).map((response: any) => {
              const time1 = calculateTimeDuration(response.createdAt)
              return (
                <ul>
                  {response.respondTo === comment.id ? (
                    <div className="row">
                      <div className="col-lg-1 col-sm-1">
                        <img src={avatar} role="presentation" alt="avatar" />
                      </div>
                      <div className="col-lg-9 col-sm-9">
                        <p>{response.userName}</p>
                        <span>{response.message}</span>
                        <div>
                          {time1.days > 0 ? (
                            <Form.Label>{time1.days}d</Form.Label>
                          ) : time1.hours > 0 ? (
                            <Form.Label>{time1.hours}h</Form.Label>
                          ) : time1.minutes > 0 ? (
                            <Form.Label>{time1.minutes}min</Form.Label>
                          ) : (
                            <Form.Label>just now</Form.Label>
                          )}
                        </div>
                      </div>
                      <hr />
                      {isLogIn && user.id === response.userId ? (
                        <div className="col-lg-2 col-sm-2">
                          <img
                            src={dletImage}
                            className="img-button"
                            alt="delete data"
                            role="presentation"
                            onClick={() => handleResponseDelete(response.id)}
                          />
                          <img
                            src={Edit}
                            className="img-button"
                            role="presentation"
                            alt="update data"
                            onClick={() => setReponseUpdateId(response.id)}
                          />
                        </div>
                      ) : null}
                      {response.id === responseUpdateId ? (
                        <>
                          <Form.Control
                            className="classNamem-control"
                            type="textarea"
                            name="text"
                            id="exampleText"
                            onChange={(e) => setResponseUpdateValue(e.target.value)}
                            value={responseUpdateValue}
                          />
                          <p className="img-button" role="presentation" onClick={handleResponseUpdate}>
                            update
                          </p>
                          <p className="img-button" role="presentation" onClick={closeBox}>
                            x
                          </p>
                        </>
                      ) : null}
                      <hr />
                    </div>
                  ) : null}
                </ul>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
export default ShowComments
