const Twilio = require('twilio')
const config = require('./config')

const AccessToken = Twilio.jwt.AccessToken
const ChatGrant = AccessToken.ChatGrant
const SyncGrant = AccessToken.SyncGrant

function tokenGenerator(identity = 0) {
	console.log({ identity })
	const token = new AccessToken(config.TWILIO_ACCOUNT_SID, config.TWILIO_API_KEY, config.TWILIO_API_SECRET, {
		identity
	})

	token.identity = identity

	if (config.TWILIO_CHAT_SERVICE_SID) {
		const chatGrant = new ChatGrant({
			serviceSid: config.TWILIO_CHAT_SERVICE_SID
		})
		token.addGrant(chatGrant)
	}

	if (config.TWILIO_SYNC_SERVICE_SID) {
		const syncGrant = new SyncGrant({
			serviceSid: config.TWILIO_SYNC_SERVICE_SID || 'default'
		})
		token.addGrant(syncGrant)
	}

	return {
		identity: token.identity,
		token: token.toJwt()
	}
}

module.exports = tokenGenerator
