import React from 'react'
import { mount } from 'enzyme'
import { expect } from 'chai'
import VariableEditor from './../../../../src/js/components/VariableEditor'

describe('<VariableEditor />', function () {
  function renderVariable (props = {}) {
    return mount(
      <VariableEditor
        variable={{ name: 'test', value: true, type: 'boolean' }}
        theme='rjv-default'
        namespace={['root']}
        type='object'
        indentWidth={4}
        singleIndent={5}
        quotesOnKeys
        displayDataTypes
        {...props}
      />
    )
  }

  it('renders a read-only value and its key', function () {
    const wrapper = renderVariable()
    expect(wrapper.find('.object-key').text()).to.equal('"test"')
    expect(wrapper.find('.variable-value').text()).to.equal('booltrue')
    expect(wrapper.find('textarea')).to.have.length(0)
    expect(wrapper.find('.variable-value').prop('onClick')).to.equal(undefined)
    wrapper.unmount()
  })

  it('shows a comma between values but not after the last value', function () {
    const wrapper = renderVariable({ isLast: false })
    expect(wrapper.text()).to.include(',')
    wrapper.setProps({ isLast: true })
    expect(wrapper.text()).not.to.include(',')
    wrapper.unmount()
  })

  it('shows clipboard controls only while hovered', function () {
    const wrapper = renderVariable({ enableClipboard: true })
    expect(
      wrapper.find('.copy-to-clipboard-container').prop('style').display
    ).to.equal('none')
    wrapper.find('.variable-row').simulate('mouseEnter')
    expect(
      wrapper.find('.copy-to-clipboard-container').prop('style').display
    ).to.equal('inline-block')
    wrapper.find('.variable-row').simulate('mouseLeave')
    expect(
      wrapper.find('.copy-to-clipboard-container').prop('style').display
    ).to.equal('none')
    wrapper.unmount()
  })
})
