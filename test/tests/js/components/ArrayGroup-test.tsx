import { required } from '../../../testHelpers/requireSources';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import ArrayGroup from './../../../../src/js/components/ArrayGroup';
describe('<ArrayGroup />', function () {
  const largeArray = new Array<unknown>(15).fill('test');
  it('ArrayGroup mount', function () {
    const wrapper = render(
      <ArrayGroup
        groupArraysAfterLength={5}
        namespace="test"
        name="test"
        src={largeArray}
        theme="rjv-default"
        jsvRoot={false}
        indentWidth={4}
      />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>('.array-group').length
    ).to.equal(3);
  });
  it('ArrayGroup expands and collapses', function () {
    const wrapper = render(
      <ArrayGroup
        groupArraysAfterLength={5}
        namespace={['test']}
        name="test"
        src={largeArray}
        theme="rjv-default"
        jsvRoot={false}
        indentWidth={4}
      />
    );
    fireEvent.click(
      required(
        wrapper.container.querySelectorAll<HTMLElement>('.array-group-brace')[0]
      )
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(
        '.array-group .object-key-val'
      )
    ).to.have.length(1);
    fireEvent.click(
      required(
        required(
          wrapper.container.querySelectorAll<HTMLElement>('.array-group')[0]
        ).querySelectorAll<HTMLElement>('.icon-container')[0]
      )
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(
        '.array-group .object-key-val'
      )
    ).to.have.length(0);
  });
  it('ArrayGroup displays arrays on expansion', function () {
    const wrapper = render(
      <ArrayGroup
        groupArraysAfterLength={5}
        namespace={['test']}
        name="test"
        src={largeArray}
        theme="rjv-default"
        jsvRoot={false}
        indentWidth={4}
      />
    );
    fireEvent.click(
      required(
        wrapper.container.querySelectorAll<HTMLElement>('.array-group-brace')[0]
      )
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(
        '.array-group .object-key-val'
      ).length
    ).to.equal(1);
    expect(
      required(
        wrapper.container.querySelectorAll<HTMLElement>(
          '.array-group .object-key-val'
        )[0]
      ).querySelectorAll<HTMLElement>('.string-value').length
    ).to.equal(5);
  });
  it('ArrayGroup paginates groups accurately', function () {
    const testArray = new Array<unknown>(17).fill('test');
    const wrapper = render(
      <ArrayGroup
        groupArraysAfterLength={5}
        namespace={['test']}
        name="test"
        src={testArray}
        theme="rjv-default"
        jsvRoot={false}
        indentWidth={4}
      />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>('.array-group').length
    ).to.equal(4);
    fireEvent.click(
      required(
        Array.from(
          wrapper.container.querySelectorAll<HTMLElement>('.array-group-brace')
        ).at(-1)
      )
    );
    expect(
      required(
        Array.from(
          wrapper.container.querySelectorAll<HTMLElement>('.array-group')
        ).at(-1)
      ).querySelectorAll<HTMLElement>('.string-value').length
    ).to.equal(2);
  });
  it('ArrayGroup renders at root', function () {
    const wrapper = render(
      <ArrayGroup
        groupArraysAfterLength={5}
        namespace={['test']}
        name="test"
        src={largeArray}
        theme="rjv-default"
        jsvRoot
        indentWidth={4}
      />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>('.array-group').length
    ).to.equal(3);
  });
  it('ArrayGroup shows object-size ranges for collapsed groups', function () {
    const groupSize = 100;
    const cases = [
      {
        length: 222,
        expected: ['0 - 99', '100 - 199', '200 - 221'],
      },
      {
        length: 199,
        expected: ['0 - 99', '100 - 199'],
      },
      {
        length: 101,
        expected: ['0 - 99', '100 - 100'],
      },
    ];
    cases.forEach(({ length, expected }) => {
      const src = new Array<unknown>(length).fill('test');
      const wrapper = render(
        <ArrayGroup
          groupArraysAfterLength={groupSize}
          namespace={['test']}
          name="test"
          src={src}
          theme="rjv-default"
          jsvRoot={false}
          indentWidth={4}
        />
      );
      const labels =
        wrapper.container.querySelectorAll<HTMLElement>('.object-size');
      expect(labels).to.have.length(expected.length);
      expected.forEach((range, i) => {
        const actual = required(required(labels[i]).textContent)
          .replace(/\s+/g, ' ')
          .trim();
        expect(actual).to.equal(range);
      });
    });
  });
});
