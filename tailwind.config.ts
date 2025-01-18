import type { Config } from 'tailwindcss';
import plugin from 'flowbite/plugin';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	plugins: [plugin],
	darkMode: 'selector',

	theme: {
		extend: {
			zIndex: {
				'100': '100'
			},
		}
	}
} as Config;
