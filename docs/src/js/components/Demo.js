import React from 'react'
import ReactSelect from 'react-select'
import ReactJson from './../../../../src/js/index'
import './../../style/scss/rjv-demo.scss'

const themeNames = [
  'apathy',
  'apathy:inverted',
  'ashes',
  'bespin',
  'brewer',
  'bright:inverted',
  'bright',
  'chalk',
  'codeschool',
  'colors',
  'eighties',
  'embers',
  'flat',
  'google',
  'grayscale',
  'grayscale:inverted',
  'greenscreen',
  'harmonic',
  'hopscotch',
  'isotope',
  'marrakesh',
  'mocha',
  'monokai',
  'ocean',
  'paraiso',
  'pop',
  'railscasts',
  'rjv-default',
  'shapeshifter',
  'shapeshifter:inverted',
  'solarized',
  'summerfruit',
  'summerfruit:inverted',
  'threezerotwofour',
  'tomorrow',
  'tube',
  'twilight'
]

const settings = [
  { field: 'theme', label: 'Theme:', values: themeNames },
  {
    field: 'iconStyle',
    label: 'Icon Style:',
    values: ['circle', 'square', 'triangle']
  },
  {
    field: 'enableClipboard',
    label: 'Enable Clipboard:',
    values: [true, false]
  },
  {
    field: 'displayDataTypes',
    label: 'Display Data Types:',
    values: [true, false]
  },
  {
    field: 'displayObjectSize',
    label: 'Display Object Size:',
    values: [true, false]
  },
  {
    field: 'indentWidth',
    label: 'Indent Width:',
    values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  { field: 'collapsed', label: 'Collapsed:', values: [true, false, 1, 2] },
  {
    field: 'collapseStringsAfterLength',
    label: 'Collapse Strings After Length:',
    values: [false, 5, 10, 15, 20]
  }
]

function getExampleJson () {
  return {
    string: 'this is a test string',
    integer: 42,
    array: [1, 2, 3, 'test', NaN],
    float: 3.14159,
    undefined,
    object: { 'first-child': true, 'second-child': false, 'last-child': null },
    string_number: '1234',
    date: new Date()
  }
}

export default function Demo () {
  const [src] = React.useState(getExampleJson)
  const [options, setOptions] = React.useState({
    theme: 'rjv-default',
    collapsed: false,
    collapseStringsAfterLength: 15,
    displayObjectSize: true,
    enableClipboard: true,
    indentWidth: 4,
    displayDataTypes: true,
    iconStyle: 'triangle'
  })
  const [siteTheme, setSiteTheme] = React.useState(null)
  const viewerRef = React.useRef(null)

  React.useEffect(() => {
    const viewer = viewerRef.current.querySelector('.react-json-view')
    function updateStyles () {
      const getStyle = (element, property) =>
        window.getComputedStyle(element).getPropertyValue(property)
      let current = viewer
      let background = 'rgb(255, 255, 255)'
      while (current) {
        const color = getStyle(current, 'background-color')
        if (color && color !== 'transparent' && color !== 'rgba(0, 0, 0, 0)') {
          background = color
          break
        }
        current = current.parentElement
      }
      const nextTheme = {
        color: getStyle(viewer.querySelector('.object-key') || viewer, 'color'),
        bgColor: background,
        borderColor: getStyle(
          viewer.querySelector('.variable-row') || viewer,
          'border-left-color'
        )
      }
      setSiteTheme((previous) =>
        previous &&
        Object.keys(nextTheme).every((key) => previous[key] === nextTheme[key])
          ? previous
          : nextTheme
      )
    }
    updateStyles()
    const observer = new window.MutationObserver(updateStyles)
    observer.observe(viewer, {
      attributes: true,
      childList: true,
      subtree: true
    })
    return () => observer.disconnect()
  }, [])

  const selectStyles = siteTheme
    ? {
        control: (base) => ({
          ...base,
          backgroundColor: siteTheme.bgColor,
          borderColor: siteTheme.borderColor,
          color: siteTheme.color
        }),
        singleValue: (base) => ({ ...base, color: siteTheme.color }),
        option: (base, { isFocused }) => ({
          ...base,
          backgroundColor: siteTheme.bgColor,
          color: siteTheme.color,
          opacity: isFocused ? 0.8 : 1
        }),
        menu: (base) => ({ ...base, backgroundColor: siteTheme.bgColor }),
        input: (base) => ({ ...base, color: siteTheme.color }),
        indicatorSeparator: (base) => ({
          ...base,
          backgroundColor: siteTheme.borderColor
        }),
        dropdownIndicator: (base) => ({ ...base, color: siteTheme.color })
      }
    : {}

  return (
    <>
      {siteTheme && (
        <style>{`body { color: ${siteTheme.color}; background-color: ${siteTheme.bgColor}; } .react-json-view { border: 1px solid ${siteTheme.borderColor}; }`}</style>
      )}
      <div className='rjv-demo' ref={viewerRef}>
        <div className='rjv-header'>
          <div className='header-1'>@microlink/react-json-view</div>
        </div>
        <ReactJson
          name={false}
          style={{ padding: '10px', borderRadius: '3px', margin: '10px 0px' }}
          src={src}
          {...options}
        />
        {[settings.slice(0, 3), settings.slice(3)].map((group, index) => (
          <div className='rjv-settings' key={index}>
            {group.map(({ field, label, values }) => {
              const choices = values.map((value) => ({
                value,
                label: String(value)
              }))
              return (
                <div className='rjv-input' key={field}>
                  <div className='rjv-label'>{label}</div>
                  <ReactSelect
                    name={field}
                    value={choices.find(
                      (choice) => choice.value === options[field]
                    )}
                    options={choices}
                    styles={selectStyles}
                    onChange={(choice) =>
                      setOptions((previous) => ({
                        ...previous,
                        [field]: choice.value
                      }))}
                  />
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </>
  )
}
