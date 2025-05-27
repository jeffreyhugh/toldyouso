import * as sitemap from 'super-sitemap';

export const GET = async () => {
	const blogs = import.meta.glob('/src/lib/content/*.svx');

	const slugs = Object.entries(blogs).map(([path]) => slugFromPath(path));

	return await sitemap.response({
		origin: 'https://told-you.so',
		paramValues: {
			'/blog/[slug]': slugs
		},
		excludeRoutePatterns: ['^/messages/.*', '^/p/.*']
	});
};

const slugFromPath = (path: string) => path.match(/([\w-]+)\.(svx)/i)?.[1] ?? '';
