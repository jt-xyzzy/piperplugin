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
			name: "Read Aloud",
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
	// Release resources held by the plugin.
	async onunload() {}

	async loadSettings() {
		const data = (await this.loadData()) || {};
		this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
	}

	// Save data to data.json
	async saveSettings() {
		await this.saveData(this.settings);
	}
}
