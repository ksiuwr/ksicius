// Require the necessary discord.js classes
import { Client, Intents } from 'discord.js'

import * as dotenv from 'dotenv'

dotenv.config()

const token = process.env.TOKEN

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

client.once('ready', () => {
  console.log('Ready!')
})

client.login(token)
