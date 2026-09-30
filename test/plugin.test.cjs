const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');

function fixture(data = null) {
  const classes = new Set();
  const callbacks = [];
  const layout = [];
  const commands = [];
  const calls = [];
  const rightSplit = {};
  const leaves = [];
  const leaf = { getRoot: () => rightSplit, setViewState: async (s) => calls.push(s) };
  class Plugin {
    loadData() { return Promise.resolve(data); }
    register(fn) { callbacks.push(fn); }
    addSettingTab() {}
    addCommand(cmd) { commands.push(cmd); }
  }
  const context = {
    module: { exports: {} }, console,
    document: { body: { classList: {
      add: (v) => classes.add(v), remove: (v) => classes.delete(v), contains: (v) => classes.has(v),
    } } },
    require: () => ({ Plugin, PluginSettingTab: class {}, Setting: class {}, Notice: class {} }),
  };
  vm.runInNewContext(fs.readFileSync(require.resolve('../main.js'), 'utf8'), context);
  const plugin = new context.module.exports();
  plugin.app = { workspace: {
    rightSplit, getLeavesOfType: () => leaves,
    getRightLeaf: () => { calls.push('create'); return leaf; },
    revealLeaf: async (l) => calls.push(l), onLayoutReady: (fn) => layout.push(fn),
  } };
  return { plugin, classes, callbacks, layout, commands, calls, leaves, leaf };
}

test('enabling applies style; disabling removes style and preserves layout', async () => {
  const f = fixture(); await f.plugin.onload();
  assert.ok(f.classes.has('typora-match'));
  f.layout[0](); assert.equal(f.calls.length, 0);
  f.callbacks.forEach((fn) => fn());
  assert.ok(!f.classes.has('typora-match'));
  assert.equal(f.calls.length, 0);
});
test('outline command creates and reveals a right outline without deleting existing tabs', async () => {
  const f = fixture(); await f.plugin.onload();
  f.leaves.push({ getRoot: () => ({}), detach: () => assert.fail('Must preserve existing tabs') });
  await f.commands[0].callback();
  assert.equal(f.calls[0], 'create');
  assert.equal(f.calls[1].type, 'outline');
  assert.equal(f.calls[2], f.leaf);
});
test('reuses existing right outline', async () => {
  const f = fixture(); f.leaves.push(f.leaf); await f.plugin.onload();
  await f.commands[0].callback();
  assert.ok(!f.calls.includes('create'));
  assert.equal(f.calls.at(-1), f.leaf);
});
test('startup outline is opt-in and skips callbacks after unload', async () => {
  const f = fixture({ openOutlineOnStartup: true }); await f.plugin.onload();
  f.callbacks.forEach((fn) => fn()); f.layout[0]();
  assert.equal(f.calls.length, 0);
});
test('opt-in startup reveals outline', async () => {
  const f = fixture({ openOutlineOnStartup: true }); await f.plugin.onload();
  f.layout[0](); await new Promise(setImmediate);
  assert.equal(f.calls.at(-1), f.leaf);
});
test('build embeds all four fonts and license in standard styles.css asset', () => {
  const css = fs.readFileSync(require.resolve('../styles.css'), 'utf8');
  assert.equal((css.match(/@font-face/g) || []).length, 4);
  assert.ok(css.includes('Apache License'));
  assert.ok(css.includes('body.typora-match'));
});
