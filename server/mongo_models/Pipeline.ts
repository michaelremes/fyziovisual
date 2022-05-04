import mongoose, { Schema, Document } from 'mongoose';

export interface IPipeline extends Document {
  id: string;
  name: string;
  author: string;
  data: [];
}

const PipelineSchema = new Schema({
  name: {
    type: String,
    default: ''
  },
  author: {
    type: String,
    default: ''
  },
  data: {
    type: Array,
    default: []
  }

});


export default mongoose.model < IPipeline > ('Pipeline', PipelineSchema);