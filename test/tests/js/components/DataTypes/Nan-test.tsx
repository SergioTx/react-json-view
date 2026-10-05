import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import JsonNan from './../../../../../src/js/components/DataTypes/Nan';
describe('<JsonNan />', function () {
  const rjvId = 1;
  it('Nan component should not data type label (display types enabled)', function () {
    const wrapper = render(
      <JsonNan rjvId={rjvId} displayDataTypes theme="rjv-default" />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>('.data-type-label')
    ).to.have.length(0);
  });
  it('Nan component should not data type label (display types enabled)', function () {
    const wrapper = render(
      <JsonNan rjvId={rjvId} displayDataTypes={false} theme="rjv-default" />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>('.data-type-label')
    ).to.have.length(0);
  });
});
