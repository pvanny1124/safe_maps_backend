/**
 * @fileOverview Controllers to handle user-account and auth related endpoints
 * @author Patrick Vanegas
 * @version 1.0.0
 */
import { Request, Response } from 'express';
import { UserRepository } from '../repositories';
import { celebrate, Joi } from 'celebrate';
import TokenService from '../services/TokenService';
import config from '../config';

export = UsersHandler;
/**
 * Handles routes that interact with user accounts
 * @namespace UsersHandler
 */
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
  
  /**
   * Registers the account for the user and sends a JWT to the client
   * @param {UserRepository} userRepository the repository that handles user actions
   * @returns {void}
   */
  export function createAccount(userRepository: UserRepository) : Function {
    return async function (req: Request, res: Response) : Promise<void> {
      const { email, password } = req.body;
      try {
        const created : boolean = await userRepository.createAccount(email, password);
        if (created) {
          const token: string = new TokenService(config.auth.secret).sign({ email });
          res.status(200).json({ token });
          return;
        }
        res.sendStatus(403);
      } catch (error) {
        res.sendStatus(500);
      }
    }
  }

  /**
   * authenticates the user and returns a JWT to the client
   * @param {UserRepository} userRepository userRepository the repository that handles user actions
   * @returns {void}
   */
  export function authenticateAccount(userRepository: UserRepository) : Function {
    return async function (req: Request, res: Response) : Promise<void> {
      const { email, password } = req.body;
      try {
        const isAuthenticated: boolean = await userRepository.authenticateAccount(email, password);
        if (isAuthenticated) {
          const token: string = new TokenService(config.auth.secret).sign({ email });
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
