import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import {
  ArrowDown,
  ArrowRight,
  CircleMinus,
  CirclePlus,
  Clippy,
  SquareMinus,
  SquarePlus,
} from './../../../../src/js/components/icons';
describe('svg icons', function () {
  it('<CircleMinus /> sanity check', function () {
    const wrapper = render(<CircleMinus />);
    expect(
      wrapper.container.querySelectorAll<SVGElement>('svg').length
    ).to.equal(1);
  });
  it('<CirclePlus /> sanity check', function () {
    const wrapper = render(<CirclePlus />);
    expect(
      wrapper.container.querySelectorAll<SVGElement>('svg').length
    ).to.equal(1);
  });
  it('<SquarePlus /> sanity check', function () {
    const wrapper = render(<SquarePlus />);
    expect(
      wrapper.container.querySelectorAll<SVGElement>('svg').length
    ).to.equal(1);
  });
  it('<SquareMinus /> sanity check', function () {
    const wrapper = render(<SquareMinus />);
    expect(
      wrapper.container.querySelectorAll<SVGElement>('svg').length
    ).to.equal(1);
  });
  it('<ArrowDown /> sanity check', function () {
    const wrapper = render(<ArrowDown />);
    expect(
      wrapper.container.querySelectorAll<SVGElement>('svg').length
    ).to.equal(1);
  });
  it('<ArrowRight /> sanity check', function () {
    const wrapper = render(<ArrowRight />);
    expect(
      wrapper.container.querySelectorAll<SVGElement>('svg').length
    ).to.equal(1);
  });
  it('<Clippy /> sanity check', function () {
    const wrapper = render(<Clippy />);
    expect(
      wrapper.container.querySelectorAll<SVGElement>('svg').length
    ).to.equal(1);
  });
  it('icon with color', function () {
    const wrapper = render(
      <Clippy
        style={{
          color: 'green',
        }}
      />
    );
    expect(
      wrapper.container.querySelectorAll<SVGElement>('svg').length
    ).to.equal(1);
  });
});
