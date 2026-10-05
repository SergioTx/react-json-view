import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'

import {
  CircleMinus,
  CirclePlus,
  Clippy,
  SquarePlus,
  SquareMinus,
  ArrowDown,
  ArrowRight
} from './../../../../src/js/components/icons'

describe('svg icons', function () {
  it('<CircleMinus /> sanity check', function () {
    const wrapper = shallow(<CircleMinus />)
    expect(wrapper.find('svg').length).to.equal(1)
  })

  it('<CirclePlus /> sanity check', function () {
    const wrapper = shallow(<CirclePlus />)
    expect(wrapper.find('svg').length).to.equal(1)
  })

  it('<SquarePlus /> sanity check', function () {
    const wrapper = shallow(<SquarePlus />)
    expect(wrapper.find('svg').length).to.equal(1)
  })

  it('<SquareMinus /> sanity check', function () {
    const wrapper = shallow(<SquareMinus />)
    expect(wrapper.find('svg').length).to.equal(1)
  })

  it('<ArrowDown /> sanity check', function () {
    const wrapper = shallow(<ArrowDown />)
    expect(wrapper.find('svg').length).to.equal(1)
  })

  it('<ArrowRight /> sanity check', function () {
    const wrapper = shallow(<ArrowRight />)
    expect(wrapper.find('svg').length).to.equal(1)
  })

  it('<Clippy /> sanity check', function () {
    const wrapper = shallow(<Clippy />)
    expect(wrapper.find('svg').length).to.equal(1)
  })

  it('icon with color', function () {
    const wrapper = shallow(<Clippy style={{ color: 'green' }} />)
    expect(wrapper.find('svg').length).to.equal(1)
  })
})
