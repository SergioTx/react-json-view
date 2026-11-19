declare module '*.css' {
  const styles: Readonly<Record<string, string>>;
  export default styles;
}
declare module '*.css?inline' {
  const css: string;
  export default css;
}
