/**
 * @fileOverview TokenService class used to build JWT token for authentication purposes
 * @author Patrick Vanegas
 * @version 1.0.0
 */
import jwt = require('jsonwebtoken');

/** Class to handle token actions */
export default class TokenService {
  /**
   * Instatiates an instance of TokenService
   * @param {secret} secret the database secret
   */
  constructor(private readonly secret: string) {};

  /**
   * Signs (creates) a JWT token given a string or object.
   * @param {string | object} payload the information stored as a payload in the JWT
   * @returns {string} The JWT token
   */
  public sign(payload: string | Object) {
    return <string>jwt.sign(payload, this.secret);
  }
}
