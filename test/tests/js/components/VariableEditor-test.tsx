import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import { VariableProps } from '../../../../src/js/types';
import { required } from '../../../testHelpers/requireSources';
import VariableEditor from './../../../../src/js/components/VariableEditor';
describe('<VariableEditor />', function () {
  function getVariable(props: Partial<VariableProps> = {}) {
    return (
      <VariableEditor
        variable={{
          name: 'test',
          value: true,
          type: 'boolean',
        }}
        theme="rjv-default"
        namespace={['root']}
        type="object"
        indentWidth={4}
        singleIndent={5}
        quotesOnKeys
        displayDataTypes
        {...props}
      />
    );
  }
  it('renders a read-only value and its key', function () {
    const wrapper = render(getVariable());
    expect(
      required(
        wrapper.container.querySelectorAll<HTMLElement>('.object-key')[0]
      ).textContent
    ).to.equal('"test"');
    expect(
      required(
        wrapper.container.querySelectorAll<HTMLElement>('.variable-value')[0]
      ).textContent
    ).to.equal('booltrue');
    expect(
      wrapper.container.querySelectorAll<HTMLElement>('textarea')
    ).to.have.length(0);
    fireEvent.click(
      required(
        wrapper.container.querySelectorAll<HTMLElement>('.variable-value')[0]
      )
    );
    expect(
      required(
        wrapper.container.querySelectorAll<HTMLElement>('.variable-value')[0]
      ).textContent
    ).to.equal('booltrue');
    wrapper.unmount();
  });
  it('shows parsed dates as tooltips for Unix timestamps', function () {
    const seconds = render(
      getVariable({
        variable: {
          name: 'timestamp',
          value: 1_700_000_000,
          type: 'integer',
        },
      })
    );
    const secondsValue = required(
      seconds.container.querySelectorAll<HTMLElement>('.variable-value')[0]
    );
    expect(secondsValue.getAttribute('title')).to.equal(
      '2023-11-14T22:13:20.000Z'
    );
    expect(secondsValue.style.cursor).to.equal('help');
    seconds.unmount();

    const milliseconds = render(
      getVariable({
        variable: {
          name: 'timestamp',
          value: 1_700_000_000_000,
          type: 'float',
        },
      })
    );
    expect(
      required(
        milliseconds.container.querySelectorAll<HTMLElement>(
          '.variable-value'
        )[0]
      ).getAttribute('title')
    ).to.equal('2023-11-14T22:13:20.000Z');
    milliseconds.unmount();

    const regularNumber = render(
      getVariable({
        variable: {
          name: 'created_at',
          value: 1_700_000_000_000,
          type: 'float',
        },
      })
    );
    const regularNumberValue = required(
      regularNumber.container.querySelectorAll<HTMLElement>(
        '.variable-value'
      )[0]
    );
    expect(regularNumberValue.getAttribute('title')).to.equal(null);
    expect(regularNumberValue.style.cursor).to.equal('default');
    regularNumber.unmount();
  });
  it('shows a comma between values but not after the last value', function () {
    const _element = getVariable({
      isLast: false,
    });
    const wrapper = render(_element);
    expect(wrapper.container.textContent).to.include(',');
    wrapper.rerender(
      React.cloneElement(_element, {
        isLast: true,
      })
    );
    expect(wrapper.container.textContent).not.to.include(',');
    wrapper.unmount();
  });
  it('shows clipboard controls only while hovered', function () {
    const wrapper = render(
      getVariable({
        enableClipboard: true,
      })
    );
    expect(
      required(
        required(
          wrapper.container.querySelectorAll<HTMLElement>(
            '.copy-to-clipboard-container'
          )[0]
        ).style
      ).display
    ).to.equal('none');
    fireEvent.mouseEnter(
      required(
        wrapper.container.querySelectorAll<HTMLElement>('.variable-row')[0]
      )
    );
    expect(
      required(
        required(
          wrapper.container.querySelectorAll<HTMLElement>(
            '.copy-to-clipboard-container'
          )[0]
        ).style
      ).display
    ).to.equal('inline-block');
    fireEvent.mouseLeave(
      required(
        wrapper.container.querySelectorAll<HTMLElement>('.variable-row')[0]
      )
    );
    expect(
      required(
        required(
          wrapper.container.querySelectorAll<HTMLElement>(
            '.copy-to-clipboard-container'
          )[0]
        ).style
      ).display
    ).to.equal('none');
    wrapper.unmount();
  });
});
