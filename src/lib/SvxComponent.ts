import type { Component } from 'svelte';

export default interface SvxComponent_t {
	default: Component;
	metadata: Partial<{
		title: string;
		description: string;
		author: string;
		date: string;
	}>;
}
