import React from 'react'
import { toType } from './../helpers/util'
import { Clippy } from './icons'
import Theme from './../themes/getStyle'

function copyToClipboardFallback (text) {
  const textArea = document.createElement('textarea')
  textArea.value = text
  document.body.appendChild(textArea)
  textArea.select()
  try {
    document.execCommand('copy')
  } finally {
    document.body.removeChild(textArea)
  }
}

export default function CopyToClipboard ({
  clickCallback,
  src,
  namespace,
  theme,
  rowHovered
}) {
  const [copied, setCopied] = React.useState(false)
  const copiedTimer = React.useRef(null)
  React.useEffect(() => () => clearTimeout(copiedTimer.current), [])

  function handleCopy () {
    const type = toType(src)
    const value =
      type === 'function' || type === 'regexp' ? src.toString() : src
    const text =
      typeof value === 'string' ? value : JSON.stringify(value, null, '  ')
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .catch(() => copyToClipboardFallback(text))
    } else {
      copyToClipboardFallback(text)
    }
    clearTimeout(copiedTimer.current)
    copiedTimer.current = setTimeout(() => setCopied(false), 5500)
    setCopied(true)
    if (typeof clickCallback === 'function') {
      clickCallback({ src, namespace, name: namespace[namespace.length - 1] })
    }
  }

  return (
    <span
      className='copy-to-clipboard-container'
      title='Copy to clipboard'
      style={{
        verticalAlign: 'top',
        display: rowHovered ? 'inline-block' : 'none'
      }}
    >
      <span
        style={Theme(theme, 'copy-to-clipboard').style}
        onClick={handleCopy}
      >
        <Clippy className='copy-icon' {...Theme(theme, 'copy-icon')} />
        {copied && (
          <span {...Theme(theme, 'copy-icon-copied')}>{'\u2714'}</span>
        )}
      </span>
    </span>
  )
}
