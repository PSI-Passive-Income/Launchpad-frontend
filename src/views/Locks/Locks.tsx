import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Form } from 'react-bootstrap'
import { values } from 'lodash'
import { formatBN, formatDateTime } from 'utils/formatters'
import { useTokens, useUserTokenLocks } from 'state/hooks'
import { useGlobalLoader } from 'components/Loader'
import lockImage from '../../assets/img/lock.png'
import emptyBox from '../../assets/img/empty-white-box.png'

const Locks: React.FC = () => {
  const { tokenLocks, isLoadingLocks } = useUserTokenLocks()
  const allLocks = useMemo(() => values(tokenLocks), [tokenLocks])
  const tokenAddresses = useMemo(() => allLocks?.map((l) => l.token), [allLocks])
  const { tokens, isLoadingTokens } = useTokens(tokenAddresses)

  const loading = isLoadingLocks || isLoadingTokens
  useGlobalLoader(loading)

  return (
    <div className="content">
      <div className="row">
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
              <div className="col-md-4" key={lock.id}>
                <div className="card">
                  <div className="card-header">
                    <h5 className="title text-center">{tokens[lock.token?.toLowerCase()]?.name}</h5>
                  </div>
                  <div className="card-body">
                    <div className="form-group">
                      <Form.Label>Start time:</Form.Label>
                      <p>{formatDateTime(lock.startTime)}</p>
                    </div>
                    <div className="form-group">
                      <Form.Label>Last unlock time:</Form.Label>
                      <p>{formatDateTime(lock.unlockTime)}</p>
                    </div>
                    <div>
                      <img width="30" src={lockImage} alt="lock" />
                    </div>
                    <div className="form-group">
                      <Form.Label>Token address:</Form.Label>
                      <p>{lock.token}</p>
                    </div>
                    <div className="form-group">
                      <Form.Label>Owner:</Form.Label>
                      <p>{lock.owner}</p>
                    </div>
                    <div className="form-group">
                      <Form.Label>Total locked tokens:</Form.Label>
                      <p>{formatBN(lock.amount, tokens[lock.token?.toLowerCase()]?.decimals)}</p>
                    </div>
                    <div className="form-group">
                      <Form.Label>Unlocked tokens:</Form.Label>
                      <p>{formatBN(lock.amountUnlocked, tokens[lock.token?.toLowerCase()]?.decimals)}</p>
                    </div>
                    <Link to={`/lock/${lock.id}`}>Details</Link>
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
