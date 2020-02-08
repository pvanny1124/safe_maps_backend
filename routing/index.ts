/**
 * @fileOverview index file packaging all routers
 * @author Patrick Vanegas
 * @version 1.0.0
 */
import { usersRouting } from './users';

interface Router {
  [usersRouting: string]: Function
}

export function routing(db: string, secret: number) : Object {
  const routing: Router = {
    usersRouting: usersRouting(db, secret),
  }
  return routing;
};
