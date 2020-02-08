/**
 * @fileOverview Repository for user account actions.
 * @author Patrick Vanegas
 * @version 1.0.0
 */

import * as bcrypt from 'bcryptjs';

interface ISQLMethods {
  readonly [method: string]: string
}

const sql: ISQLMethods = {
  CHECK_IF_EMAIL_EXISTS: `SELECT 1 as exists FROM users WHERE email = $1;`,
  CREATE_ACCOUNT: `INSERT INTO users (email, password) VALUES ($1, $2);`,
  SELECT_PASSWORD: `SELECT password FROM users WHERE email = $1;`,
}

export class UserRepository {
  /**
   * Instatiates a UserRepository instance given the database pgp configuration and secret.
   * @param {string} db the database pgp configuration object
   * @param {string} secret the database secret
   */
  public constructor(private readonly db: any, private readonly secret: number) {}


/**
 * Check whether a given email address is already registered in our database.
 * @param {string} email email address of the user in question
 * @returns {boolean | error} flag that determines if the account exists or not
 */
  private async checkAccountExistence(email: string): Promise<boolean> {
    try {
      const { exists } = await this.db.oneOrNone(sql.CHECK_IF_EMAIL_EXISTS, [email]);
      return <boolean>(exists === 1);
    } catch (error) {
      if (error instanceof TypeError) {
        return false;
      }
      return error;
    }
  }

  /**
   * Creates the account for a new user
   * @param {string} email email address of the user in question
   * @param {string} password desired password that the user has selected
   * @returns {boolean} flag that determines if the account was successfully registered or not
   */
  public async createAccount(email: string, password: string) : Promise<boolean> {
      const exists = await <Promise<boolean>>this.checkAccountExistence(email);
      if (!exists) {
        const hashedPassword = <string>this.hashPassword(password);
        const { rowCount } = await this.db.result(sql.CREATE_ACCOUNT, [email, hashedPassword]);
        return <boolean>(rowCount == 1);
      }
      return false;
  }

  /**
   * Hashes the user's original password
   * @param {string} password the original password of the user
   * @returns {string} hashed password created from the original password
   */
  private hashPassword(password: string) : string {
    return <string>bcrypt.hashSync(password, this.secret);
  }

  /**
   * Checks if the give password is the same as the hashed password. 
   * If the user does not exist, authenticateAccount will return false.
   * @param {string} email email address of the user in question
   * @param {string} password password that the user has entered
   * @returns {boolean | error} determines if the given password matches with the hashedPassword in the database 
   */
  public async authenticateAccount(email: string, password: string) : Promise<boolean> {
    try {
      const hashedPassword = await this.db.oneOrNone(sql.SELECT_PASSWORD, [email]);
      return <boolean>bcrypt.compareSync(password, hashedPassword);
    } catch (error) {
      return error;
    }
  }
}
