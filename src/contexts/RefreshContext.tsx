// import useDebounce from 'hooks/useDebounce'
// import useIsWindowVisible from 'hooks/useIsWindowVisible'
// import { useActiveWeb3React } from 'hooks/web3'
import React, { useState, useEffect, useMemo } from 'react'

const FAST_INTERVAL = 10000
const SLOW_INTERVAL = 60000

// interface Block {
//   chainId: number | undefined
//   blockNumber: number | null
// }

interface IRefreshContext {
  slow: number
  fast: number
  // block: Block
}

const RefreshContext = React.createContext<IRefreshContext>({ slow: 0, fast: 0 })

// This context maintain 2 counters that can be used as a dependencies on other hooks to force a periodic refresh
const RefreshContextProvider = ({ children }) => {
  // const { library, chainId } = useActiveWeb3React()
  // const windowVisible = useIsWindowVisible()

  // const [block, setBlock] = useState<Block>({
  //   chainId,
  //   blockNumber: null,
  // })

  const [slow, setSlow] = useState(0)
  const [fast, setFast] = useState(0)

  useEffect(() => {
    const interval = setInterval(async () => {
      setFast((prev) => prev + 1)
    }, FAST_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(async () => {
      setSlow((prev) => prev + 1)
    }, SLOW_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  // const blockNumberCallback = useCallback(
  //   (blockNumber: number) => {
  //     setBlock((_block) => {
  //       if (chainId === _block.chainId) {
  //         if (typeof _block.blockNumber !== 'number') return { chainId, blockNumber }
  //         return { chainId, blockNumber: Math.max(blockNumber, _block.blockNumber) }
  //       }
  //       return _block
  //     })
  //   },
  //   [chainId, setBlock],
  // )

  // // attach/detach listeners
  // useEffect(() => {
  //   if (!library || !chainId || !windowVisible) return undefined

  //   setBlock({ chainId, blockNumber: null })

  //   library
  //     .getBlockNumber()
  //     .then(blockNumberCallback)
  //     .catch((error) => console.error(`Failed to get block number for chainId: ${chainId}`, error))

  //   library.on('block', (bn: number) => {
  //     blockNumberCallback(bn)
  //   })
  //   return () => {
  //     library.removeListener('block', blockNumberCallback)
  //   }
  // }, [chainId, library, blockNumberCallback, windowVisible])

  // const debouncedBlock = useDebounce(block, 500)

  // const props = useMemo(() => ({ slow, fast, block: debouncedBlock }), [slow, fast, debouncedBlock])
  const props = useMemo(() => ({ slow, fast }), [slow, fast])
  return <RefreshContext.Provider value={props}>{children}</RefreshContext.Provider>
}

export { RefreshContext, RefreshContextProvider }
