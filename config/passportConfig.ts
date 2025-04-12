import  {searchUsername,searchUserById} from '../db/queries'
import passport from 'passport'
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";


const authenticateUser = async (username:string, password:string, done:Function) => {
    try {
        const user = await searchUsername(username);

    if (!user) {
        // If no user is found, return an error
        return done(null, false, { message: "No user with that username" });
      }
  
      // Compare the provided password with the hashed password stored in the database
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        // If the passwords don't match, return an error
        return done(null, false, { message: "Incorrect password" });
      }
  
      // If authentication succeeds, return the user object
      return done(null, user);
    } catch (err) {
      console.error("Authentication error:", err);
      return done(err);
    }
  };
  
  passport.use(new LocalStrategy(authenticateUser));
  
  passport.serializeUser((user:any, done:Function) => done(null, user.id));

  passport.deserializeUser(async (id:number, done:Function) => {
    try {
      const user = await searchUserById(id);
      if (!user) {
        return done(new Error("User not found"));
      }
      done(null, user);
    } catch (err) {
      done(err);
    }
  });