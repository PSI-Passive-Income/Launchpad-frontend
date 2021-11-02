import React from 'react'
import { useParams } from 'react-router-dom'
import { Button, Label } from 'reactstrap'
import { formatBN, formatDateTime } from 'utils/formatters'
import { useToken, useTokenLock } from 'state/hooks'
import { useActiveWeb3React } from 'hooks/web3'
import { useUnlockToken } from 'hooks/useTokenLock'
import Loader from 'components/Loader'
import lockImage from '../../assets/img/lock.png'
import emptyBox from '../../assets/img/empty-white-box.png'
import Releases from './components/Releases'

interface Params {
  lockId: string
}

const LockDetail: React.FC = () => {
  const { account } = useActiveWeb3React()
  const { lockId: tmpLockId } = useParams<Params>()
  const lockId = !Number.isNaN(parseInt(tmpLockId)) ? parseInt(tmpLockId) : null

  const { lock, isLoadingLock } = useTokenLock(lockId)
  const { token, isLoadingToken } = useToken(lock?.token)
  const { unlock, unlocking } = useUnlockToken()

  const isOwner = lock?.owner?.toLowerCase() === account?.toLowerCase()

  const isLoading = isLoadingLock || isLoadingToken || unlocking
  // const availableForUnlock =

  const onUnlock = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    unlock(lockId)
  }

  return (
    <div className="content">
      <div className="row">
        <Loader loading={isLoading} />

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
                  <Label>Locked token amount:</Label>
                  <p>{formatBN(lock.amount, token?.decimals)} ({formatBN(lock.amountUnlocked, token?.decimals)} unlocked)</p>
                </div>
                <div className="form-group">
                  <Label>Available for unlock:</Label>
                  <p>{formatBN(lock.amountToUnlock, token?.decimals)}</p>
                </div>

                <Releases lock={lock} token={token} />

                {isOwner ? (
                  <Button onClick={onUnlock} disabled={lock.amountToUnlock.lte(0)}>
                    {lock.amountToUnlock.gt(0) ? 'Unlock available tokens' : 'No tokens available for unlock'}
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
export default LockDetail
