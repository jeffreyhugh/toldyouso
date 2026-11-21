import { goto } from '$app/navigation';

export async function load() {
	goto('/blog/about');
}
