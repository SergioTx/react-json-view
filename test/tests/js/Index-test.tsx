import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { renderToString } from 'react-dom/server';
import sinon from 'sinon';

import { required } from '../../testHelpers/requireSources';
import Index from './../../../src/js/index';
import ObjectAttributes from './../../../src/js/stores/ObjectAttributes';
import { solarized, twilight } from './../../../src/themes';
describe('<Index />', function () {
  it('hides the root name, object sizes, and data type labels by default', function () {
    const wrapper = render(
      <Index
        src={{ bool: true, nested: { value: 1 } }}
        enableClipboard={false}
      />
    );
    expect(wrapper.container.textContent).not.to.include('root');
    expect(
      wrapper.container.querySelectorAll<HTMLElement>('.object-size')
    ).to.have.length(0);
    expect(
      wrapper.container.querySelectorAll<HTMLElement>('.data-type-label')
    ).to.have.length(0);
    wrapper.unmount();
  });
  it('renders an empty object when src is omitted or null at runtime', function () {
    const UntypedIndex = Index as unknown as React.ComponentType<{
      src?: object | null;
      enableClipboard?: boolean;
    }>;
    const omitted = render(<UntypedIndex enableClipboard={false} />);
    expect(omitted.container.textContent).to.equal('{}');
    omitted.unmount();

    const nullSource = render(
      <UntypedIndex src={null} enableClipboard={false} />
    );
    expect(nullSource.container.textContent).to.equal('{}');
    nullSource.unmount();
  });
  it('updates the shared indentation without adding row styles', function () {
    const wrapper = render(
      <Index
        src={{ primitive: 1, nested: { value: 2 } }}
        enableClipboard={false}
      />
    );
    const viewer = required(
      wrapper.container.querySelector<HTMLElement>('.react-json-view')
    );
    expect(viewer.style.getPropertyValue('--rjv-indent')).to.equal('20px');
    wrapper.rerender(
      <Index src={{ primitive: 1, nested: { value: 2 } }} indentWidth={2} />
    );
    expect(viewer.style.getPropertyValue('--rjv-indent')).to.equal('10px');
    expect(viewer.querySelector('[style]')).to.equal(null);
    wrapper.unmount();
  });
  it('hides vertical guides only when requested', function () {
    const src = { value: 1, nested: { child: 2 }, items: [1, 2, 3] };
    const wrapper = render(
      <Index src={src} groupArraysAfterLength={2} enableClipboard={false} />
    );
    expect(wrapper.container.querySelector('.object-guide')).not.to.equal(null);
    const rows = wrapper.container.querySelectorAll<HTMLElement>(
      '.object-key-val, .variable-row'
    );
    expect(
      Array.from(rows).every(
        (row) => getComputedStyle(row).borderLeftStyle === 'none'
      )
    ).to.equal(true);
    wrapper.rerender(
      <Index
        src={src}
        groupArraysAfterLength={2}
        hideVerticalLines
        enableClipboard={false}
      />
    );
    expect(wrapper.container.querySelector('.object-guide')).to.equal(null);
    expect(
      Array.from(rows).every(
        (row) => getComputedStyle(row).borderLeftStyle === 'none'
      )
    ).to.equal(true);
    wrapper.unmount();
  });

  it('merges partial themes with the default palette', function () {
    const src = { value: 'sample' };
    const theme = Object.freeze({ base09: '#123456' });
    const wrapper = render(<Index src={src} theme={theme} />);
    const app = required(
      wrapper.container.querySelector<HTMLElement>('.react-json-view')
    );
    expect(app.style.getPropertyValue('--rjv-base00')).to.equal('#1e1f21');
    expect(app.style.getPropertyValue('--rjv-base09')).to.equal('#123456');

    wrapper.rerender(
      <Index src={src} theme={{ base00: '#ffffff', base09: undefined }} />
    );
    expect(app.style.getPropertyValue('--rjv-base00')).to.equal('#ffffff');
    expect(app.style.getPropertyValue('--rjv-base09')).to.equal('#ff9940');

    wrapper.rerender(<Index src={src} theme={{}} />);
    expect(app.style.getPropertyValue('--rjv-base00')).to.equal('#1e1f21');
    expect(app.style.getPropertyValue('--rjv-base09')).to.equal('#ff9940');
    wrapper.unmount();
  });

  it('reports an invalid partial theme and falls back to the default palette', function () {
    // oxlint-disable-next-line eslint/no-console -- Check the public invalid-theme diagnostic.
    const error = sinon.stub(console, 'error');
    try {
      const wrapper = render(
        <Index
          src={{}}
          // @ts-expect-error -- A provided Base16 color must be a string.
          theme={{ base00: '#ffffff', base09: 123 }}
        />
      );
      expect(error.calledOnce).to.equal(true);
      expect(error.firstCall.args[1]).to.include('valid base-16 theme object');
      expect(
        wrapper.container
          .querySelector<HTMLElement>('.react-json-view')
          ?.style.getPropertyValue('--rjv-base00')
      ).to.equal('#1e1f21');
      wrapper.unmount();
    } finally {
      error.restore();
    }
  });

  it('shows all disclosures in full without collapse controls', function () {
    const fn = () => 'function result';
    const shouldCollapse = sinon.stub().returns(true);
    const src = {
      nested: { child: true },
      ungrouped: [42],
      grouped: ['zero', 'one', 'two', 'three'],
      fn,
    };
    const wrapper = render(
      <Index
        src={src}
        enableCollapse={false}
        shouldCollapse={shouldCollapse}
        groupArraysAfterLength={2}
        collapseStringsAfterLength={1}
        enableClipboard={false}
      />
    );
    expect(shouldCollapse.called).to.equal(false);
    expect(wrapper.queryByText('child')).not.to.equal(null);
    expect(wrapper.queryByText('42')).not.to.equal(null);
    expect(wrapper.queryByText('"zero"')).not.to.equal(null);
    expect(wrapper.queryByText('"three"')).not.to.equal(null);
    expect(
      wrapper.container.querySelector('.rjv-function-container')?.textContent
    ).to.equal(String(fn));
    expect(wrapper.container.querySelectorAll('.array-group')).to.have.length(
      2
    );
    expect(wrapper.queryAllByRole('button')).to.have.length(0);
    wrapper.unmount();
  });

  it('keeps collapse state when temporarily disabling disclosure', function () {
    const src = { nested: { child: true }, value: 'text value' };
    const wrapper = render(
      <Index src={src} collapseStringsAfterLength={2} enableClipboard={false} />
    );
    fireEvent.click(
      required(wrapper.getAllByRole('button', { name: 'Collapse nested' })[0])
    );
    fireEvent.click(wrapper.getByRole('button', { name: 'Expand string' }));
    wrapper.rerender(
      <Index
        src={src}
        collapseStringsAfterLength={2}
        enableClipboard={false}
        enableCollapse={false}
        collapsed
      />
    );
    expect(wrapper.queryByText('child')).not.to.equal(null);
    expect(wrapper.queryByText('"text value"')).not.to.equal(null);
    expect(wrapper.queryAllByRole('button')).to.have.length(0);
    wrapper.rerender(
      <Index src={src} collapseStringsAfterLength={2} enableClipboard={false} />
    );
    expect(wrapper.queryByText('child')).to.equal(null);
    expect(
      wrapper.queryByRole('button', { name: 'Collapse string' })
    ).not.to.equal(null);
    wrapper.unmount();
  });

  it('keeps path navigation and clipboard controls when collapse is disabled', function () {
    const wrapper = render(
      <Index
        src={{ items: ['zero', 'one', 'two'] }}
        enableCollapse={false}
        enablePathNavigation
        groupArraysAfterLength={2}
        collapseStringsAfterLength={1}
      />
    );
    const row = required(wrapper.getByText('"two"').closest('.variable-row'));
    fireEvent.mouseEnter(row);
    fireEvent.click(required(row.querySelector('.path-navigation-button')));
    expect(
      wrapper.container.querySelector('.path-breadcrumb')?.textContent
    ).to.equal('root > items > 2');
    expect(wrapper.queryByText('"two"')).not.to.equal(null);
    expect(wrapper.queryByText('"zero"')).to.equal(null);
    expect(
      wrapper.container.querySelector('.copy-to-clipboard-container')
    ).not.to.equal(null);
    expect(
      wrapper.queryByRole('button', { name: /expand|collapse/i })
    ).to.equal(null);
    wrapper.unmount();
  });

  it('applies an imported palette immediately', function () {
    const wrapper = render(
      <Index src={{ value: 1 }} theme={solarized} enableClipboard={false} />
    );
    expect(
      wrapper.container
        .querySelector<HTMLElement>('.react-json-view')
        ?.style.getPropertyValue('--rjv-base07')
    ).to.equal(solarized.base07);
    wrapper.unmount();
  });
  it('updates the viewer immediately when an imported palette changes', function () {
    const wrapper = render(
      <Index src={{ value: 1 }} theme={solarized} enableClipboard={false} />
    );
    const viewer = required(
      wrapper.container.querySelector<HTMLElement>('.react-json-view')
    );
    expect(viewer.style.getPropertyValue('--rjv-base00')).to.equal(
      solarized.base00
    );
    wrapper.rerender(
      <Index src={{ value: 1 }} theme={twilight} enableClipboard={false} />
    );
    expect(viewer.style.getPropertyValue('--rjv-base00')).to.equal(
      twilight.base00
    );
    wrapper.unmount();
  });
  it('reports a legacy string theme and falls back to the default', function () {
    // oxlint-disable-next-line eslint/no-console -- Check the public invalid-theme diagnostic.
    const error = sinon.stub(console, 'error');
    try {
      // @ts-expect-error -- Theme names are no longer accepted.
      const wrapper = render(<Index src={{}} theme="solarized" />);
      expect(error.calledOnce).to.equal(true);
      expect(error.firstCall.args[1]).to.include('valid base-16 theme object');
      expect(
        wrapper.container
          .querySelector<HTMLElement>('.react-json-view')
          ?.style.getPropertyValue('--rjv-base00')
      ).to.equal('#1e1f21');
      wrapper.unmount();
    } finally {
      error.restore();
    }
  });

  it('automatically shares one stylesheet across independent viewer roots', function () {
    const first = render(<Index src={{ a: 1 }} theme={solarized} />);
    const second = render(
      <Index
        src={{ b: 2 }}
        theme={twilight}
        flashingUpdates
        style={{ padding: 3 }}
      />
    );
    const styles = document.head.querySelectorAll(
      'style[data-href="react-json-view"]'
    );
    expect(styles).to.have.length(1);
    expect(required(styles[0]).textContent).to.include(
      '@layer react-json-view'
    );
    expect(first.container.querySelector('style')).to.equal(null);
    expect(second.container.querySelector('style')).to.equal(null);
    const viewers = [first, second].map(({ container }) =>
      required(container.querySelector<HTMLElement>('.react-json-view'))
    );
    expect(
      viewers.map((viewer) => viewer.style.getPropertyValue('--rjv-base00'))
    ).to.deep.equal([solarized.base00, twilight.base00]);
    expect(required(viewers[1]).style.padding).to.equal('3px');
    first.unmount();
    expect(document.head.contains(required(styles[0]))).to.equal(true);
    second.unmount();
  });
  it('includes the stylesheet once when rendering multiple viewers on the server', function () {
    const html = renderToString(
      <>
        <Index src={{ a: 1 }} />
        <Index src={{ b: 2 }} />
      </>
    );
    expect(html.match(/data-href="react-json-view"/g)).to.have.length(1);
    expect(html).to.include('@layer react-json-view');
  });
  it('flashes changed values when flashingUpdates is enabled', function () {
    const wrapper = render(
      <Index
        src={{ a: 1, b: 'same' }}
        flashingUpdates
        enableClipboard={false}
      />
    );
    const values = () =>
      Array.from(
        wrapper.container.querySelectorAll<HTMLElement>('.variable-value')
      );
    expect(values().map((value) => value.className)).to.deep.equal([
      'variable-value',
      'variable-value',
    ]);
    wrapper.rerender(
      <Index
        src={{ a: 2, b: 'same' }}
        flashingUpdates
        enableClipboard={false}
      />
    );
    expect(values().map((value) => value.className)).to.deep.equal([
      'variable-value rjv-flash-a',
      'variable-value',
    ]);
    wrapper.rerender(
      <Index
        src={{ a: 3, b: 'same' }}
        flashingUpdates
        enableClipboard={false}
      />
    );
    expect(required(values()[0]).className).to.equal(
      'variable-value rjv-flash-b'
    );
    wrapper.rerender(
      <Index
        src={{ a: 3, b: 'same' }}
        flashingUpdates
        enableClipboard={false}
      />
    );
    expect(required(values()[0]).className).to.equal(
      'variable-value rjv-flash-b'
    );
    wrapper.unmount();
  });
  it('flashes added properties and size changes when properties come and go', function () {
    const wrapper = render(
      <Index
        src={{ a: 1, list: [1] }}
        flashingUpdates
        displayObjectSize
        enableClipboard={false}
      />
    );
    const sizes = () =>
      Array.from(
        wrapper.container.querySelectorAll<HTMLElement>('.object-size')
      ).map((size) => size.className);
    expect(sizes()).to.deep.equal(['object-size', 'object-size']);
    wrapper.rerender(
      <Index
        src={{ a: 1, b: 2, nested: { c: 3 }, list: [1, 2] }}
        flashingUpdates
        displayObjectSize
        enableClipboard={false}
      />
    );
    const rows = Array.from(
      wrapper.container.querySelectorAll<HTMLElement>('.variable-row')
    );
    expect(
      rows.map(
        (row) => required(row.querySelector('.variable-value')).className
      )
    ).to.deep.equal([
      'variable-value',
      'variable-value rjv-flash-a',
      'variable-value',
      'variable-value',
      'variable-value rjv-flash-a',
    ]);
    const nested = required(
      wrapper.container.querySelectorAll<HTMLElement>('.object-key-val')[1]
    );
    expect(nested.className).to.equal('object-key-val rjv-flash-a');
    expect(sizes()).to.deep.equal([
      'object-size',
      'object-size rjv-flash-a',
      'object-size rjv-flash-a',
    ]);
    wrapper.rerender(
      <Index
        src={{ a: 1, list: [1] }}
        flashingUpdates
        displayObjectSize
        enableClipboard={false}
      />
    );
    expect(wrapper.container.textContent).not.to.include('nested');
    expect(sizes()).to.deep.equal([
      'object-size rjv-flash-b',
      'object-size rjv-flash-b',
    ]);
    wrapper.unmount();
  });
  it('does not flash changed values by default', function () {
    const wrapper = render(<Index src={{ a: 1 }} enableClipboard={false} />);
    wrapper.rerender(<Index src={{ a: 2 }} enableClipboard={false} />);
    expect(wrapper.container.querySelector('style')).to.equal(null);
    expect(
      required(wrapper.container.querySelector<HTMLElement>('.variable-value'))
        .className
    ).to.equal('variable-value');
    wrapper.unmount();
  });
  it('navigates property paths and keeps breadcrumbs when the source changes', function () {
    const wrapper = render(
      <Index
        src={{ account: { name: 'Ada', details: { active: true } }, other: 1 }}
        enablePathNavigation
        enableClipboard={false}
        displayDataTypes
      />
    );
    const pin = wrapper.container.querySelector<HTMLButtonElement>(
      '.path-navigation-button'
    );
    expect(
      wrapper.container.querySelector('.path-breadcrumb')?.textContent
    ).to.equal('root');
    const rootCrumb = required(
      wrapper.container.querySelector<HTMLButtonElement>(
        '.path-breadcrumb-segment'
      )
    );
    expect(rootCrumb.disabled).to.equal(true);
    const objectRow = required(pin?.closest('.object-key-val'));
    expect(required(pin).style.opacity).to.equal('');
    fireEvent.mouseEnter(objectRow);
    expect(required(pin).style.opacity).to.equal('');
    fireEvent.click(required(pin));
    expect(required(pin).tagName).to.equal('BUTTON');
    expect(required(pin).getAttribute('aria-label')).to.include('account');
    expect(required(pin).parentElement?.closest('button')).to.equal(null);
    expect(
      required(pin?.previousElementSibling?.querySelector('.object-key'))
        .textContent
    ).to.include('account');
    expect(pin?.nextElementSibling?.textContent).to.equal(':');
    expect(
      wrapper.container.querySelector('.path-breadcrumb')?.textContent
    ).to.equal('root > account');
    const accountCrumbs = wrapper.container.querySelectorAll<HTMLButtonElement>(
      '.path-breadcrumb-segment'
    );
    expect(required(accountCrumbs[0]).disabled).to.equal(false);
    expect(required(accountCrumbs[1]).disabled).to.equal(true);
    expect(wrapper.container.textContent).to.include('name');
    expect(wrapper.container.textContent).not.to.include('other');

    const namePin = wrapper.container.querySelector<HTMLButtonElement>(
      '.variable-row .path-navigation-button'
    );
    expect(
      namePin?.previousElementSibling?.classList.contains('object-key')
    ).to.equal(true);
    expect(namePin?.nextElementSibling?.textContent).to.equal(':');
    const nameRow = required(namePin?.closest('.variable-row'));
    expect(required(namePin).style.opacity).to.equal('');
    fireEvent.mouseEnter(nameRow);
    expect(required(namePin).style.opacity).to.equal('');
    fireEvent.click(required(namePin));
    expect(
      wrapper.container.querySelector('.path-breadcrumb')?.textContent
    ).to.equal('root > account > name');
    expect(wrapper.container.textContent).to.include('string"Ada"');

    wrapper.rerender(
      <Index
        src={{ account: { details: { active: false } }, other: 2 }}
        enablePathNavigation
        enableClipboard={false}
      />
    );
    const crumbs = wrapper.container.querySelectorAll<HTMLButtonElement>(
      '.path-breadcrumb-segment'
    );
    expect(crumbs).to.have.length(3);
    expect(required(crumbs[0]).disabled).to.equal(false);
    expect(required(crumbs[1]).disabled).to.equal(false);
    expect(required(crumbs[2]).disabled).to.equal(true);
    expect(wrapper.container.textContent).to.include('undefined');
    fireEvent.click(required(crumbs[0]));
    expect(
      wrapper.container.querySelector('.path-breadcrumb')?.textContent
    ).to.equal('root');
    expect(wrapper.container.textContent).to.include('other');
    wrapper.rerender(
      <Index
        src={{ account: { details: { active: false } }, other: 2 }}
        enableClipboard={false}
      />
    );
    expect(wrapper.container.querySelector('.path-breadcrumb')).to.equal(null);
    expect(wrapper.container.textContent).to.include('other');
    wrapper.unmount();
  });
  it('uses root as the breadcrumb label when the name is omitted', function () {
    const wrapper = render(<Index src={{ value: 1 }} enablePathNavigation />);
    expect(
      wrapper.container.querySelector('.path-breadcrumb')?.textContent
    ).to.equal('root');
    wrapper.unmount();
  });
  it('shows array indexes in breadcrumbs and keeps navigation disabled by default', function () {
    const wrapper = render(
      <Index src={{ list: ['first', 'second'] }} enableClipboard={false} />
    );
    expect(
      wrapper.container.querySelectorAll('.path-navigation-button')
    ).to.have.length(0);
    wrapper.rerender(
      <Index
        src={{ list: ['first', 'second'] }}
        name="payload"
        enablePathNavigation
        enableClipboard={false}
      />
    );
    const pin = wrapper.container.querySelector<HTMLButtonElement>(
      '.path-navigation-button'
    );
    fireEvent.mouseEnter(required(pin?.closest('.object-key-val')));
    fireEvent.click(required(pin));
    const indexPin = wrapper.container.querySelector<HTMLButtonElement>(
      '.variable-row .path-navigation-button'
    );
    expect(indexPin?.nextElementSibling?.textContent).to.equal(':');
    expect(required(indexPin).style.opacity).to.equal('');
    fireEvent.mouseEnter(required(indexPin?.closest('.variable-row')));
    expect(required(indexPin).style.opacity).to.equal('');
    fireEvent.click(required(indexPin));
    expect(
      wrapper.container.querySelector('.path-breadcrumb')?.textContent
    ).to.equal('payload > list > 0');
    const crumbs = wrapper.container.querySelectorAll<HTMLButtonElement>(
      '.path-breadcrumb-segment'
    );
    expect(crumbs).to.have.length(3);
    expect(required(crumbs[0]).textContent).to.equal('payload');
    expect(required(crumbs[2]).disabled).to.equal(true);
    expect(required(crumbs[0]).classList.contains('rjv-object-name')).to.equal(
      true
    );
    expect(required(crumbs[2]).classList.contains('rjv-array-key')).to.equal(
      true
    );
    wrapper.unmount();
  });
  it('navigates to the correct index inside a grouped array', function () {
    const wrapper = render(
      <Index
        src={{ items: ['zero', 'one', 'two', 'three'] }}
        enablePathNavigation
        enableClipboard={false}
        groupArraysAfterLength={2}
        displayDataTypes
      />
    );
    const arrayPin = required(
      wrapper.container.querySelector<HTMLButtonElement>(
        '.path-navigation-button'
      )
    );
    expect(arrayPin.style.opacity).to.equal('');
    fireEvent.mouseEnter(required(arrayPin.closest('.object-key-val')));
    expect(arrayPin.style.opacity).to.equal('');
    fireEvent.click(arrayPin);
    fireEvent.click(
      required(
        wrapper.container.querySelectorAll<HTMLButtonElement>(
          '.array-group .icon-container'
        )[1]
      )
    );
    const itemPins = wrapper.container.querySelectorAll<HTMLButtonElement>(
      '.variable-row .path-navigation-button'
    );
    expect(itemPins).to.have.length(2);
    expect(required(itemPins[0]).style.opacity).to.equal('');
    fireEvent.mouseEnter(required(itemPins[0]?.closest('.variable-row')));
    expect(required(itemPins[0]).style.opacity).to.equal('');
    fireEvent.click(required(itemPins[0]));
    expect(
      wrapper.container.querySelector('.path-breadcrumb')?.textContent
    ).to.equal('root > items > 2');
    expect(wrapper.container.textContent).to.include('string"two"');
    expect(wrapper.container.textContent).not.to.include('zero');
    wrapper.unmount();
  });
  it('supports expansion and source updates in Strict Mode', function () {
    const wrapper = render(
      <React.StrictMode>
        <Index
          src={{
            value: 1,
          }}
          enableClipboard={false}
          displayDataTypes
        />
      </React.StrictMode>
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>('.variable-row')
    ).to.have.length(1);
    fireEvent.click(
      required(wrapper.container.querySelector<HTMLElement>('.icon-container'))
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>('.variable-row')
    ).to.have.length(0);
    fireEvent.click(
      required(wrapper.container.querySelector<HTMLElement>('.icon-container'))
    );
    wrapper.rerender(
      <React.StrictMode>
        <Index
          src={{
            value: 2,
            other: true,
          }}
          enableClipboard={false}
          displayDataTypes
        />
      </React.StrictMode>
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>('.variable-row')
    ).to.have.length(2);
    expect(wrapper.container.textContent).to.include('int2');
    wrapper.unmount();
  });
  it('keeps expansion state when its parent is collapsed and expanded', function () {
    const wrapper = render(
      <Index
        src={{
          nested: {
            value: 1,
          },
        }}
        enableClipboard={false}
      />
    );
    fireEvent.click(
      required(
        wrapper.container.querySelectorAll<HTMLElement>('.icon-container')[1]
      )
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>('.variable-row')
    ).to.have.length(0);
    fireEvent.click(
      required(
        wrapper.container.querySelectorAll<HTMLElement>('.icon-container')[0]
      )
    );
    fireEvent.click(
      required(
        wrapper.container.querySelectorAll<HTMLElement>('.icon-container')[0]
      )
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>('.node-ellipsis')
    ).to.have.length(1);
    expect(
      wrapper.container.querySelectorAll<HTMLElement>('.variable-row')
    ).to.have.length(0);
    fireEvent.click(
      required(
        wrapper.container.querySelectorAll<HTMLElement>('.icon-container')[1]
      )
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>('.variable-row')
    ).to.have.length(1);
    wrapper.unmount();
  });
  it('recomputes ancestors when the source changes', function () {
    const previous = {
      value: 1,
    };
    const next: Record<string, unknown> = {
      previous,
    };
    next.self = next;
    const _element = (
      <Index src={previous} enableClipboard={false} displayDataTypes />
    );
    const wrapper = render(_element);
    wrapper.rerender(
      React.cloneElement(_element, {
        src: next,
      })
    );
    expect(
      required(wrapper.container.textContent).split('[CIRCULAR REFERENCE]')
    ).to.have.length(2);
    expect(
      required(
        wrapper.container.querySelectorAll<HTMLElement>('.variable-value')[0]
      ).textContent
    ).to.equal('int1');
    wrapper.unmount();
  });
  it('shows commas between nested array and object values without trailing commas', function () {
    const wrapper = render(
      <Index
        src={[
          1,
          {
            value: 2,
          },
          [3, 4],
        ]}
        quotesOnKeys={false}
        displayArrayKey={false}
        displayObjectSize={false}
        displayDataTypes={false}
        enableClipboard={false}
      />
    );
    expect(wrapper.container.textContent).to.equal('[1,{value:2},[3,4]]');
  });
  it('shows commas between collapsed and expanded array groups', function () {
    const wrapper = render(
      <Index
        src={[1, 2, 3, 4]}
        groupArraysAfterLength={2}
        displayArrayKey={false}
        displayObjectSize={false}
        displayDataTypes={false}
        enableClipboard={false}
      />
    );
    expect(wrapper.container.textContent).to.equal('[0 - 1],[2 - 3]');
    fireEvent.click(
      required(
        wrapper.container.querySelectorAll<HTMLElement>(
          '.array-group .icon-container'
        )[0]
      )
    );
    fireEvent.click(
      required(
        wrapper.container.querySelectorAll<HTMLElement>(
          '.array-group .icon-container'
        )[1]
      )
    );
    expect(wrapper.container.textContent).to.equal('[1,2],[3,4]');
    wrapper.unmount();
  });
  it('detects circular arrays inside expanded groups', function () {
    const src: unknown[] = [1, 2];
    src.push(src);
    const wrapper = render(
      <Index src={src} groupArraysAfterLength={2} enableClipboard={false} />
    );
    fireEvent.click(
      required(
        Array.from(
          wrapper.container.querySelectorAll<HTMLElement>(
            '.array-group .icon-container'
          )
        ).at(-1)
      )
    );
    expect(wrapper.container.textContent).to.include('[CIRCULAR REFERENCE]');
    wrapper.unmount();
  });
  it('clears saved display attributes on unmount', function () {
    const setAttribute = sinon.spy(ObjectAttributes, 'set');
    try {
      const wrapper = render(
        <Index
          src={{
            value: 1,
          }}
          enableClipboard={false}
        />
      );
      fireEvent.click(
        required(
          wrapper.container.querySelectorAll<HTMLElement>('.icon-container')[0]
        )
      );
      const rjvId = required(setAttribute.firstCall).args[0];
      const namespace = required(setAttribute.firstCall).args[1];
      expect(ObjectAttributes.get(rjvId, namespace, 'expanded')).to.equal(
        false
      );
      wrapper.unmount();
      expect(ObjectAttributes.get(rjvId, namespace, 'expanded')).to.equal(
        undefined
      );
    } finally {
      setAttribute.restore();
    }
  });
  it('check data type labels from index', function () {
    const wrapper = render(
      <Index
        src={{
          bool: true,
          str: 'test',
          int: 5,
          nan: NaN,
          null: null,
          func: () => {},
          obj: {
            arrChild: [1, 2, 'three'],
            objChild: {
              one: 1,
              two: 'two',
            },
          },
          arr: [
            [1, 'two'],
            {
              one: 'one',
              two: 2,
            },
          ],
          regexp: /[0-9]/gi,
        }}
        displayDataTypes
      />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>('.data-type-label')
    ).to.have.length(14);
    expect(
      wrapper.container.querySelectorAll<HTMLElement>('.data-type-label')
    ).to.have.length(14);
  });
  it('check object-size labels from index', function () {
    const _element2 = (
      <Index
        src={{
          bool: true,
          str: 'test',
          int: 5,
          nan: NaN,
          null: null,
          func: () => {},
          obj: {
            arrChild: [1, 2, 'three'],
            objChild: {
              one: 1,
              two: 'two',
            },
          },
          arr: [
            [1, 'two'],
            {
              one: 'one',
              two: 2,
            },
          ],
          regexp: /[0-9]/gi,
        }}
        displayObjectSize
        displayDataTypes
        enableClipboard={false}
      />
    );
    const wrapper = render(_element2);
    expect(
      wrapper.container.querySelectorAll<HTMLElement>('.object-size')
    ).to.have.length(7);
    wrapper.rerender(
      React.cloneElement(_element2, {
        displayObjectSize: false,
      })
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>('.object-size')
    ).to.have.length(0);
  });
  it('src replaced with error message (ERROR OUTPUT EXPECTED)', function () {
    const wrapper = render(
      <Index
        src={'{jsonEncodedString:true, createError:true}' as unknown as object}
        displayDataTypes
      />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>('.data-type-label')
    ).to.have.length(1);
  });
  it('make sure copy to clipboard is displayed all properties', function () {
    const wrapper = render(
      <Index
        src={{
          test: true,
          passing: 'hopefully',
          arr: [5],
          obj: {},
          regexp: /[0-9]/gi,
        }}
      />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>(
        '.copy-to-clipboard-container'
      )
    ).to.have.length(7);
  });
  it('renders updated source props', function () {
    const _element3 = (
      <Index
        src={{
          test: true,
        }}
        displayDataTypes
      />
    );
    const wrapper = render(_element3);
    expect(
      wrapper.container.querySelectorAll<HTMLElement>('.data-type-label')
    ).to.have.length(1);
    wrapper.rerender(
      React.cloneElement(_element3, {
        src: {
          test1: true,
          test2: false,
        },
      })
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>('.data-type-label')
    ).to.have.length(2);
    wrapper.unmount();
  });
  it('index can have ArrayGroup root component', function () {
    const wrapper = render(
      <Index
        name="test"
        groupArraysAfterLength={5}
        src={Array.from({ length: 15 }).fill(0)}
      />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>('.array-group')
    ).to.have.length(3);
  });
  it('length is correct even if an object has a length property', function () {
    const wrapper = render(
      <Index
        src={{
          first: 'first property',
          second: 'second property',
          length: 1000,
        }}
        displayObjectSize
      />
    );
    expect(
      wrapper.container.querySelectorAll<HTMLElement>('.object-size')
    ).to.have.length(1);
  });
  it('should show commas between elements', function () {
    const wrapper = render(
      <Index
        src={{
          first: 'first property',
          second: 'second property',
          third: 'third property',
        }}
      />
    );
    // Check that commas are present in the rendered output
    expect(wrapper.container.textContent).to.include(',');
  });
  it('should default to showing commas between elements', function () {
    const wrapper = render(
      <Index
        src={{
          first: 'first property',
          second: 'second property',
          third: 'third property',
        }}
      />
    );
    // Check that commas are present by default
    expect(wrapper.container.textContent).to.include(',');
  });
});
