import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import { ValueProps } from '../../../../../src/js/types';
import { required } from '../../../../testHelpers/requireSources';
import JsonString from './../../../../../src/js/components/DataTypes/String';
describe('<JsonString />', function () {
  it('string component should have a data type label', function () {
    const wrapper = render(
      <JsonString value="test" displayDataTypes theme="rjv-default" />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>('.data-type-label')
    ).to.have.length(1);
  });
  it('string with hidden data type', function () {
    const props: ValueProps = {
      value: 'test',
      theme: 'rjv-default',
      displayDataTypes: false,
    };
    const component = render(<JsonString {...props} />);
    expect(
      component.container.querySelectorAll<HTMLElement>('.data-type-label')
    ).to.have.length(0);
  });

  // test collapsed string and expand click
  it('string displaying data type', function () {
    const props: ValueProps = {
      value: 'test',
      displayDataTypes: false,
      theme: 'rjv-default',
    };
    const component = render(<JsonString {...props} />);
    expect(
      component.container.querySelectorAll<HTMLElement>('.data-type-label')
    ).to.have.length(0);
  });
  it('collapsed string content', function () {
    const props: ValueProps = {
      value: '123456789',
      collapseStringsAfterLength: 3,
      displayDataTypes: false,
      theme: 'rjv-default',
    };
    const component = render(<JsonString {...props} />);
    expect(
      required(
        component.container.querySelectorAll<HTMLElement>('.string-value')[0]
      ).textContent
    ).to.equal('"123 ..."');
    fireEvent.click(
      required(
        component.container.querySelectorAll<HTMLElement>('.string-value')[0]
      )
    );
    expect(
      required(
        component.container.querySelectorAll<HTMLElement>('.string-value')[0]
      ).textContent
    ).to.equal('"123456789"');
  });
  it('string with special escape sequences', function () {
    const props: ValueProps = {
      value: '\\\n\t\r\f\\n',
      displayDataTypes: false,
      escapeStrings: true,
      theme: 'rjv-default',
    };
    const component = render(<JsonString {...props} />);
    expect(
      required(
        component.container.querySelectorAll<HTMLElement>('.string-value')[0]
      ).textContent
    ).to.equal('"\\\\\\n\\t\\r\\f\\\\n"');
  });
  it('string with special escape sequences is not escaped', function () {
    const props: ValueProps = {
      value: '\\\n\t\r\f\\n',
      displayDataTypes: false,
      escapeStrings: false,
      theme: 'rjv-default',
    };
    const component = render(<JsonString {...props} />);
    expect(
      required(
        component.container.querySelectorAll<HTMLElement>('.string-value')[0]
      ).textContent
    ).to.equal('"' + props.value + '"');
  });
});
