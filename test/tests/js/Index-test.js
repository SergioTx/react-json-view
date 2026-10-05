import React from 'react'
import { render, mount } from 'enzyme'
import { expect } from 'chai'
import { JSDOM } from 'jsdom'

import Index from './../../../src/js/index'
import JsonViewer from './../../../src/js/components/JsonViewer'
import ObjectAttributes from './../../../src/js/stores/ObjectAttributes'

const { window } = new JSDOM()
global.window = window
global.document = window.document

describe('<Index />', function () {
  it('keeps expansion state when its parent is collapsed and expanded', function () {
    const wrapper = mount(
      <Index src={{ nested: { value: 1 } }} enableClipboard={false} />
    )
    wrapper.find('.icon-container').at(1).simulate('click')
    expect(wrapper.find('.variable-row')).to.have.length(0)
    wrapper.find('.icon-container').first().simulate('click')
    wrapper.find('.icon-container').first().simulate('click')
    expect(wrapper.find('.node-ellipsis')).to.have.length(1)
    expect(wrapper.find('.variable-row')).to.have.length(0)
    wrapper.find('.icon-container').at(1).simulate('click')
    expect(wrapper.find('.variable-row')).to.have.length(1)
    wrapper.unmount()
  })

  it('recomputes ancestors when the source changes', function () {
    const previous = { value: 1 }
    const next = { previous }
    next.self = next
    const wrapper = mount(<Index src={previous} enableClipboard={false} />)
    wrapper.setProps({ src: next })
    expect(wrapper.text().split('[CIRCULAR REFERENCE]')).to.have.length(2)
    expect(wrapper.find('.variable-value').text()).to.equal('int1')
    wrapper.unmount()
  })

  it('shows commas between nested array and object values without trailing commas', function () {
    const wrapper = render(
      <Index
        src={[1, { value: 2 }, [3, 4]]}
        name={false}
        quotesOnKeys={false}
        displayArrayKey={false}
        displayObjectSize={false}
        displayDataTypes={false}
        enableClipboard={false}
      />
    )
    expect(wrapper.text()).to.equal('[1,{value:2},[3,4]]')
  })

  it('shows commas between collapsed and expanded array groups', function () {
    const wrapper = mount(
      <Index
        src={[1, 2, 3, 4]}
        name={false}
        groupArraysAfterLength={2}
        displayArrayKey={false}
        displayObjectSize={false}
        displayDataTypes={false}
        enableClipboard={false}
      />
    )
    expect(wrapper.text()).to.equal('[0 - 1],[2 - 3]')
    wrapper.find('.array-group-brace').first().simulate('click')
    wrapper.find('.array-group-brace').first().simulate('click')
    expect(wrapper.text()).to.equal('[1,2],[3,4]')
    wrapper.unmount()
  })

  it('detects circular arrays inside expanded groups', function () {
    const src = [1, 2]
    src.push(src)
    const wrapper = mount(
      <Index src={src} groupArraysAfterLength={2} enableClipboard={false} />
    )
    wrapper.find('.array-group-brace').last().simulate('click')
    expect(wrapper.text()).to.include('[CIRCULAR REFERENCE]')
    wrapper.unmount()
  })

  it('clears saved display attributes on unmount', function () {
    const wrapper = mount(<Index src={{ value: 1 }} enableClipboard={false} />)
    const rjvId = wrapper.find(JsonViewer).prop('rjvId')
    wrapper.find('.icon-container').first().simulate('click')
    expect(ObjectAttributes.get(rjvId, ['root'], 'expanded')).to.equal(false)
    wrapper.unmount()
    expect(ObjectAttributes.get(rjvId, ['root'], 'expanded')).to.equal(
      undefined
    )
  })

  it('check data type labels from index', function () {
    const wrapper = render(
      <Index
        src={{
          bool: true,
          str: 'test',
          int: 5,
          nan: NaN,
          null: null,
          func: (test) => {},
          obj: {
            arrChild: [1, 2, 'three'],
            objChild: {
              one: 1,
              two: 'two'
            }
          },
          arr: [[1, 'two'], { one: 'one', two: 2 }],
          regexp: /[0-9]/gi
        }}
      />
    )
    expect(wrapper.find('.data-type-label')).to.have.length(14)
    expect(wrapper.find('.data-type-label')).to.have.length(14)
  })

  it('check object-size labels from index', function () {
    const wrapper = mount(
      <Index
        src={{
          bool: true,
          str: 'test',
          int: 5,
          nan: NaN,
          null: null,
          func: (test) => {},
          obj: {
            arrChild: [1, 2, 'three'],
            objChild: {
              one: 1,
              two: 'two'
            }
          },
          arr: [[1, 'two'], { one: 'one', two: 2 }],
          regexp: /[0-9]/gi
        }}
        displayObjectSize
        displayDataTypes
        enableClipboard={false}
      />
    )
    expect(wrapper.find('.object-size')).to.have.length(7)

    wrapper.setProps({ displayObjectSize: false })
    expect(wrapper.find('.object-size')).to.have.length(0)
  })

  it('src replaced with error message (ERROR OUTPUT EXPECTED)', function () {
    const wrapper = render(
      <Index src='{jsonEncodedString:true, createError:true}' />
    )
    expect(wrapper.find('.data-type-label')).to.have.length(1)
  })

  it('make sure copy to clipboard is displayed all properties', function () {
    const wrapper = render(
      <Index
        src={{
          test: true,
          passing: 'hopefully',
          arr: [5],
          obj: {},
          regexp: /[0-9]/gi
        }}
      />
    )
    expect(wrapper.find('.copy-to-clipboard-container')).to.have.length(7)
  })

  it('renders updated source props', function () {
    const wrapper = mount(<Index src={{ test: true }} />)
    expect(wrapper.find('.data-type-label')).to.have.length(1)
    wrapper.setProps({ src: { test1: true, test2: false } })
    expect(wrapper.find('.data-type-label')).to.have.length(2)
    wrapper.unmount()
  })

  it('index can have ArrayGroup root component', function () {
    const wrapper = render(
      <Index
        name='test'
        groupArraysAfterLength={5}
        src={new Array(15).fill(0)}
      />
    )
    expect(wrapper.find('.array-group')).to.have.length(3)
  })

  it('length is correct even if an object has a length property', function () {
    const wrapper = render(
      <Index
        src={{
          first: 'first property',
          second: 'second property',
          length: 1000
        }}
      />
    )
    expect(wrapper.find('.object-size')).to.have.length(1)
  })

  it('should show commas between elements', function () {
    const wrapper = render(
      <Index
        src={{
          first: 'first property',
          second: 'second property',
          third: 'third property'
        }}
      />
    )
    // Check that commas are present in the rendered output
    expect(wrapper.text()).to.include(',')
  })

  it('should default to showing commas between elements', function () {
    const wrapper = render(
      <Index
        src={{
          first: 'first property',
          second: 'second property',
          third: 'third property'
        }}
      />
    )
    // Check that commas are present by default
    expect(wrapper.text()).to.include(',')
  })
})
