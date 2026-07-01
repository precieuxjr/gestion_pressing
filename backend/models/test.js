import bcrypt from 'bcrypt';
import 'dotenv/config';

const password = 'azerty123';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) console.error(err);
  else console.log('Hash :', hash);
});