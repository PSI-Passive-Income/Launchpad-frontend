import React, { useState } from 'react'
import styled from 'styled-components'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import Text from '../Text/Text'
import { CopyIcon } from '../Svg'

interface Props {
  toCopy: string
}

const StyleButton = styled(Text).attrs({ role: 'button' })`
  position: relative;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
`

const CopyToClipboard: React.FC<Props> = ({ toCopy, children, ...props }) => {
  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false)

  return (
    <OverlayTrigger placement="bottom" show={isTooltipDisplayed} overlay={<Tooltip>Copied</Tooltip>}>
      <StyleButton
        bold
        onClick={() => {
          if (navigator.clipboard) {
            navigator.clipboard.writeText(toCopy)
            setIsTooltipDisplayed(true)
            setTimeout(() => {
              setIsTooltipDisplayed(false)
            }, 1000)
          }
        }}
        {...props}
      >
        {children}
        <CopyIcon width="20px" color="primary" ml="4px" />
      </StyleButton>
    </OverlayTrigger>
  )
}

export default CopyToClipboard
