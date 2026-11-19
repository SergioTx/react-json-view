import { expect } from 'chai';

import { base16Keys } from './../../../../src/js/helpers/util';
import * as themes from './../../../../src/themes';
describe('themes', function () {
  const { invertBase16Theme, ...palettes } = themes;
  it('exports complete Base16 palettes', function () {
    for (const [name, theme] of Object.entries(palettes)) {
      for (const key of base16Keys) {
        expect(theme[key], `${name}.${key}`).to.match(/^#[\da-f]{6}$/i);
      }
    }
  });
  it('matches the base-16 inverted theme values without mutating the palette', function () {
    expect(invertBase16Theme(Object.freeze(palettes.solarized))).to.deep.equal({
      scheme: 'solarized:inverted',
      author: 'ethan schoonover (http://ethanschoonover.com/solarized)',
      base00: '#E0FFFF',
      base01: '#DDFFFF',
      base02: '#6D838A',
      base03: '#60767E',
      base04: '#7D8E90',
      base05: '#728080',
      base06: '#37311E',
      base07: '#2A2310',
      base08: '#F94F4C',
      base09: '#DA5A25',
      base0A: '#C0940C',
      base0B: '#9AAE16',
      base0C: '#178E85',
      base0D: '#2287CD',
      base0E: '#6065B7',
      base0F: '#DD408C',
    });
  });
});
