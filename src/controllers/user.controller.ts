import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
//getUsers
export const getUsers = async (req: Request,res: Response)=> {
  const userRepository = getRepository(User);
  try{
    const users = await userRepository.find();
      
  if(users) {
    return res.status(200).json(users);
  }
  else {
    return  res.status(400).json({success: false,msg: 'Not user found'});
  }
  }
  catch (error) {
    return res.send(error);
    
  }
};
//getUser
export const getUser = async (
  req: Request,
  res: Response
)=> {
  const userRepository = getRepository(User);
  try{
  const results = await userRepository.findOneOrFail( {where: {
    id: req.params.id
}});
  
if(results) {
   res.status(200).json(results);
   return
  
} else {
 
  return  res.status(400).json({success: false,msg: 'Not user found'})
}
}
catch (error) {
  return res.send(error);
  
}
 
};
//createUser
export const createUser = async ( req: Request,res: Response) => {
  try {
    if (!req.body.fullName || !req.body.email) {
      res.json({ success: false, msg: 'Please pass email and password.' });
    }
    else {
      var user = {
        fullName: req.body.fullName,
        email: req.body.email,
        password: req.body.password

      };
    const results = await getRepository(User).save(user);
    return res.status(200).json(results);
  }
}
  catch (err) {
    return res.status(400).json({ success: false, msg: 'Costumer  Email already use' });
}

};

//updateUser
export const updateUser = async ( req: Request,res: Response)=> {
  try{
  const user = await getRepository(User).findOneOrFail({where: {
    id: req.params.id
}});
  if (user) {
    getRepository(User).merge(user, req.body);
    const results = await getRepository(User).save(user);
    return res.status(200).json(results);
  }
  }
  catch (err) {
  return res.json({msg: 'Not user found'});
  }
};
//deleteUser
export const deleteUser = async (req: Request, res: Response)=> {
  try{
    const user = await getRepository(User).findOneOrFail({where: {
      id: req.params.id
  }});
    if(user) {
  const result =await getRepository(User).delete(user);
  return res.json({msg: 'success delete user'});
    }
 else {
  return  res.status(400).json({success: false,msg: 'Not user found'});
}
  }
  catch (error) {
    return res.send(error);
    
  }
};
