declare module 'aes256' {
	export function encrypt<T extends string>(key: string, plaintext: T): T;
	export function decrypt<T extends string>(key: string, cyphertext: T): T;
}
