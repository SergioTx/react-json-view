import { expect } from 'chai';

import { required } from '../../../testHelpers/requireSources';
import getStyle from './../../../../src/js/themes/getStyle';
describe('getStyle', function () {
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
