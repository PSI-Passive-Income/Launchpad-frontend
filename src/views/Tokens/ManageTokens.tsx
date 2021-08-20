import React, { useMemo } from 'react'
import { useActiveWeb3React } from 'hooks/web3'
import { useUserTokens } from 'state/hooks'
import { useLoading } from '@agney/react-loading'
import { values } from 'lodash'
import TokenCard from './TokenCard'
import emptyBox from '../../assets/img/empty-white-box.png'

const ManageTokens: React.FC = () => {
  const { account } = useActiveWeb3React()
  const { tokens, isLoadingTokens } = useUserTokens()
  const allTokens = useMemo(() => values(tokens), [tokens])

  const { containerProps, indicatorEl } = useLoading({
    loading: isLoadingTokens,
  })

  if (!account) return <p>Connect to Metamask</p>
  return (
    <div className="content" {...containerProps}>
      <div className="row">
        {indicatorEl}
        {!isLoadingTokens && !allTokens ? (
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
