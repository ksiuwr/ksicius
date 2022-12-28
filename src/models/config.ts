import mongoose, { Schema } from 'mongoose';

const configSchema = new Schema({
  WELCOME_MESSAGE: String,
  ROLE_TO_REACTION: {
    type: Map,
    of: String
  },
  ROLE_TO_REACTION_MESSAGE_ID: String,
  IS_AUTOROLE_ENABLED: Boolean
});

export const ConfigModel = mongoose.model('Config', configSchema);
