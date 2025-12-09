export const gtag = (...args: unknown[]) => {
	window.dispatchEvent(new CustomEvent('gtag', { detail: args }));
};
