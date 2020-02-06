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
