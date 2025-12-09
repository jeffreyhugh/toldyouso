<script lang="ts">
	import { onMount } from 'svelte';

	import { PUBLIC_GTAG_ID } from '$env/static/public';

	import { gtag } from './gtag';

	let consentModal: HTMLDialogElement | null = $state(null);
	let unsetConsent = $state(false);

	const defaultConsent = {
		ad_storage: 'denied',
		ads_data_redaction: false,
		ad_user_data: 'denied',
		ad_personalization: 'denied',
		analytics_storage: 'denied',
		functionality_storage: 'granted',
		personalization_storage: 'denied',
		security_storage: 'granted',
		wait_for_update: 500
	};

	let consent = $state({
		ad_storage: 'denied',
		ads_data_redaction: false,
		ad_user_data: 'denied',
		ad_personalization: 'denied',
		analytics_storage: 'denied',
		functionality_storage: 'granted',
		personalization_storage: 'denied',
		security_storage: 'granted'
	});

	onMount(() => {
		gtag('consent', 'default', { ...defaultConsent });

		unsetConsent = localStorage.getItem('consent.consentSet') === null;
		if (!unsetConsent) {
			consent.ad_storage = localStorage.getItem('consent.ad_storage') ?? defaultConsent.ad_storage;
			consent.ads_data_redaction = localStorage.getItem('consent.ads_data_redaction') === 'true';
			consent.ad_user_data =
				localStorage.getItem('consent.ad_user_data') ?? defaultConsent.ad_user_data;
			consent.ad_personalization =
				localStorage.getItem('consent.ad_personalization') ?? defaultConsent.ad_personalization;
			consent.analytics_storage =
				localStorage.getItem('consent.analytics_storage') ?? defaultConsent.analytics_storage;
			consent.functionality_storage =
				localStorage.getItem('consent.functionality_storage') ??
				defaultConsent.functionality_storage;
			consent.personalization_storage =
				localStorage.getItem('consent.personalization_storage') ??
				defaultConsent.personalization_storage;
			consent.security_storage =
				localStorage.getItem('consent.security_storage') ?? defaultConsent.security_storage;

			gtag('consent', 'update', { ...consent });
		}
	});

	const acceptAll = () => {
		localStorage.setItem('consent.consentSet', 'true');
		unsetConsent = false;
		localStorage.setItem('consent.ad_storage', 'granted');
		localStorage.setItem('consent.ads_data_redaction', 'false');
		localStorage.setItem('consent.ad_user_data', 'granted');
		localStorage.setItem('consent.ad_personalization', 'granted');
		localStorage.setItem('consent.analytics_storage', 'granted');
		localStorage.setItem('consent.functionality_storage', 'granted');
		localStorage.setItem('consent.personalization_storage', 'granted');
		localStorage.setItem('consent.security_storage', 'granted');

		consent.ad_storage = 'granted';
		consent.ads_data_redaction = false;
		consent.ad_user_data = 'granted';
		consent.ad_personalization = 'granted';
		consent.analytics_storage = 'granted';
		consent.functionality_storage = 'granted';
		consent.personalization_storage = 'granted';
		consent.security_storage = 'granted';

		gtag('consent', 'update', { ...consent });
	};

	const rejectAll = () => {
		localStorage.setItem('consent.consentSet', 'true');
		unsetConsent = false;
		localStorage.setItem('consent.ad_storage', 'denied');
		localStorage.setItem('consent.ads_data_redaction', 'true');
		localStorage.setItem('consent.ad_user_data', 'denied');
		localStorage.setItem('consent.ad_personalization', 'denied');
		localStorage.setItem('consent.analytics_storage', 'denied');
		localStorage.setItem('consent.functionality_storage', 'granted');
		localStorage.setItem('consent.personalization_storage', 'denied');
		localStorage.setItem('consent.security_storage', 'granted');

		consent.ad_storage = 'denied';
		consent.ads_data_redaction = false;
		consent.ad_user_data = 'denied';
		consent.ad_personalization = 'denied';
		consent.analytics_storage = 'denied';
		consent.functionality_storage = 'granted';
		consent.personalization_storage = 'denied';
		consent.security_storage = 'granted';

		gtag('consent', 'update', { ...consent });
	};

	const setConsent = (property: string, value: 'granted' | 'denied', disabled: boolean) => {
		if (disabled) {
			return;
		}

		localStorage.setItem(`consent.${property}`, value);
		// @ts-expect-error it's fine I promise
		consent[property] = value;
		gtag('consent', 'update', { [property]: value });

		if (property !== 'ad_storage') {
			return;
		}

		localStorage.setItem('consent.ads_data_redaction', value === 'denied' ? 'true' : 'false');
		consent.ads_data_redaction = value === 'denied';
		gtag('consent', 'update', { ads_data_redaction: value === 'denied' });
	};
