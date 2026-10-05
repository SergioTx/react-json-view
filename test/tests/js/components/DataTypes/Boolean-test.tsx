import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import JsonBoolean from './../../../../../src/js/components/DataTypes/Boolean';
describe('<JsonBoolean />', function () {
  const rjvId = 1;
  it('bool component should have a data type label: True', function () {
    const wrapper = render(
      <JsonBoolean value rjvId={rjvId} displayDataTypes theme="rjv-default" />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>('.data-type-label')
    ).to.have.length(1);
  });
  it('bool component not should have a data type label: True', function () {
    const wrapper = render(
      <JsonBoolean
        value
        rjvId={rjvId}
        displayDataTypes={false}
        theme="rjv-default"
      />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>('.data-type-label')
    ).to.have.length(0);
  });
  it('bool component should have a data type label: False', function () {
    const wrapper = render(
      <JsonBoolean
        value={false}
        rjvId={rjvId}
        displayDataTypes
        theme="rjv-default"
      />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>('.data-type-label')
    ).to.have.length(1);
  });
  it('bool component should have a data type label: False', function () {
    const wrapper = render(
      <JsonBoolean
        value={false}
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
