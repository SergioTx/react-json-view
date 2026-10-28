declare module '*.css' {
  const styles: Readonly<Record<string, string>>;
  export default styles;
}

declare module 'react-base16-styling/src/themes/*.js' {
  import type { Base16Theme } from 'react-base16-styling';

  const theme: Base16Theme;
  export default theme;
}
