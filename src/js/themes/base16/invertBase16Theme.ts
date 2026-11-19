import { base16Keys } from '../../helpers/util.js';
import type { Base16Theme } from './rjv-themes.js';

const flip = (value: number) =>
  value < 0.25 ? 1 : value < 0.5 ? 0.9 - value : 1.1 - value;

export function invertBase16Theme(theme: Base16Theme): Base16Theme {
  const inverted = { ...theme, scheme: `${theme.scheme}:inverted` };
  for (const key of base16Keys) {
    const color = Number.parseInt(theme[key].slice(1), 16);
    const red = (color >> 16) & 0xff;
    const green = (color >> 8) & 0xff;
    const blue = color & 0xff;
    const normalizedRed = red / 255;
    const normalizedGreen = green / 255;
    const normalizedBlue = blue / 255;
    const y =
      normalizedRed * 0.299 + normalizedGreen * 0.587 + normalizedBlue * 0.114;
    const u =
      normalizedRed * -0.14713 +
      normalizedGreen * -0.28886 +
      normalizedBlue * 0.436;
    const v =
      normalizedRed * 0.615 +
      normalizedGreen * -0.51499 +
      normalizedBlue * -0.10001;
    const flippedY = flip(y);
    const channels = [
      flippedY + v * 1.13983,
      flippedY + u * -0.39465 + v * -0.5806,
      flippedY + u * 2.02311,
    ]
      .map((channel) =>
        Math.round(Math.min(Math.max(0, channel), 1) * 255)
          .toString(16)
          .padStart(2, '0')
      )
      .map((channel) => channel.toUpperCase());
    inverted[key] = `#${channels.join('')}`;
  }
  return inverted;
}
