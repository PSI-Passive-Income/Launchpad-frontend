import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useLoading } from '@agney/react-loading'
import { Label } from 'reactstrap'
import { values } from 'lodash'
import { formatBN, formatDateTime } from 'utils/formatters'
import { useTokens, useUserTokenLocks } from 'state/hooks'
import lockImage from '../../assets/img/lock.png'
import emptyBox from '../../assets/img/empty-white-box.png'

const Locks: React.FC = () => {
  const { tokenLocks, isLoadingLocks } = useUserTokenLocks()
  const allLocks = useMemo(() => values(tokenLocks), [tokenLocks])
  const tokenAddresses = useMemo(() => allLocks?.map((l) => l.token), [allLocks])
  const { tokens, isLoadingTokens } = useTokens(tokenAddresses)

  const { containerProps, indicatorEl } = useLoading({
    loading: isLoadingLocks || isLoadingTokens,
  })

  return (
    <div className="content" {...containerProps}>
      <div className="row">
        {indicatorEl} {/* renders only while loading */}
        {!isLoadingLocks && !tokenLocks ? (
          <div className="col-sm-12 col-md-6 offset-md-2 notoken-column">
            <div className="card text-center">
              <div className="notokens-warning">
                <img src={emptyBox} height="200px" width="200px" alt="no locks" />
              </div>
              <h3>Looks like there are no locks here</h3>
            </div>
          </div>
        ) : null}
        {tokenLocks
          ? allLocks.map((lock) => (
              <div className="col-md-4">
                <div className="card">
                  <div className="card-header">
                    <h5 className="title text-center">{tokens[lock.token?.toLowerCase()]?.name}</h5>
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
                    <Link to={`/locks/${lock.id}}`}>Details</Link>
                  </div>
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  )
}
export default Locks