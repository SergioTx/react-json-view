import { VariableProps } from '../../../../src/js/types';
import { required } from '../../../testHelpers/requireSources';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
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
  it('shows a comma between values but not after the last value', function () {
    let _element = getVariable({
      isLast: false,
    });
    const wrapper = render(_element);
    expect(wrapper.container.textContent).to.include(',');
    wrapper.rerender(
      (_element = React.cloneElement(_element, {
        isLast: true,
      }))
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
