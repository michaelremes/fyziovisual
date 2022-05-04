import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from "bcryptjs";

export interface IUser extends Document {

  first_name: string;
  last_name: string;
  email: string;
  role: string;
  password: string;
}

const UserSchema: Schema = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    unique: true
  },
});

UserSchema.pre("save", function (next) {
  const user = this

  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, function (saltError, salt) {
      if (saltError) {
        return next(saltError)
      } else {
        bcrypt.hash(user.password, salt, function(hashError, hash) {
          if (hashError) {
            return next(hashError)
          }
          console.log(hash);
          user.password = hash
          next()
        })
      }
    })
  } else {
    return next()
  }
})

// Export the model and return your IUser interface
export default mongoose.model<IUser>('User', UserSchema);