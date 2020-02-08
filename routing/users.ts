const express = require('express');
const router = express.Router();
import { UserRepository } from '../repositories';
import { usersHandler } from '../handlers';
import { Router } from 'express';

export function usersRouting(db: string, secret: number): Router {
  const userRepository = new UserRepository(db, secret);

  router.post("/users/signup", 
    usersHandler.createAccountValidation, 
    usersHandler.createAccount(userRepository)
  );

  router.get("/users/signin", 
    usersHandler.authenticateAccountValidation, 
    usersHandler.authenticateAccount(userRepository)
  );

  return router;
}
