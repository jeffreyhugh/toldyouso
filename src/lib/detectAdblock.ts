// courtesy of https://github.com/The-3Labs-Team/js-anti-adblock

export const detectAdblock = async () => {
	let adBlockEnabled = false;
	const googleAdUrl = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';

	try {
		const keywordsToCheck = ['uBlock', 'height:1px!important'];

		const response = await fetch(new Request(googleAdUrl));
		if (!response.headers.get('content-length')) {
			adBlockEnabled = true;
		}

		const responseText = await response.text();
		const adBlockDetected = keywordsToCheck.some((keyword) => responseText.includes(keyword));
		if (adBlockDetected) {
			adBlockEnabled = true;
		}
	} catch {
		adBlockEnabled = true;
	}

	return adBlockEnabled;
};
