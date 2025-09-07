import { Notice, Plugin } from "obsidian";
import { exec } from "child_process";
import { removeAllFormatting } from "utils/removeFormatting";
import { DEFAULT_SETTINGS, SettingsTab } from "Settings";

export default class ListenUp extends Plugin {
	settings: any;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new SettingsTab(this.app, this));

		this.addCommand({
			id: "convert-text-to-speech",
			name: "Convert text to speech",
			editorCallback: async (editor, _) => {
				const notice = new Notice("💬", 0);

				const SERVICE_SETTING = this.settings.SERVICE;

				const VOICE_SETTING = this.settings.VOICE_MODEL;

				const piperCommand = `${SERVICE_SETTING} --model "${VOICE_SETTING}" -s 4 --output-raw | aplay -r 22000 -f S16_LE -t raw -`;

				let textToConvertToAudio = editor.getValue();
				const regExMatch = textToConvertToAudio.match(
					/{{listen}}([\s\S]*?){{\/listen}}/g,
				);

				const userSelection = editor.getSelection();

				if (regExMatch !== null) {
					textToConvertToAudio = regExMatch
						.join(", ")
						// @ts-ignore
						.replaceAll(/{{listen}}|{{\/listen}}/g, "");
					notice.setMessage("💬💬");
				} else if (userSelection.length) {
					textToConvertToAudio = userSelection;
				}
				notice.setMessage("💬💬💬");

				textToConvertToAudio = removeAllFormatting(
					textToConvertToAudio ?? " ",
					{},
					// @ts-ignore
				).replaceAll('"', '\\"');

				exec(
					`echo "${textToConvertToAudio}" | ${piperCommand}`,
					async (error) => {
						if (error) {
							console.error(`\n\nerror: ${error.message}`);
							notice.setMessage("🚫");
							return;
						}

						setTimeout(() => {
							editor.setCursor(editor.lastLine());
							notice.hide();
						}, 200);
					},
				);
			},
		});
	}

	async onunload() {
		// Release any resources configured by the plugin.
	}

	// getRandomNumber(min: number = 10000, max: number = 99999) {
	// 	return Math.floor(Math.random() * (max - min) + min);
	// }

	async loadSettings() {
		const data = (await this.loadData()) || {};
		this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
	}

	/**
	 * Save data to disk, stored in data.json in plugin folder
	 */
	async saveSettings() {
		await this.saveData(this.settings);
	}
}
