import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import JsonNull from './../../../../../src/js/components/DataTypes/Null';
describe('<JsonNull />', function () {
  const rjvId = 1;
  it('Null component should no data type label (type labels enabled)', function () {
    const wrapper = render(
      <JsonNull rjvId={rjvId} displayDataTypes theme="rjv-default" />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>('.data-type-label')
    ).to.have.length(0);
  });
  it('Null component should no data type label (type labels disabled)', function () {
    const wrapper = render(
      <JsonNull rjvId={rjvId} displayDataTypes={false} theme="rjv-default" />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>('.data-type-label')
    ).to.have.length(0);
  });
});
