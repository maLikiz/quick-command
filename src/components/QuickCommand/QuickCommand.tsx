import React, { useEffect, useRef, useState } from 'react'
import NavigationActions from '../NavigationActions/NavigationActions'

let isCtrlPressed = false
let keys: string[] = []

const QuickCommand = () => {
  const [isVisible, setVisible] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const seq = 'Shift,Shift'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Control') {
        isCtrlPressed = true
      }

      if (isVisible && event.key === 'Escape') {
        event.preventDefault()
        setVisible(false)
        isCtrlPressed = false
        keys = []
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Control') {
        isCtrlPressed = false
        keys = []
      }

      if (isCtrlPressed) {
        keys.push(event.key)

        if (keys.toString().indexOf(seq) !== -1) {
          setVisible(true)
          keys = []

          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.focus()
            }
          }, 10)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.addEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  if (!isVisible) {
    return null
  }

  return (
    <NavigationActions
      isVisible={isVisible}
      setVisible={setVisible}
      inputRef={inputRef}
    />
  )
}

export default QuickCommand