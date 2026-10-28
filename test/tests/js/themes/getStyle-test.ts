import { expect } from 'chai';
import { base16Themes, invertBase16Theme } from 'react-base16-styling';

import { required } from '../../../testHelpers/requireSources';
import getStyle from './../../../../src/js/themes/getStyle';
import { loadTheme } from './../../../../src/js/themes/loadTheme';
describe('getStyle', function () {
  it('loads every registered base-16 theme', async function () {
    await Promise.all(
      Object.entries(base16Themes).map(async ([name, theme]) => {
        expect(await loadTheme(name)).to.deep.equal(theme);
      })
    );
  });
  it('matches the base-16 inverted theme values', async function () {
    expect(await loadTheme('solarized:inverted')).to.deep.equal(
      invertBase16Theme(base16Themes.solarized)
    );
  });
  it('test that style is returned', function () {
    const style = getStyle('rjv-default', 'app-container');
    expect(required(style.style).cursor).to.equal('default');
  });
  it('test objectKeyVal return', function () {
    const style = getStyle('rjv-default', 'objectKeyVal', {
      paddingLeft: 10,
    });
    expect(required(style.style)).to.not.equal(undefined);
  });
  it('test "none" theme', function () {
    const style = getStyle('none', 'app-container');
    expect(required(style.style)).to.not.equal(undefined);
  });
  it('test theme not set (NOTICE OUTPUT EXPECTED)', function () {
    const style = getStyle(false, 'app-container');
    expect(required(style.style)).to.not.equal(undefined);
  });
});
