import type { Base16Theme } from 'react-base16-styling';

import { rjvDefault } from './base16/rjv-themes';

type ThemeModule = { default: Base16Theme };

const themeLoaders: Record<string, () => Promise<ThemeModule>> = {
  apathy: () => import('react-base16-styling/src/themes/apathy.js'),
  ashes: () => import('react-base16-styling/src/themes/ashes.js'),
  atelierDune: () => import('react-base16-styling/src/themes/atelier-dune.js'),
  atelierForest: () =>
    import('react-base16-styling/src/themes/atelier-forest.js'),
  atelierHeath: () =>
    import('react-base16-styling/src/themes/atelier-heath.js'),
  atelierLakeside: () =>
    import('react-base16-styling/src/themes/atelier-lakeside.js'),
  atelierSeaside: () =>
    import('react-base16-styling/src/themes/atelier-seaside.js'),
  bespin: () => import('react-base16-styling/src/themes/bespin.js'),
  brewer: () => import('react-base16-styling/src/themes/brewer.js'),
  bright: () => import('react-base16-styling/src/themes/bright.js'),
  chalk: () => import('react-base16-styling/src/themes/chalk.js'),
  codeschool: () => import('react-base16-styling/src/themes/codeschool.js'),
  colors: () => import('react-base16-styling/src/themes/colors.js'),
  default: () => import('react-base16-styling/src/themes/default.js'),
  eighties: () => import('react-base16-styling/src/themes/eighties.js'),
  embers: () => import('react-base16-styling/src/themes/embers.js'),
  flat: () => import('react-base16-styling/src/themes/flat.js'),
  google: () => import('react-base16-styling/src/themes/google.js'),
  grayscale: () => import('react-base16-styling/src/themes/grayscale.js'),
  greenscreen: () => import('react-base16-styling/src/themes/greenscreen.js'),
  harmonic: () => import('react-base16-styling/src/themes/harmonic.js'),
  hopscotch: () => import('react-base16-styling/src/themes/hopscotch.js'),
  isotope: () => import('react-base16-styling/src/themes/isotope.js'),
  marrakesh: () => import('react-base16-styling/src/themes/marrakesh.js'),
  mocha: () => import('react-base16-styling/src/themes/mocha.js'),
  monokai: () => import('react-base16-styling/src/themes/monokai.js'),
  nicinabox: () => import('react-base16-styling/src/themes/nicinabox.js'),
  ocean: () => import('react-base16-styling/src/themes/ocean.js'),
  paraiso: () => import('react-base16-styling/src/themes/paraiso.js'),
  pop: () => import('react-base16-styling/src/themes/pop.js'),
  railscasts: () => import('react-base16-styling/src/themes/railscasts.js'),
  shapeshifter: () => import('react-base16-styling/src/themes/shapeshifter.js'),
  solarized: () => import('react-base16-styling/src/themes/solarized.js'),
  summerfruit: () => import('react-base16-styling/src/themes/summerfruit.js'),
  threezerotwofour: () =>
    import('react-base16-styling/src/themes/threezerotwofour.js'),
  tomorrow: () => import('react-base16-styling/src/themes/tomorrow.js'),
  tube: () => import('react-base16-styling/src/themes/tube.js'),
  twilight: () => import('react-base16-styling/src/themes/twilight.js'),
};

export const themeNames = Object.keys(themeLoaders).flatMap((name) => [
  name,
  `${name}:inverted`,
]);

const themePromises = new Map<string, Promise<Base16Theme>>();

const flip = (value: number) =>
  value < 0.25 ? 1 : value < 0.5 ? 0.9 - value : 1.1 - value;

function invertBase16Theme(theme: Base16Theme): Base16Theme {
  const themeEntries = Object.entries(theme) as [keyof Base16Theme, string][];
  const inverted = Object.fromEntries(
    themeEntries.map(([key, value]) => {
      if (key === 'scheme') {
        return [key, `${value}:inverted`];
      }
      if (!key.startsWith('base')) {
        return [key, value];
      }
      const color = Number.parseInt(value.slice(1), 16);
      const red = (color >> 16) & 0xff;
      const green = (color >> 8) & 0xff;
      const blue = color & 0xff;
      const normalizedRed = red / 255;
      const normalizedGreen = green / 255;
      const normalizedBlue = blue / 255;
      const y =
        normalizedRed * 0.299 +
        normalizedGreen * 0.587 +
        normalizedBlue * 0.114;
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
      return [key, `#${channels.join('')}`];
    })
  );
  return inverted as unknown as Base16Theme;
}

export function loadTheme(themeName: string): Promise<Base16Theme> {
  const cached = themePromises.get(themeName);
  if (cached) {
    return cached;
  }
  const [name, modifier] = themeName.split(':');
  const loader = name ? themeLoaders[name] : undefined;
  const promise = loader
    ? loader().then(({ default: theme }) =>
        modifier === 'inverted' ? invertBase16Theme(theme) : theme
      )
    : Promise.resolve(rjvDefault);
  themePromises.set(themeName, promise);
  return promise;
}
