export const gtag = (...args: unknown[]) => {
	window.dataLayer.push(args);
};
