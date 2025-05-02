<script>
	import MaxWidthArticle from "$lib/MaxWidthArticle.svelte";
</script>

<svelte:head>
	<title>told-you.so · about</title>
</svelte:head>

<MaxWidthArticle>
	<p>
		told-you.so started as a project a few years ago to learn the basics of{" "}
		<a class="link" href="https://tailwindcss.com" target="_blank"> TailwindCSS </a>{" "}
		and Next.js/Vercel serverless functions. Since its original startup in 2021, a total of over 300,000
		messages have been saved in the database, largely thanks to{" "}
		<a class="link" href="https://boredbutton.com" target="_blank"> BoredButton.com </a>
		. I've also learned a lot, so I decided to rewrite the project from the ground up.
	</p>
	<p>
		Easily the biggest change is that the site now runs on <a
			class="link"
			href="https://svelte.dev"
			target="_blank">Svelte</a
		>. I got so fed up with the limitations imposed by React Server Components that I decided to try
		learning Svelte. I gotta admit, it's pretty awesome.
	</p>
	<p>
		As far as the backend goes,{" "}
		<a class="link" href="https://supabase.com" target="_blank"> Supabase </a>{" "}
		has completely replaced the custom Go API. Supabase's{" "}
		<a class="link" href="https://supabase.com/docs/guides/auth/auth-anonymous" target="_blank">
			anonymous sign-in
		</a>{" "}
		feature means everyone gets an account when they visit the site, which is used to aggregate messages
		to a dashboard. This is a much-needed improvement over the old system of having to copy the link
		and remember where it was saved. Users can attach an email to the anonymous session to access their
		messages from another computer at a later date.
	</p>
	<p>
		Supabase has baked-in support for Postgres'{" "}
		<a
			class="link"
			href="https://www.postgresql.org/docs/current/ddl-rowsecurity.html"
			target="_blank"
		>
			row-level security
		</a>{" "}
		(RLS). Users connect directly to the database (well, to the pooler through a reverse proxy or two),
		and all transactions must be filtered through these policies before reading or writing data. What's
		even cooler is that told-you.so uses a combination of RLS policies and Postgres views to prevent
		a user from reading the message's content before it's supposed to be released, so no extra server-side
		logic had to be implemented.
	</p>
	<p>
		I also added the message's SHA256 as a way to prove the contents of the message haven't changed.
		The message itself won't be released before the release date, but the SHA256 will be visible
		from the message page. If the message page were to be added to an internet archive, the hash
		will serve as proof that the message wasn't edited on the backend.
	</p>
	<p>
		<span class="font-bold">
			If your message is encrypted, the SHA256 will be taken of the stored ciphertext instead of the
			plaintext.
		</span>
		Why? When selecting a message from the database, you're actually selecting from a view, where one
		of those columns is the checksum. The checksum is calculated at query time instead of being stored
		alongside the data, and since the database doesn't have the plaintext of an encrypted message, it
		can only hash the ciphertext.
	</p>
	<p>
		As always, encryption is done client-side with AES-256. The ciphertext is sent and stored on the
		server, and the server never stores (or knows) the password.
	</p>
	<p>
		I've also moved to{" "}
		<a href="https://daisyui.com" class="link" target="_blank"> daisyUI </a>{" "}
		instead of vanilla Tailwind. It's nice to focus on making the site work instead of making the buttons
		look perfect.
	</p>
	<p>
		<span class="font-bold">A note on v1 <code>/p</code> URLs:</span> they still work, but not the
		same way they used to. Unencrypted messages will be redirected to the equivalent
		<code>/messages</code>
		URL with the message's new UUID. They will be indistinguishable from v2 messages. Encrypted messages
		will stay on the
		<code>/p</code> URL, but
		<span class="font-bold">your password will be sent to the server to decrypt the message.</span> Why?
		These messages were encrypted with a Node.js module that I somehow got working on the browser in
		v1, but I couldn't figure out how to polyfill for v2.
	</p>
</MaxWidthArticle>
