
import jwt = require('jsonwebtoken');

export default class TokenService {
  constructor(private secret: string) {};

  public sign(payload: string | Object) {
    return jwt.sign(payload, this.secret);
  }
}
