import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { expect } from 'chai'
import VariableMeta from './../../../../src/js/components/VariableMeta'
describe('<VariableMeta />', function () {
  const rjvId = 1
  it('VariableMeta clipboard should not exist', function () {
    const wrapper = render(
      <VariableMeta
        src={{
          test: true
        }}
        size={1}
        theme='rjv-default'
        enableClipboard={false}
        rjvId={rjvId}
      />
    )
    expect(
      wrapper.container.querySelectorAll('.copy-to-clipboard-container')
    ).to.have.length(0)
  })
  it('VariableMeta size should exist', function () {
    const wrapper = render(
      <VariableMeta
        src={{
          test: true
        }}
        size={1}
        theme='rjv-default'
        displayObjectSize
        rjvId={rjvId}
      />
    )
    expect(wrapper.container.querySelectorAll('.object-size')).to.have.length(1)
  })
  it('VariableMeta size should not exist', function () {
    const wrapper = render(
      <VariableMeta
        src={{
          test: true
        }}
        size={1}
        theme='rjv-default'
        displayObjectSize={false}
        rjvId={rjvId}
      />
    )
    expect(wrapper.container.querySelectorAll('.object-size')).to.have.length(0)
  })
  it('VariableMeta clipboard click with copy callback', function () {
    const inputSrc = {
      test: true
    }
    let callbackCounter = 0
    const wrapper = render(
      <VariableMeta
        src={inputSrc}
        size={1}
        theme='rjv-default'
        namespace={['test']}
        enableClipboard={(copy) => {
          expect(copy.src.test).to.equal(inputSrc.test)
          // increment counter to assert that callback was called
          callbackCounter++
        }}
        rjvId={rjvId}
      />
    )
    expect(
      wrapper.container.querySelectorAll('.copy-to-clipboard-container')
    ).to.have.length(1)
    expect(wrapper.container.querySelectorAll('.copy-icon')).to.have.length(1)
    document.execCommand = (mock) => {}
    fireEvent.click(wrapper.container.querySelectorAll('.copy-icon')[0])
    // verify that callback was called
    expect(callbackCounter).to.equal(1)
    wrapper.unmount()
  })
  it('VariableMeta clipboard click without copy callback', function () {
    const wrapper = render(
      <VariableMeta
        src={{
          test: true
        }}
        size={1}
        theme='rjv-default'
        enableClipboard
        rjvId={rjvId}
      />
    )
    expect(
      wrapper.container.querySelectorAll('.copy-to-clipboard-container')
    ).to.have.length(1)
    expect(wrapper.container.querySelectorAll('.copy-icon')).to.have.length(1)
    wrapper.unmount()
  })
})
