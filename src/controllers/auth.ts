import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import * as bcrypt from 'bcrypt'

import* as jwt from 'jsonwebtoken';
import* as  dotenv from 'dotenv';
dotenv.config();
class Auth {

 register = async ( req: Request,res: Response): Promise<Response> => {
try {
    if (!req.body.password || !req.body.email) {
      res.json({ success: false, msg: 'Please pass email and password.' });
    }
    else {
      const user = new User();
        user.fullName=req.body.fullName,
        user.email= req.body.email,
        user.password= req.body.password
       user.hashPassword();
      
    await getRepository(User).save(user);

    const token = jwt.sign(
      { userId:user.id, email:user.email,fullName:user.fullName,password:user.password },
    
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    //Send the jwt in the response
    res.status(200).send( {success: true,msg:'suseul register', token:token}); 
   
    }
  }
  catch (err) {
    return res.status(400).json({ success: false, msg: 'Costumer  Email already use' });
}
  }



   login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body
    try {
        if (!email || !password) {
          res.json({ success: false, msg: 'Please pass email and password.' });
        }

    const userRepository = getRepository(User)
    let user: User
    try {
      user = await userRepository.findOne({ where:{email}})
    } catch (error) {
      res.status(401).send({ error: 'User not found!' })
      return
    }

    if (!user.checkIfUnEncryptedPasswordIsValid( password)) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email, fullName: user.fullName, password: user.password },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    //Send the jwt in the response
    res.status(200).send( {success: true,msg:'suseul login', token:token}); 
   
}
catch (error) {
  res.status(401).send({ success: false, msg: 'Authentication failed' });
}
  
   }
  };
export default new Auth();