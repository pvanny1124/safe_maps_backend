const express = require('express');
const router = express.Router();
import { UserRepository } from '../repositories';
import { usersHandler } from '../handlers';

export function usersRouting<T>(db: string, secret: number): T {
  const userRepository = new UserRepository(db, secret);

  router.post("/users", 
    usersHandler.createAccountValidation, 
    usersHandler.createAccount(userRepository)
  );

  router.get("/users", 
    usersHandler.authenticateAccountValidation, 
    usersHandler.authenticateAccount(userRepository)
  );

  return router;
}
