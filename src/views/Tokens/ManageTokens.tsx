import React, { useMemo } from 'react'
import { useActiveWeb3React } from 'hooks/web3'
import { useUserTokens } from 'state/hooks'
import { isEmpty, values } from 'lodash'
import Loader from 'components/Loader'
import TokenCard from './TokenCard'
import emptyBox from '../../assets/img/empty-white-box.png'

const ManageTokens: React.FC = () => {
  const { account } = useActiveWeb3React()
  const { tokens, isLoadingTokens } = useUserTokens()
  const allTokens = useMemo(() => values(tokens), [tokens])

  if (!account)
    return (
      <div className="content">
        <div className="col-sm-12 col-md-6 offset-md-2 notoken-column">
          <div className="text-center">
            <h3>Looks like there is no Connection with wallet</h3>
          </div>
        </div>
      </div>
    )
  return (
    <div className="content">
      <Loader loading={isLoadingTokens} />

      <div className="row">
        {!isLoadingTokens && isEmpty(allTokens) ? (
          <div className="col-sm-12 col-md-6 offset-md-2 notoken-column">
            <div className="card text-center">
              <div className="notokens-warning">
                <img src={emptyBox} height="200px" width="200px" alt="no tokens" />
              </div>
              <h3>Looks like there are no tokens here</h3>
            </div>
          </div>
        ) : null}

        {allTokens?.map((token) => (
          <TokenCard token={token} />
        ))}
      </div>
    </div>
  )
}

export default ManageTokens
