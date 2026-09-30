const { Plugin, PluginSettingTab, Setting, Notice } = require('obsidian');

module.exports = class TyporaMatchPlugin extends Plugin {
  async onload() {
    this.settings = { openOutlineOnStartup: false, ...(await this.loadData()) };
    document.body.classList.add('typora-match');
    this.register(() => document.body.classList.remove('typora-match'));
    this.addSettingTab(new TyporaMatchSettings(this.app, this));
    this.addCommand({
      id: 'show-right-outline',
      name: 'Show outline on the right',
      callback: () => this.showOutline().catch((error) => this.reportError(error)),
    });
    this.app.workspace.onLayoutReady(() => {
      if (this.settings.openOutlineOnStartup && document.body.classList.contains('typora-match')) {
        this.showOutline().catch((error) => this.reportError(error));
      }
    });
  }

  async showOutline() {
    const workspace = this.app.workspace;
    const leaf = workspace.getLeavesOfType('outline').find(
      (candidate) => candidate.getRoot() === workspace.rightSplit,
    ) || workspace.getRightLeaf(false);
    if (!leaf) throw new Error('Right sidebar is unavailable.');
    await leaf.setViewState({ type: 'outline', active: true });
    await workspace.revealLeaf(leaf);
  }

  reportError(error) {
    console.error('[typora-match]', error);
    new Notice('Could not open the outline. Enable the Outline core plugin and try again.');
  }
};

class TyporaMatchSettings extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    this.containerEl.empty();
    new Setting(this.containerEl)
      .setName('Open outline on startup')
      .setDesc('Reveal the core Outline view in the right sidebar when the plugin loads.')
      .addToggle((toggle) => toggle
        .setValue(this.plugin.settings.openOutlineOnStartup)
        .onChange(async (value) => {
          this.plugin.settings.openOutlineOnStartup = value;
          await this.plugin.saveData(this.plugin.settings);
        }));
  }
}
