import {supabase} from '../controllers/userController'
import { Request, Response, NextFunction } from "express";
async function requireAuth (req:Request,res:Response,next:Function){
    const token = req.session.token;

    if (!token) {
        console.log("Token not found redirecting to login 1");
      return res.redirect("/");
    }
  
    const { data: { user }, error } = await supabase.auth.getUser(token);
  
    if (error || !user) {
        console.log("Token not found redirecting to login 2");

      return res.redirect("/");
    }
  
    req.user = user;
    next();
  }

  export default requireAuth;