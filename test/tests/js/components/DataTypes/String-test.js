import React from 'react'
import { shallow, mount } from 'enzyme'
import { expect } from 'chai'

import JsonString from './../../../../../src/js/components/DataTypes/String'

describe('<JsonString />', function () {
  it('string component should have a data type label', function () {
    const wrapper = mount(
      <JsonString
        value='test'
        displayDataTypes
        theme='rjv-default'
      />
    )
    expect(wrapper.find('.data-type-label')).to.have.length(1)
  })

  it('string with hidden data type', function () {
    const props = {
      value: 'test',
      theme: 'rjv-default',
      displayDataTypes: false
    }
    const component = mount(<JsonString {...props} />).render()
    expect(component.find('.data-type-label')).to.have.length(0)
  })

  // test collapsed string and expand click
  it('string displaying data type', function () {
    const props = {
      value: 'test',
      displayDataTypes: false,
      theme: 'rjv-default'
    }
    const component = mount(<JsonString {...props} />).render()
    expect(component.find('.data-type-label')).to.have.length(0)
  })

  it('collapsed string content', function () {
    const props = {
      value: '123456789',
      collapseStringsAfterLength: 3,
      displayDataTypes: false,
      theme: 'rjv-default'
    }
    const component = shallow(<JsonString {...props} />)
    expect(component.render().find('.string-value').text()).to.equal(
      '"123 ..."'
    )
    component.find('.string-value').simulate('click')
    expect(component.render().find('.string-value').text()).to.equal(
      '"123456789"'
    )
  })

  it('string with special escape sequences', function () {
    const props = {
      value: '\\\n\t\r\f\\n',
      displayDataTypes: false,
      escapeStrings: true,
      theme: 'rjv-default'
    }
    const component = mount(<JsonString {...props} />).render()
    expect(component.find('.string-value').text()).to.equal(
      '"\\\\\\n\\t\\r\\f\\\\n"'
    )
  })

  it('string with special escape sequences is not escaped', function () {
    const props = {
      value: '\\\n\t\r\f\\n',
      displayDataTypes: false,
      escapeStrings: false,
      theme: 'rjv-default'
    }
    const component = mount(<JsonString {...props} />).render()
    expect(component.find('.string-value').text()).to.equal(
      '"\\\n\t\n\f\\n"'
    )
  })
})
