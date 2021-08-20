import React from 'react'
import { useParams } from 'react-router-dom'
import { useLoading } from '@agney/react-loading'
import { Button, Label } from 'reactstrap'
import { isFinite, toFinite } from 'lodash'
import { formatBN, formatDateTime } from 'utils/formatters'
import { useToken, useTokenLock } from 'state/hooks'
import { useUnlockToken } from 'hooks/useTokenLock'
import lockImage from '../../assets/img/lock.png'
import emptyBox from '../../assets/img/empty-white-box.png'
import Releases from './components/Releases'

interface Params {
  lockId: string
}

const LockDetail: React.FC = () => {
  const { lockId: tmpLockId } = useParams<Params>()
  const lockId = isFinite(tmpLockId) ? toFinite(tmpLockId) : null

  const { lock, isLoadingLock } = useTokenLock(lockId)
  const { token, isLoadingToken } = useToken(lock?.token)
  const { unlock, unlocking } = useUnlockToken()

  const isLoading = isLoadingLock || isLoadingToken || unlocking
  const { containerProps, indicatorEl } = useLoading({ loading: isLoading })

  const onUnlock = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    unlock(lockId)
  }

  return (
    <div className="content" {...containerProps}>
      <div className="row">
        {indicatorEl} {/* renders only while loading */}
        {!isLoadingLock && !lock ? (
          <div className="col-sm-12 col-md-6 offset-md-2 notoken-column">
            <div className="card text-center">
              <div className="notokens-warning">
                <img src={emptyBox} height="200px" width="200px" alt="no locks" />
              </div>
              <h3>This lock is not found</h3>
            </div>
          </div>
        ) : null}
        {lock ? (
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h5 className="title text-center">{token?.name}</h5>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <Label>Start time:</Label>
                  <p>{formatDateTime(lock.startTime)}</p>
                </div>
                <div className="form-group">
                  <Label>Last unlock time:</Label>
                  <p>{formatDateTime(lock.unlockTime)}</p>
                </div>
                <div>
                  <img width="30" src={lockImage} alt="lock" />
                </div>
                <div className="form-group">
                  <Label>Token address:</Label>
                  <p>{lock.token}</p>
                </div>
                <div className="form-group">
                  <Label>Owner:</Label>
                  <p>{lock.owner}</p>
                </div>
                <div className="form-group">
                  <Label>Total locked tokens:</Label>
                  <p>{formatBN(lock.amount)}</p>
                </div>
                <div className="form-group">
                  <Label>Unlocked tokens:</Label>
                  <p>{formatBN(lock.amountUnlocked)}</p>
                </div>

                <Releases lock={lock} />

                <Button onClick={onUnlock}>Unlock available tokens</Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
export default LockDetail
