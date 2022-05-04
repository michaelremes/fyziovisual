import mongoose, { Schema, Document } from 'mongoose';

export interface IModule extends Document {
  id: String;
  name: String;
  category: String;
  type: String;
  data: object;
}

const ModuleSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: false,
  },

});

// Export the model and return your IUser interface
export default mongoose.model<IModule>('Module', ModuleSchema);