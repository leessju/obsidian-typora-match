import { readFileSync, writeFileSync } from 'node:fs';
const license = readFileSync(new URL('./licenses/Open-Sans-Apache-2.0.txt', import.meta.url), 'utf8');
let css = `/* Open Sans: Digitized data copyright 2010-2011 Google Corporation.\n${license}\n*/\n`;
for (const [suffix, weight, style] of [['regular',400,'normal'],['700',700,'normal'],['italic',400,'italic'],['700italic',700,'italic']]) {
  const font = readFileSync(new URL(`./fonts/open-sans-v17-latin-ext_latin-${suffix}.woff2`, import.meta.url)).toString('base64');
  css += `@font-face {font-family:"Typora Open Sans";font-weight:${weight};font-style:${style};src:url(data:font/woff2;base64,${font}) format("woff2");}\n`;
}
css += readFileSync(new URL('./styles.base.css', import.meta.url), 'utf8');
writeFileSync(new URL('./styles.css', import.meta.url), css);
