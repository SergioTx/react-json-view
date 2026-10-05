import React from 'react'
import { render } from '@testing-library/react'
import { expect } from 'chai'
import ObjectName from './../../../../src/js/components/ObjectName'
describe('<ObjectName />', function () {
  it('ObjectName mount', function () {
    const wrapper = render(
      <ObjectName
        namespace='test'
        name='test'
        theme='rjv-default'
        jsvRoot={false}
      />
    )
    expect(wrapper.container.querySelectorAll('.object-key')).to.have.length(1)
  })
  it('ObjectName with parent array mount', function () {
    const wrapper = render(
      <ObjectName
        namespace='test'
        name='test'
        parent_type='array'
        theme='rjv-default'
        jsvRoot={false}
        displayArrayKey
      />
    )
    expect(wrapper.container.querySelectorAll('.array-key')).to.have.length(1)
  })
  it('ObjectName at root without name', function () {
    const wrapper = render(
      <ObjectName namespace='test' name={false} theme='rjv-default' jsvRoot />
    )
    expect(
      wrapper.container.querySelectorAll('span')[0].children
    ).to.have.length(0)
  })
  it('ObjectName with quotesOnKeys enabled (default)', function () {
    const wrapper = render(
      <ObjectName
        namespace='test'
        name='test'
        theme='rjv-default'
        jsvRoot={false}
        quotesOnKeys
      />
    )
    expect(
      wrapper.container
        .querySelectorAll('.object-key')[0]
        .querySelectorAll(':scope > span')
    ).to.have.length(3)
  })
  it('ObjectName with quotesOnKeys disabled', function () {
    const wrapper = render(
      <ObjectName
        namespace='test'
        name='test'
        theme='rjv-default'
        jsvRoot={false}
        quotesOnKeys={false}
      />
    )
    expect(
      wrapper.container
        .querySelectorAll('.object-key')[0]
        .querySelectorAll(':scope > span')
    ).to.have.length(1)
  })
  it('ObjectName array hides key', function () {
    const wrapper = render(
      <ObjectName
        namespace='test'
        name='test'
        parent_type='array'
        theme='rjv-default'
        jsvRoot={false}
        displayArrayKey={false}
      />
    )
    expect(wrapper.container.querySelectorAll('.array-key')).to.have.length(0)
  })
})
