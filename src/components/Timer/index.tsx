import React, { useState, useEffect } from 'react'

interface Props {
  date: Date
}

const Timer: React.FC<Props> = ({ date }) => {
  const calculateTimeLeft = () => {
    const year = new Date().getFullYear()
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
  const [year] = useState(new Date().getFullYear())

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)
  })

  const timerComponents = []

  Object.keys(timeLeft).forEach((interval, index) => {
    // if (!timeLeft[interval]) {
    //   return;
    // }
    if (index === 0) {
      timerComponents.push(<span>{timeLeft[interval]}</span>)
    } else {
      timerComponents.push(<span>:{timeLeft[interval]}</span>)
    }
  })
  return <p>{timerComponents.length ? timerComponents : <span>Time&apos;s up!</span>}</p>
}

export default Timer
