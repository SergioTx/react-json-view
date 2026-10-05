import React from 'react'
import { render } from '@testing-library/react'
import { expect } from 'chai'
import DataTypeLabel from './../../../../../src/js/components/DataTypes/DataTypeLabel'
describe('<DataTypeLabel />', function () {
  const rjvId = 1
  it('DataTypeLabel should exist when displayDataTypes is true', function () {
    const wrapper = render(
      <DataTypeLabel
        typeName='test'
        rjvId={rjvId}
        displayDataTypes
        theme='rjv-default'
      />
    )
    expect(
      wrapper.container.querySelectorAll('.data-type-label')
    ).to.have.length(1)
  })
  it('DataTypeLabel should not exist when displayDataTypes is false', function () {
    const wrapper = render(
      <DataTypeLabel
        typeName='test'
        rjvId={rjvId}
        displayDataTypes={false}
        theme='rjv-default'
      />
    )
    expect(
      wrapper.container.querySelectorAll('.data-type-label')
    ).to.have.length(0)
  })
})
