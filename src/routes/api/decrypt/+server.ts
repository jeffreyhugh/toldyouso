import aes256 from 'aes256';

export async function GET({ url }) {
	const data = url.searchParams.get('data');
	const key = url.searchParams.get('key');

	return new Response(!data || !key ? '' : aes256.decrypt(key, data), {
		headers: {
			'Content-Type': 'text/plain'
		}
	});
}
