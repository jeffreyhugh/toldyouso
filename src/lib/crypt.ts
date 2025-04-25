import { Base64 } from "js-base64";

export const encrypt = async (message: string, key: string) => {
	const iv = new Uint8Array(16);
	crypto.getRandomValues(iv);

	const messageBuffer = new TextEncoder().encode(message);

	const cryptoKey = await makeCryptoKey(key);
	const cipherBuffer = await crypto.subtle.encrypt(
		{ name: "AES-GCM", iv } as AesGcmParams,
		cryptoKey,
		messageBuffer
	);

	const encryptedBuffer = concatBuffers(iv, new Uint8Array(cipherBuffer));

	return Base64.fromUint8Array(encryptedBuffer);
};

export const decrypt = async (ciphertext: string, key: string) => {
	const inputBuffer = Base64.toUint8Array(ciphertext);
	const iv = inputBuffer.slice(0, 16);

	const cryptoKey = await makeCryptoKey(key);

	const decryptedBuffer = await crypto.subtle.decrypt(
		{ name: "AES-GCM", iv } as AesGcmParams,
		cryptoKey,
		inputBuffer.slice(16)
	);

	return new TextDecoder("utf8").decode(decryptedBuffer);
};

const concatBuffers = (b1: Uint8Array<ArrayBuffer>, b2: Uint8Array<ArrayBuffer>) => {
	const tmp = new Uint8Array(b1.byteLength + b2.byteLength);
	tmp.set(new Uint8Array(b1), 0);
	tmp.set(new Uint8Array(b2), b1.byteLength);
	return tmp;
};

const makeCryptoKey = async (key: string) => {
	const keyBuffer = new TextEncoder().encode(key);
	const keyHash = await crypto.subtle.digest("SHA-256", keyBuffer);

	return await crypto.subtle.importKey("raw", keyHash, { name: "AES-GCM" }, true, [
		"encrypt",
		"decrypt"
	]);
};
