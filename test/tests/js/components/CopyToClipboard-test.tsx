import { fireEvent, render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';

import { required } from '../../../testHelpers/requireSources';
import CopyToClipboard from './../../../../src/js/components/CopyToClipboard';
function copyToClipboard(src: unknown) {
  const copied: string[] = [];
  const { clipboard } = global.navigator;
  Object.defineProperty(global.navigator, 'clipboard', {
    value: {
      writeText: (textToCopy: string) => {
        copied.push(textToCopy);
        return Promise.resolve();
      },
    },
    configurable: true,
  });
  const wrapper = render(
    <CopyToClipboard src={src} namespace={['root']} theme="rjv-default" />
  );
  try {
    fireEvent.click(
      required(
        required(
          wrapper.container.querySelectorAll<HTMLElement>(
            '.copy-to-clipboard-container'
          )[0]
        ).children[0]
      )
    );
  } finally {
    wrapper.unmount();
    Object.defineProperty(global.navigator, 'clipboard', {
      value: clipboard,
      configurable: true,
    });
  }
  return copied;
}
describe('<CopyToClipboard />', function () {
  it('does not announce success when the clipboard write rejects', async function () {
    const { clipboard } = global.navigator;
    Object.defineProperty(global.navigator, 'clipboard', {
      value: { writeText: () => Promise.reject(new Error('Denied')) },
      configurable: true,
    });
    const wrapper = render(<CopyToClipboard src="text" theme="rjv-default" />);
    try {
      fireEvent.click(
        wrapper.getByRole('button', { name: 'Copy to clipboard' })
      );
      await waitFor(() => {
        expect(wrapper.getByRole('status').textContent).to.equal(
          'Could not copy to clipboard.'
        );
      });
    } finally {
      wrapper.unmount();
      Object.defineProperty(global.navigator, 'clipboard', {
        value: clipboard,
        configurable: true,
      });
    }
  });
  it('CopyToClipboard clipboard should exist', function () {
    const wrapper = render(
      <CopyToClipboard
        src={{
          test: true,
        }}
        theme="rjv-default"
        clickCallback
      />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(
        '.copy-to-clipboard-container'
      )
    ).to.have.length(1);
    wrapper.unmount();
  });
  it('keeps the copy button keyboard-focusable', function () {
    const wrapper = render(
      <CopyToClipboard
        src={{
          test: true,
        }}
        theme="rjv-default"
        clickCallback
        rowHovered={false}
      />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(
        '.copy-to-clipboard-container'
      )
    ).to.have.length(1);
    const button = wrapper.getByRole('button', { name: 'Copy to clipboard' });
    button.focus();
    expect(document.activeElement).to.equal(button);
    wrapper.unmount();
  });
  it('CopyToClipboard copies a string without quotes', function () {
    expect(copyToClipboard('a string')).to.deep.equal(['a string']);
  });
  it('CopyToClipboard copies an object as JSON', function () {
    expect(
      copyToClipboard({
        test: true,
      })
    ).to.deep.equal([
      JSON.stringify(
        {
          test: true,
        },
        null,
        '  '
      ),
    ]);
  });
  it('CopyToClipboard copies an array as JSON', function () {
    expect(copyToClipboard(['a string', 1])).to.deep.equal([
      JSON.stringify(['a string', 1], null, '  '),
    ]);
  });
  it('CopyToClipboard copies a number as JSON', function () {
    expect(copyToClipboard(1)).to.deep.equal(['1']);
  });
  it('CopyToClipboard copies a boolean as JSON', function () {
    expect(copyToClipboard(true)).to.deep.equal(['true']);
  });
  it('CopyToClipboard copies null as JSON', function () {
    expect(copyToClipboard(null)).to.deep.equal(['null']);
  });
  it('CopyToClipboard copies a function as source text', function () {
    const noop = function () {};
    expect(copyToClipboard(noop)).to.deep.equal([noop.toString()]);
  });
  it('CopyToClipboard copies a regexp as source text', function () {
    expect(copyToClipboard(/pattern/g)).to.deep.equal(['/pattern/g']);
  });
});
