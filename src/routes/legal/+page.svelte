<script>
	import MaxWidthArticle from "$lib/MaxWidthArticle.svelte";
	import { DateTime } from "luxon";
</script>

<svelte:head>
	<title>told-you.so · legal</title>
</svelte:head>

<MaxWidthArticle>
	<p>
		By using told-you.so, you affirm that you are at least 18 years of age. You may not use this
		service if you are under 18 years of age.
	</p>
	<p>
		When you visit this site, a unique ID is generated and attached to all submissions for the
		purpose of making those submissions available on subsequent visits. This unique ID is not used
		for marketing, solicitation, tracking, or analytics. If you choose to make an account by
		providing your email address, your email address will be tied to that unique ID. Your email
		address will not be used for marketing, solicitation, tracking, or analytics.
	</p>
	<p>
		For each message, the author of this site stores a unique message ID, submission time, IP
		address(es), the message itself, and analytical statistics.{" "}
		<span class="font-bold">
			If the message is unencrypted, it is stored in plaintext in the database.
		</span> The author of this site highly recommends encrypting your message client-side by setting
		a password.
	</p>
	<p>
		You may not submit content which is illegal, infringes on copyright, glorifies violence, is
		obscene, defamatory, personally-identifiable, or otherwise in bad taste.
	</p>
	<p>
		The author of this site provides no guarantees about service or content availability. As such,
		he is free to delete accounts or submissions from the database at any time, for any reason.
	</p>
	<p>
		By using told-you.so, you give the author of this site permission to use collected data however
		he'd like in accordance with these terms. The author of this site commits to cooperating with
		law enforcement should the need arise. Law enforcement may email requests for data to{" "}
		<a href="mailto:toldyouso@jh.ms" class="link">toldyouso@jh.ms</a>{" "}
		from an official business email.
	</p>
	<p>
		The author of this site runs ads supplied by Google AdSense. Outside the EU and within the EU if
		you accept cookies, Google AdSense uses cookies to show you personalized ads.
	</p>
	<p>
		For any questions about the site or these terms, please email{" "}
		<a href="mailto:toldyouso@jh.ms" class="link">toldyouso@jh.ms</a>.
	</p>
	<p>
		told-you.so &copy; Jeffrey Hugh 2021 - {DateTime.now().year} &middot; Licensed under the
		<a
			class="link"
			href="https://github.com/jeffreyhugh/toldyouso?tab=MIT-1-ov-file#readme"
			target="_blank"
		>
			MIT license
		</a>.
	</p>
</MaxWidthArticle>
