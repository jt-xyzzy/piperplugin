import ListenUp from "main";
import { App, PluginSettingTab, Setting } from "obsidian";

export interface ListenUpSettingsTab {
	VOICE_MODEL: string;
	SERVICE: string;
	shouldUseCustomModel: boolean;
}

export const DEFAULT_SETTINGS: ListenUpSettingsTab = {
	VOICE_MODEL: "",
	SERVICE: "",
	shouldUseCustomModel: true,
};

export class SettingsTab extends PluginSettingTab {
	plugin: ListenUp;

	constructor(app: App, plugin: ListenUp) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display() 
	{
		const { containerEl } = this;
		containerEl.empty();
		this.addSettingToSelectPiperExecutablePath(containerEl);
		this.addSettingToSelectModelFilePath(containerEl);
	}

	addSettingToSelectModelFilePath(containerEl: HTMLElement) {
		new Setting(containerEl)
			.setName("Select Voice Model")
			.setDesc(`Select the ONNX file for your preferred voice model.`)
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


	// addSettingsToChooseWhetherToUseCustomModelOrDefault(
	// 	containerEl: HTMLElement,
	// ) {
	// 	new Setting(containerEl)
	// 		.setName("Use custom model?")
	// 		.setDesc(`This doesn't do anything.`)
	// 		.addToggle((component) => {
	// 			component.setValue(this.plugin.settings.shouldUseCustomModel);
	// 			component.onChange((value) => {
	// 				this.plugin.settings.shouldUseCustomModel = value;
	// 				this.plugin.saveSettings();
	// 				this.display();
	// 			});
	// 		});
	// }

	addSettingToSelectPiperExecutablePath(containerEl: HTMLElement) {
		new Setting(containerEl)
			.setName("Select Piper executable file")
			.setDesc(`This is required`)
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
}
