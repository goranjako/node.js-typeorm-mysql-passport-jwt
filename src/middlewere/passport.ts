
import passport from 'passport';
import { Strategy, ExtractJwt } from "passport-jwt";
import  dotenv from 'dotenv';
dotenv.config();
import { User } from "../entity/User";
import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";

class passportManager {
    
    initialize(){
        var opts = {
            jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey : process.env.SECRET_KEY,
            
        }
        passport.use(new Strategy(opts, (payload, done)=> {
            const userRepository = getRepository(User);
            try{
         const user=userRepository.findOneOrFail({ where:{
                email: payload.email}});   
                if (user) {
                // note the return removed with passport JWT - add this return for passport local
                done(null, user);
              } else {
                console.log('user not found in db');
                done(null, false);
              }
          } catch (err) {
            done(err);
          }
        }),
      );
      return passport.initialize(); 
    }
  
    authenticate(req: Request, res:Response, next: NextFunction){
        passport.authenticate('jwt', { session: false}, (err, user, info) => {
          if (err) { return next(err); }
          if (!user) {
              if (info.name === "TokenExpiredError") {
                  return res.status(401).json({ message: "Your token has expired." });
              } else {
                  return res.status(401).json({success: false, msg: 'Unauthorized.'});
              }
          }
          req.body.user = user;
          return next();
        })(req, res, next);
      };

}
export default new passportManager();  