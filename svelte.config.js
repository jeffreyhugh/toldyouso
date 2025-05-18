import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';

const config = {
	preprocess: [
		vitePreprocess(),
		mdsvex({
			remarkPlugins: [remarkGfm],
			rehypePlugins: [
				// https://lukenguyen.me/blog/open-new-tab-link-mdx-astro/
				() => {
					return (tree) => {
						visit(tree, 'element', (node) => {
							if (
								node.tagName === 'a' &&
								node.properties?.href &&
								node.properties.href.toString().startsWith('http')
							) {
								node.properties['target'] = '_blank';
							}
						});
					};
				},
				rehypeSlug,
				[
					rehypeAutolinkHeadings,
					{
						behavior: 'append',
						content: {
							type: 'element',
							tagName: 'span',
							properties: {
								className: 'link-icon text-base',
								style: 'text-decoration-line:none;'
							},
							children: [
								{
									type: 'text',
									value: '#'
								}
							]
						}
					}
				]
			]
		})
	],
	kit: { adapter: adapter() },
	extensions: ['.svelte', '.svx']
};

export default config;
