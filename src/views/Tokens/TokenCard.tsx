import React from 'react'
import { Label } from 'reactstrap'
import { Token } from 'state/types'
import { formatBN } from 'utils/formatters'
import tokenPlaceholder from '../../assets/img/tokenplaceholder.png'

interface Props {
  token: Token
}

const TokenCard: React.FC<Props> = ({ token }) => {
  return (
    <div className="col-md-4">
      <div className="card" key={token.address}>
        <div className="card-header text-center">
          <h4 className="title text-center">{token.name}</h4>
          <img width="80" src={tokenPlaceholder} alt="" />
        </div>
        <div className="card-body text-center">
          <div className="form-group">
            <Label>Token Symbol:</Label>
            <p>{token.symbol}</p>
          </div>
          <div className="form-group">
            <Label>Chain:</Label>
            <p>BSC</p>
          </div>
          <div className="form-group">
            <Label>Total Supply:</Label>
            <p>{formatBN(token.totalSupply, token.decimals)}</p>
          </div>
          <div className="form-group">
            <Label>Token address:</Label>
            <p>
              <a href={`https://testnet.bscscan.com/token/${token.address}`} target="_blank" rel="noreferrer">
                {token.address}
              </a>
            </p>
          </div>

          <div className="form-group">
            <Label>Balance:</Label>
						<p>{formatBN(token.accountBalance, token.decimals)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TokenCard
