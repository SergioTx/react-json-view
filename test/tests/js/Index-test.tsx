import { fireEvent, render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';

import { required } from '../../testHelpers/requireSources';
import Index from './../../../src/js/index';
import ObjectAttributes from './../../../src/js/stores/ObjectAttributes';
import Theme from './../../../src/js/themes/getStyle';
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
  it('moves nested collapse icons left without shifting property names', function () {
    const wrapper = render(
      <Index
        src={{ primitive: 1, nested: { value: 2 } }}
        enableClipboard={false}
      />
    );
    const rows =
      wrapper.container.querySelectorAll<HTMLElement>('.object-key-val');
    const rootRow = required(rows[0]);
    const nestedRow = required(rows[1]);
    const rootIcon = required(
      rootRow.querySelector<HTMLButtonElement>('.object-name-row > button')
    );
    const rootIconContainer = required(
      rootIcon.querySelector<HTMLElement>('.icon-container')
    );
    const rootContent = required(
      rootRow.querySelector<HTMLElement>('.object-content')
    );
    const objectNameRow = required(
      nestedRow.querySelector<HTMLElement>('.object-name-row')
    );
    const nestedIcon = required(
      objectNameRow.querySelector<HTMLButtonElement>('button')
    );
    const rootGuide = required(
      rootRow.querySelector<HTMLElement>('.object-guide')
    );
    const nestedGuide = required(
      nestedRow.querySelector<HTMLElement>('.object-guide')
    );
    expect(rootRow.style.paddingLeft).to.equal('11px');
    expect(rootIcon.style.marginLeft).to.equal('-11px');
    const guideBorderWidth = Number.parseFloat(
      getComputedStyle(nestedRow).borderLeftWidth
    );
    expect(
      Number.parseFloat(rootRow.style.paddingLeft) +
        Number.parseFloat(rootContent.style.marginLeft) +
        guideBorderWidth / 2
    ).to.equal(Number.parseFloat(rootIconContainer.style.width) / 2);
    expect(rootGuide.style.top).to.equal('0px');
    expect(rootGuide.style.bottom).to.equal('0px');
    expect(
      Number.parseFloat(rootGuide.style.left) + guideBorderWidth / 2
    ).to.equal(Number.parseFloat(rootIconContainer.style.width) / 2);
    expect(nestedGuide.style.top).to.equal('3px');
    expect(nestedGuide.style.bottom).to.equal('3px');
    expect(nestedRow.style.paddingLeft).to.equal('20px');
    const nestedIconCenter =
      Number.parseFloat(nestedRow.style.borderLeftWidth) +
      Number.parseFloat(nestedRow.style.paddingLeft) +
      Number.parseFloat(nestedIcon.style.left) +
      Number.parseFloat(rootIconContainer.style.width) / 2;
    expect(
      Number.parseFloat(nestedRow.style.borderLeftWidth) +
        Number.parseFloat(nestedGuide.style.left) +
        guideBorderWidth / 2
    ).to.equal(nestedIconCenter);
    expect(
      Number.parseFloat(nestedRow.style.paddingLeft) +
        Number.parseFloat(nestedRow.style.borderLeftWidth) +
        Number.parseFloat(
          required(nestedRow.querySelector<HTMLElement>('.object-content'))
            .style.marginLeft
        ) +
        guideBorderWidth / 2
    ).to.equal(nestedIconCenter);
    expect(objectNameRow.style.position).to.equal('relative');
    expect(objectNameRow.style.display).to.equal('inline-block');
    expect(nestedIcon.style.position).to.equal('absolute');
    expect(nestedIcon.style.left).to.equal('-17px');
    wrapper.unmount();
  });

  it('loads the selected built-in theme asynchronously', async function () {
    const wrapper = render(
      <Index src={{ value: 1 }} theme="solarized" enableClipboard={false} />
    );
    await waitFor(() => {
      expect(
        wrapper.container.querySelector<HTMLElement>(
          '.object-name-row > button:nth-of-type(2) > span'
        )?.style.color
      ).to.equal('rgb(253, 246, 227)');
    });
    wrapper.unmount();
  });
  it('keeps the active theme visible while loading another theme', async function () {
    const wrapper = render(
      <Index src={{ value: 1 }} theme="solarized" enableClipboard={false} />
    );
    await waitFor(() => {
      expect(
        wrapper.container.querySelector<HTMLElement>('.react-json-view')?.style
          .backgroundColor
      ).to.equal('rgb(0, 43, 54)');
    });
    wrapper.rerender(
      <Index src={{ value: 1 }} theme="twilight" enableClipboard={false} />
    );
    expect(
      wrapper.container.querySelector<HTMLElement>('.react-json-view')?.style
        .backgroundColor
    ).to.equal('rgb(0, 43, 54)');
    await waitFor(() => {
      expect(
        wrapper.container.querySelector<HTMLElement>('.react-json-view')?.style
          .backgroundColor
      ).not.to.equal('rgb(0, 43, 54)');
    });
    wrapper.unmount();
  });

  it('shares a single flash style tag between instances', function () {
    const wrapper = render(
      <>
        <Index src={{ a: 1 }} flashingUpdates />
        <Index src={{ b: 2 }} flashingUpdates />
      </>
    );
    const styles = document.head.querySelectorAll(
      'style[data-href="rjv-flash"]'
    );
    expect(styles).to.have.length(1);
    expect(required(styles[0]).textContent).to.include(
      '@keyframes rjv-flash-a'
    );
    expect(wrapper.container.querySelector('style')).to.equal(null);
    wrapper.unmount();
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
    expect(rootCrumb.style.textDecoration).to.equal('none');
    const objectRow = required(pin?.closest('.object-key-val'));
    expect(required(pin).style.opacity).to.equal('0');
    expect(required(pin).style.verticalAlign).to.equal('top');
    expect(
      required(wrapper.container.querySelector<HTMLElement>('.variable-value'))
        .style.verticalAlign
    ).to.equal('top');
    expect(
      required(wrapper.container.querySelector<HTMLElement>('.object-key'))
        .style.userSelect
    ).to.equal('text');
    fireEvent.mouseEnter(objectRow);
    expect(required(pin).style.opacity).to.equal('1');
    fireEvent.click(required(pin));
    expect(required(pin).tagName).to.equal('BUTTON');
    expect(required(pin).getAttribute('aria-label')).to.include('account');
    expect(required(pin).style.userSelect).to.equal('none');
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
    expect(required(accountCrumbs[0]).style.cursor).to.equal('pointer');
    expect(required(accountCrumbs[0]).style.textDecoration).to.equal(
      'underline'
    );
    expect(required(accountCrumbs[1]).disabled).to.equal(true);
    expect(required(accountCrumbs[1]).style.cursor).to.equal('default');
    expect(required(accountCrumbs[1]).style.textDecoration).to.equal('none');
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
    expect(required(namePin).style.opacity).to.equal('0');
    fireEvent.mouseEnter(nameRow);
    expect(required(namePin).style.opacity).to.equal('1');
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
    expect(required(crumbs[1]).style.cursor).to.equal('pointer');
    expect(required(crumbs[2]).style.cursor).to.equal('default');
    expect(required(crumbs[0]).style.textDecoration).to.equal('underline');
    expect(required(crumbs[1]).style.textDecoration).to.equal('underline');
    expect(required(crumbs[2]).style.textDecoration).to.equal('none');
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
    expect(required(indexPin).style.opacity).to.equal('0');
    fireEvent.mouseEnter(required(indexPin?.closest('.variable-row')));
    expect(required(indexPin).style.opacity).to.equal('1');
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
    expect(required(crumbs[2]).style.textDecoration).to.equal('none');
    const objectKeyColor = document.createElement('span');
    objectKeyColor.style.color = String(
      Theme('rjv-default', 'object-name').style?.color
    );
    const arrayKeyColor = document.createElement('span');
    arrayKeyColor.style.color = String(
      Theme('rjv-default', 'array-key').style?.color
    );
    expect(required(crumbs[0]).style.color).to.equal(
      objectKeyColor.style.color
    );
    expect(required(crumbs[2]).style.color).to.equal(arrayKeyColor.style.color);
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
    expect(arrayPin.style.opacity).to.equal('0');
    fireEvent.mouseEnter(required(arrayPin.closest('.object-key-val')));
    expect(arrayPin.style.opacity).to.equal('1');
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
    expect(required(itemPins[0]).style.opacity).to.equal('0');
    fireEvent.mouseEnter(required(itemPins[0]?.closest('.variable-row')));
    expect(required(itemPins[0]).style.opacity).to.equal('1');
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
        wrapper.container.querySelectorAll<HTMLElement>('.array-group-brace')[0]
      )
    );
    fireEvent.click(
      required(
        wrapper.container.querySelectorAll<HTMLElement>('.array-group-brace')[0]
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
          wrapper.container.querySelectorAll<HTMLElement>('.array-group-brace')
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
