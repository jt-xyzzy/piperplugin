import ReadAloud from "main";
import { App, PluginSettingTab, Setting } from "obsidian";

export interface ReadAloudSettingsTab {
	VOICE_MODEL: string;
	SERVICE: string;
	shouldUseCustomModel: boolean;
}

export const DEFAULT_SETTINGS: ReadAloudSettingsTab = {
	VOICE_MODEL: "",
	SERVICE: "",
	shouldUseCustomModel: true,
};

export class SettingsTab extends PluginSettingTab {
	plugin: ReadAloud;

	constructor(app: App, plugin: ReadAloud) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display() 
	{
		const { containerEl } = this;
		containerEl.empty();
		this.SELECT_SERVICE(containerEl);
		this.SELECT_MODEL(containerEl);
	}



	SELECT_SERVICE(containerEl: HTMLElement) {
		new Setting(containerEl)
			.setName("Select Service")
			.setDesc(`Set piper-tts file path.`)
			.addText((component) => {
				component.setDisabled(true);
				component.setValue(
					this.plugin.settings.SERVICE,
				);
			})
			.addExtraButton((component) => {
				component.setIcon("folder-open");
				component.setTooltip("Select piper executable");
				component.onClick(() => {
					// @ts-ignore
					electron.remote.dialog
						.showOpenDialog({
							properties: ["openFile"],
							title: "Select piper executable",
						})
						.then((result: any) => {
							if (result.canceled) return;

							this.plugin.settings.SERVICE =
								result.filePaths[0];
							this.plugin.saveSettings();
							this.display();
						});
				});
			});
	}
	SELECT_MODEL(containerEl: HTMLElement) {
		new Setting(containerEl)
			.setName("Select Voice Model")
			.setDesc(`Select the ONNX file path of your preferred voice model.`)
			.addText((component) => {
				component.setDisabled(true);
				component.setValue(this.plugin.settings.VOICE_MODEL);
			})
			.addExtraButton((component) => {
				component.setIcon("folder-open");
				component.setTooltip("Select model");

				component.onClick(() => {
					// @ts-ignore
					electron.remote.dialog
						.showOpenDialog({
							properties: ["openFile"],
							title: "Select a model",
						})
						.then((result: any) => {
							if (result.canceled) return;

							this.plugin.settings.VOICE_MODEL =
								result.filePaths[0];
							this.plugin.saveSettings();
							this.display();
						});
				});
			});
	}
}
