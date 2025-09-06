# Piper Plugin (Alpha - do not use)
The Piper Text to Speech Plugin.

Convert text to speech in Obsidian. A fork of the [Listen Up!](https://github.com/tejas-hosamani/obsidian-plugin-text-to-speech) Plugin


## Getting Started

## Installation and Set up

0. Install this plugin if you haven't already.

1. Install [PiperTTS](https://pypi.org/project/piper-tts/) in the folder that houses this plugin.

2. Download a voice model from [huggingface](https://huggingface.co/rhasspy/piper-voices/tree/main). Not sure which to choose? Try the US English high quality version of [Lessac](https://huggingface.co/rhasspy/piper-voices/tree/main/en/en_US/lessac/high) or listen to the available [voice samples](https://rhasspy.github.io/piper-samples/).

3. Find the file path for the PiperTTS executable, your voice, and your voices json file. Open the plugin settings and paste in the paths.

## Using the Plugin

Open your settings menu and choose the Piper plugin from the menu.

## Developer

npm i -D esbuild-config glob-all

node esbuild.config.mjs
