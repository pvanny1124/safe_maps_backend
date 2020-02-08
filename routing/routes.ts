const express = require('express');
const router = express.Router();
import { RouteRepository } from '../repositories';
import { routesHandler } from '../handlers';
import { Router } from 'express';

export function routesRouting(db: string, secret: number): Router {
  const routesRepository = new RouteRepository(db, secret);

  router.get("/routes", 
    routesHandler.coordinatesValidation, 
    routesHandler.getRoute(routesRepository)
  );

  return router;
}
