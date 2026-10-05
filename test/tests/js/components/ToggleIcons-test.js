import React from 'react'
import { render } from '@testing-library/react'
import { expect } from 'chai'
import {
  ExpandedIcon,
  CollapsedIcon
} from './../../../../src/js/components/ToggleIcons'
import {
  CircleMinus,
  CirclePlus,
  SquareMinus,
  SquarePlus,
  ArrowRight,
  ArrowDown
} from './../../../../src/js/components/icons'
describe('<ToggleIcons />', function () {
  it('ExpandedIcon mount', function () {
    const wrapper = render(<ExpandedIcon theme='rjv-default' />)
    expect(wrapper.container.querySelectorAll('.expanded-icon')).to.have.length(
      1
    )
  })
  it('CollapsedIcon mount', function () {
    const wrapper = render(<CollapsedIcon theme='rjv-default' />)
    expect(
      wrapper.container.querySelectorAll('.collapsed-icon')
    ).to.have.length(1)
  })
  it('ExpandedIcon with triangle style', function () {
    const wrapper = render(
      <ExpandedIcon theme='rjv-default' iconStyle='triangle' />
    )
    expect(wrapper.container.querySelector('path').getAttribute('d')).to.equal(
      render(<ArrowDown />)
        .container.querySelector('path')
        .getAttribute('d')
    )
  })
  it('ExpandedIcon with square style', function () {
    const wrapper = render(
      <ExpandedIcon theme='rjv-default' iconStyle='square' />
    )
    expect(wrapper.container.querySelector('path').getAttribute('d')).to.equal(
      render(<SquareMinus />)
        .container.querySelector('path')
        .getAttribute('d')
    )
  })
  it('ExpandedIcon with no style', function () {
    const wrapper = render(<ExpandedIcon theme='rjv-default' />)
    expect(wrapper.container.querySelector('path').getAttribute('d')).to.equal(
      render(<CircleMinus />)
        .container.querySelector('path')
        .getAttribute('d')
    )
  })
  it('CollapsedIcon with triangle style', function () {
    const wrapper = render(
      <CollapsedIcon theme='rjv-default' iconStyle='triangle' />
    )
    expect(wrapper.container.querySelector('path').getAttribute('d')).to.equal(
      render(<ArrowRight />)
        .container.querySelector('path')
        .getAttribute('d')
    )
  })
  it('CollapsedIcon with square style', function () {
    const wrapper = render(
      <CollapsedIcon theme='rjv-default' iconStyle='square' />
    )
    expect(wrapper.container.querySelector('path').getAttribute('d')).to.equal(
      render(<SquarePlus />)
        .container.querySelector('path')
        .getAttribute('d')
    )
  })
  it('CollapsedIcon with no style', function () {
    const wrapper = render(<CollapsedIcon theme='rjv-default' />)
    expect(wrapper.container.querySelector('path').getAttribute('d')).to.equal(
      render(<CirclePlus />)
        .container.querySelector('path')
        .getAttribute('d')
    )
  })
})
