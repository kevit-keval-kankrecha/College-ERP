import { Request, Response, NextFunction } from 'express';

export const authorization = (roles: string[]) => async (req, res, next) => {
  
  if(roles.includes(req.loginUser.role)){
    next();
  }
  else{
    res.send({ success: false, error: { statusCode: 403, message: 'You Have Not Permission to access it' } });
  }
  
};



