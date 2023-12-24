import { Schema, model } from 'mongoose';
import { User, UserModelStatic } from './user.interface';
import config from '../../config';
import bcrypt from 'bcrypt';

const userSchema = new Schema<User, UserModelStatic>(
  {
    id: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    needsPasswordChange: { type: Boolean },
    passwordChangedAt: { type: Date },
    role: { type: String, enum: ['patient', 'doctor', 'admin'] },
    email: { type: String },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

//checking is password matched or not
userSchema.statics.isJWTIssuedAfterBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  //getting changed time
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  //comparing token and pass change time

  return Number(parseInt(passwordChangedTime)) > jwtIssuedTimestamp;
};

//document middleware
userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bicrypt_salt_rount),
  );
  next();
});

userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

export const UserModel = model<User, UserModelStatic>('User', userSchema);
