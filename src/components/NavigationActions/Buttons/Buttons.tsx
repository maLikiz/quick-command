import React, { FC, RefObject, useEffect } from 'react'
import Button, { IButton } from './Button'
import styles from './Buttons.module.scss'
import Link, { ILink } from './Link'
import $ from 'jquery'

interface IButtonsProps {
  buttons: IButton[]
  focusedButton: IButton | null
  focusedButtonRef: RefObject<HTMLButtonElement | HTMLAnchorElement>
  direction: 'up' | 'down'
}

function scrollToItem(targetElem: JQuery, direction: 'up' | 'down') {
  const scrollAbleElement = $('#quick-command-buttons').parent()
  const targetElemOffsetTop = targetElem.offset()?.top ?? 0
  const scrollTop = scrollAbleElement.scrollTop() ?? 0
  const myElemOffsetTop = scrollAbleElement.offset()?.top ?? 0
  const targetElemTop = targetElemOffsetTop - myElemOffsetTop + scrollTop
  const targetElemBottom = targetElemTop + (targetElem.outerHeight() ?? 0)
  const windowHeight = scrollAbleElement.height() ?? 0

  const targetElementHeight = targetElem.innerHeight() ?? 0
  const reserve = 2

  const isAbove = targetElemTop < scrollTop + targetElementHeight * reserve
  const isBelow = targetElemBottom > scrollTop + windowHeight - targetElementHeight * reserve
  const goesUp = direction === 'up'

  if (isAbove || isBelow) {
    const goto = goesUp ? targetElemTop - targetElementHeight * reserve : targetElemTop - windowHeight + (targetElementHeight * (reserve + 1))

    scrollAbleElement.stop(true).animate({ scrollTop: goto }, 100)
  }
}

const Buttons: FC<IButtonsProps> = (props) => {
  const { buttons, focusedButton, focusedButtonRef, direction } = props

  useEffect(() => {
    setTimeout(() => {
      if (focusedButtonRef.current) {
        scrollToItem($(focusedButtonRef.current), direction)
      }
    }, 0)
  }, [focusedButtonRef.current, direction])

  return (
    <div
      className={styles.buttons}
      id="quick-command-buttons"
    >
      {buttons.map((button, index) => {
        const isFocused = focusedButton === button

        if ((button as ILink).url) {
          return (
            <Link
              innerRef={isFocused ? focusedButtonRef as RefObject<HTMLAnchorElement> : undefined}
              link={button as ILink}
              key={index}
              isFocused={isFocused}
            />
          )
        }

        return (
          <Button
            innerRef={isFocused ? focusedButtonRef as RefObject<HTMLButtonElement> : undefined}
            button={button as IButton}
            key={index}
            isFocused={isFocused}
          />
        )
      })}
    </div>
  )
}

export default Buttons