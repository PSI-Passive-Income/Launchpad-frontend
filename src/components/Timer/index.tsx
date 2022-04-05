import { isEmpty } from 'lodash'
import React, { useState, useEffect, useMemo } from 'react'

interface Props {
  date: Date
}

const Timer: React.FC<Props> = ({ date }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(date) - +new Date()

    let timeLeft = {}

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    return timeLeft
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)
  })

  const timerComponents = useMemo(() => {
    return Object.keys(timeLeft).map((interval, index) => {
      if (index === 0) {
        return <span>{timeLeft[interval]}</span>
      }
      return <span>:{timeLeft[interval]}</span>
    })
  }, [timeLeft])

  return <p>{!isEmpty(timerComponents) ? timerComponents : <span>Time&apos;s up!</span>}</p>
}

export default Timer
