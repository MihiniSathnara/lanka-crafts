import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['tourist', 'artist', 'admin'], required: true },
    avatar: { type: String, default: '' },

    // Tourist & shared fields
    phone: { type: String, default: '' },
    country: { type: String, default: '' },
    nic_passport: { type: String, default: '' },

    // Artist specific
    bio: { type: String, default: '' },
    craftSpecialization: [{ type: String }],
    address: { type: String, default: '' },
    workshopName: { type: String, default: '' },
    workshopLocation: {
      address: { type: String, default: '' },
      lat: { type: Number, default: 7.8731 },
      lng: { type: Number, default: 80.7718 },
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', userSchema);
export default User;
