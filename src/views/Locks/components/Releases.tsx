import React, { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { Token, TokenLock } from 'state/types'
import { formatBN, formatDateTime } from 'utils/formatters'

interface Props {
  lock: Partial<TokenLock>
  token: Token
}

const Releases: React.FC<Props> = ({ lock, token }) => {
  const releases = useMemo(() => {
    if (lock.unlockTime && lock.releases && lock.amount) {
      const results: { release: number; time: Date; amountUnlocked: BigNumber; unlocked: boolean }[] = []
      const durationSteps = (lock.unlockTime.getTime() - lock.startTime.getTime()) / lock.releases
      const amountPerStep = lock.amount.div(lock.releases)
      for (let release = 1; release <= lock.releases; release++) {
        const result = {
          release,
          time: new Date(lock.startTime.getTime() + durationSteps * release),
          amountUnlocked: amountPerStep.multipliedBy(release),
          unlocked: false,
        }
        if (lock.amountUnlocked && lock.amountUnlocked.gte(result.amountUnlocked)) result.unlocked = true
        results.push(result)
      }
      return results
    }
    return null
  }, [lock])

  if (!releases) return null
  return (
    <div className="form-group mt-4">
      {releases.map((release) => (
        <div>
          {release.release}: {formatDateTime(release.time)} - {formatBN(release.amountUnlocked, token?.decimals)}
          {release.unlocked ? ' - UNLOCKED' : null}
        </div>
      ))}
    </div>
  )
}

export default Releases
