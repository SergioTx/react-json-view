import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import JsonRegex from './../../../../../src/js/components/DataTypes/Function';
describe('<JsonRegex />', function () {
  const rjvId = 1;
  it('regex component should have a data type label', function () {
    const wrapper = render(
      <JsonRegex
        value={/[0-9]/gi}
        rjvId={rjvId}
        displayDataTypes
        theme="rjv-default"
      />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>('.data-type-label')
    ).to.have.length(1);
  });
  it('regex component should not have a data type label', function () {
    const wrapper = render(
      <JsonRegex
        value={/[0-9]/gi}
        rjvId={rjvId}
        displayDataTypes={false}
        theme="rjv-default"
      />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>('.data-type-label')
    ).to.have.length(0);
  });
});
