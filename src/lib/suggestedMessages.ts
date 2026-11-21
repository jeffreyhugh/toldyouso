import { DateTime } from 'luxon';
import { outdent } from 'outdent';

export const suggestions: Record<string, { event: string; content: string }> = {
	'🧑📸 Life Snapshot': {
		event: 'life-snapshot',
		content: outdent`
				Dear Future Me,

				I hope everything is going well in the future! It is currently ${DateTime.now().toLocaleString(DateTime.DATE_MED)}, and right now, I'm <...>

				Here's three things I'm super proud of:
				1. <...(something academic/professional)>
				2. <...(something extracirricular)>
				3. <...(something interpersonal)>

				And here's one thing I hope to accomplish in the next five years:
				1. <...>

				Keep up the good work!

				Best,
				Past You
			`
	},
	'🤫❤️ Future Romantic Interest': {
		event: 'romantic-interest',
		content: outdent`
				Heyyy,

				It's ${DateTime.now().toLocaleString(DateTime.DATE_MED)}, and:
				- We're currently <...(besties, strangers, talking, dating)>
				- My embarassing secret: <...>
				- I hope when you read this, we're <...(still friends, together)>

				Xoxo,
				<...>

				P.S. Do we still talk? If not, why?
			`
	},
	'💃🎤 Pop Culture ': {
		event: 'pop-culture',
		content: outdent`
				Right now (${DateTime.now().toLocaleString(DateTime.DATE_MED)}), everyone's obsessed with:
				- Movie: <...(title, studio, actor)>
				- Viral Trend: <...(TikTok dance, meme)>
				- Music: <...(song, artist)>

				My predictions for when this is read:
				1. <...> flopped hard
				2. <...> became a classic
				3. We still don't have flying cars, do we?
			`
	},
	'😬😅 Embarassing Dare': {
		event: 'embarassing-dare',
		content: outdent`
				Future Brave Me,

				You MUST do this within 24 hour of reading:
				<...(try food you don't like, ask someone out, dance in public)>

				Rules:
				1. No backing out!
				2. Evidence required (screenshot/video)
				3. Send the evidence to your best friend

				No regrets,
				Chaotic Past You
			`
	},
	'🙏💯 Gratitude Moment': {
		event: 'gratitude-moment',
		content: outdent`
			Here are three things I'm grateful for:
			1. <...>
			2. <...>
			3. <...>
			`
	}
};
