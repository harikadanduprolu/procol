declare module 'dotenv' {
  export function config(options?: { path?: string; encoding?: string }): { parsed: { [key: string]: string } };
  export function parse(src: string): { [key: string]: string };
  export default { config, parse };
} 