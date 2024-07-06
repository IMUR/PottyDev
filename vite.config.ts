import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
	plugins: [svelte()],
	define: {
		'process.env': process.env
	}
});
