import mongoose, { Schema } from 'mongoose';

const configSchema = new Schema({
  WELCOME_MESSAGE: String
});

export const ConfigModel = mongoose.model('Config', configSchema);
