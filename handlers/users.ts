import { Request, Response } from 'express';
import { UserRepository } from '../repositories/';
import { celebrate, Joi } from 'celebrate';
import TokenService from '../services/tokenservice';
import config from '../config';

export = UsersHandler;

namespace UsersHandler {
  export const createAccountValidation = celebrate({
    body: Joi.object({
      email: Joi.string().email(),
      password: Joi.string(),
    }),
  });
  
  export const authenticateAccountValidation = celebrate({
    body: Joi.object({
      email: Joi.string().email(),
      password: Joi.string(),
    }),
  })
  
  export function createAccount(userRepository: UserRepository) : Function {
    return async function (req: Request, res: Response) : Promise<void> {
      const { email, password } = req.body;
      try {
        const created = await userRepository.createAccount(email, password);
        if (created) {
          const token = new TokenService(config.auth.secret).sign({ email });
          res.status(200).json({ token });
          return;
        }
        res.sendStatus(403);
      } catch (error) {
        res.sendStatus(500);
      }
    }
  }
  
  export function authenticateAccount(userRepository: UserRepository) : Function {
    return async function (req: Request, res: Response) : Promise<void> {
      const { email, password } = req.body;
      try {
        const isAuthenticated = await userRepository.authenticateAccount(email, password);
        if (isAuthenticated) {
          const token = new TokenService(config.auth.secret).sign({ email });
          res.status(200).json({ token });
          return;
        }
        res.sendStatus(403);
      } catch (error) {
        res.sendStatus(500);
      }
    }
  }
  
}
