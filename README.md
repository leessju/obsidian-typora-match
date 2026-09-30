# Typora Match

An Obsidian desktop plugin that applies typography and reading layout inspired by Typora's GitHub theme. Keep your file explorer on the left and optionally show Obsidian's core Outline on the right.

## Features

- Bundled Open Sans regular, bold, italic and bold italic; 16px body text and matching heading sizes.
- Centered content with responsive maximum widths of 860, 1024 and 1200px.
- Paragraph, list, heading, table and blockquote styling in reading view.
- Outline styling with 14px text and a 30px minimum item height.
- Command: **Typora Match: Show outline on the right**.
- Optional **Open outline on startup** setting, disabled by default.

Styling applies to this vault while the plugin is enabled. Disabling it removes the styles; your sidebar arrangement remains. The plugin does not delete existing sidebar tabs or modify Markdown files. Fonts are bundled and no network requests are made.

## Installation

After approval in the community directory, search for **Typora Match** under Settings → Community plugins.

For manual installation, download `main.js`, `manifest.json` and `styles.css` from the latest GitHub release. Place all three in `<vault>/.obsidian/plugins/typora-match/`, then enable **Typora Match** in Community plugins.

Enable the **Outline** core plugin before using the outline command. Use reading view for the closest result; live preview gets base font and width styling, but its editor layout differs.

## Scope and limitations

Tested on macOS with Obsidian 1.13.7 using the same Markdown document in Typora. The default light theme produces the closest appearance. Different Obsidian themes, other CSS snippets, narrow panes and font fallback for non-Latin text can change rendering. App controls, outline wrapping and Markdown rendering are not pixel-identical. Windows and Linux have not been visually tested; their Helvetica fallback can change the outline font.

This is an independent project, not affiliated with or endorsed by Typora. It does not launch Typora; [Open in Typora](https://github.com/leessju/obsidian-open-in-typora) provides that separate function.

## Development

Node.js 18 or newer. No runtime or build dependencies.

```sh
npm run build
npm run check
npm test
```

`build.mjs` embeds the font assets and their license into `styles.css`, then appends `styles.base.css`. Commit the generated `styles.css` alongside source. Release tags match the manifest version without a `v` prefix.

## Licenses

Plugin code and authored styling: [MIT](LICENSE).

Bundled Open Sans v17 font files: Digitized data copyright © 2010–2011 Google Corporation, licensed under [Apache License 2.0](licenses/Open-Sans-Apache-2.0.txt), as recorded in the fonts' metadata. The complete license is also embedded in `styles.css` for release installs. Newer Open Sans releases may use a different license.

Historical upstream attribution: [Google Fonts Open Sans metadata (Apache 2.0)](https://github.com/google/fonts/blob/beaec0837bd21524b57ecb435158f9011fc03999/apache/opensans/METADATA.pb). Font binaries are unchanged; only their data-URI packaging and CSS family alias are generated.
