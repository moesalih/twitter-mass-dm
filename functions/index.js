const functions = require('firebase-functions');


const Twitter = require('twitter-lite')


exports.getTwitterFollowers = functions.https.onCall(async (data, context) => {
	try {

		if (!data.twitterKeys) throw 'Missing Twitter API Keys'

		var client = new Twitter(data.twitterKeys)

		let result = await client.get('followers/list', { count: 200 })

		return result

	} catch(e) {
		console.error(e)
		throw new functions.https.HttpsError('unknown', e.errors ? e.errors[0].message : e.message || e);
	}
})


exports.dmFollower = functions.https.onCall(async (data, context) => {
	try {

		if (!data.twitterKeys) throw 'Missing Twitter API Keys'
		if (!data.userId) throw 'Missing User ID'
		if (!data.message) throw 'Missing Message'

		var client = new Twitter(data.twitterKeys)

		let result = await client.post('direct_messages/events/new', {
			event: {
				type: 'message_create',
				message_create: {
					target: {
						recipient_id: data.userId,
					},
					message_data: {
						text: data.message,
					},
				}
			},
		})

		return result

	} catch(e) {
		console.error(e)
		throw new functions.https.HttpsError('unknown', e.errors ? e.errors[0].message : e.message || e);
	}
})