</script>

<svelte:head>
	<script async src={`https://www.googletagmanager.com/gtag/js?id=${PUBLIC_GTAG_ID}`}></script>
	<script>
		window.dataLayer = window.dataLayer || [];
		function gtag() {
			dataLayer.push(arguments);
		}
		gtag('js', new Date());
		gtag('config', 'G-DNJSP28HH1');

		window.addEventListener('gtag', (event) => {
			gtag(...event.detail);
		});
	</script>
</svelte:head>

{#if unsetConsent}
	<div
		class="max-h-auto bg-base-300 border-neutral/20 fixed right-4 bottom-4 mt-4 ml-4 flex max-w-96 flex-col gap-1 rounded-md border-1 p-4 lowercase"
	>
		<h2 class="mb-1 text-lg font-bold">Cookie Consent</h2>
		<div>
			We use cookies and similar technologies to improve your browsing experience, personalize
			content, and analyze our traffic.
		</div>
		<div>
			By clicking "accept all," you consent to our use of cookies and tracking technologies,
			including for analytics and marketing purposes.
		</div>
		<div class="mt-2 flex gap-2">
			<button class="btn btn-primary bg-vibrant lowercase" onclick={acceptAll}>Accept All</button>
			<button class="btn lowercase" onclick={rejectAll}>Reject All</button>
			<button class="btn lowercase" onclick={() => consentModal?.showModal()}>Manage</button>
		</div>
	</div>
	<dialog bind:this={consentModal} class="modal modal-bottom sm:modal-middle lowercase">
		<div class="modal-box bg-base-300">
			<h2 class="mb-2 text-lg font-bold">Cookie Consent</h2>
			{@render setting(
				'ad_storage',
				'Ad Storage',
				'Enables storage, such as cookies, related to advertising'
			)}
			{@render setting(
				'ad_user_data',
				'Ad User Data',
				'Consent for sending user data to Google for advertising purposes'
			)}
			{@render setting(
				'ad_personalization',
				'Ad Personalization',
				'Consent for personalized advertising'
			)}
			{@render setting(
				'analytics_storage',
				'Analytics Storage',
				'Enables storage, such as cookies, related to analytics, for example, visit duration'
			)}
			{@render setting(
				'functionality_storage',
				'Functionality Storage',
				'(Required) Enables storage that supports the functionality of the website, for example, language settings',
				true
			)}
			{@render setting(
				'personalization_storage',
				'Personalization Storage',
				'Enables storage related to personalization, for example, video recommendations'
			)}
			{@render setting(
				'security_storage',
				'Security Storage',
				'(Required) Enables storage related to security such as authentication functionality, fraud prevention, and other user protection',
				true
			)}
			<form method="dialog" class="mt-4">
				<button
					class="btn btn-primary bg-vibrant lowercase"
					onclick={() => {
						localStorage.setItem('consentSet', 'true');
						unsetConsent = false;
					}}
				>
					Save and Close
				</button>
				<button class="btn lowercase" onclick={acceptAll}>Accept All</button>
			</form>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button>close</button>
		</form>
	</dialog>
{/if}

{#snippet setting(property: string, title: string, description: string, disabled: boolean = false)}
	<label class="flex items-center justify-between">
		<div>
			<h4>{title}</h4>
			<div class="text-neutral/70 text-sm">{description}</div>
		</div>
		<input
			type="checkbox"
			class="toggle"
			{disabled}
			checked={(consent as unknown as Record<string, 'granted' | 'denied'>)[property] === 'granted'}
			onchange={(e) =>
				setConsent(
					property,
					(e.target as HTMLInputElement).checked ? 'granted' : 'denied',
					disabled
				)}
		/>
	</label>
{/snippet}
