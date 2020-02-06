import * as bcrypt from 'bcryptjs';

const sql = {
  CHECK_IF_EMAIL_EXISTS: `SELECT 1 as exists FROM users WHERE email = $1;`,
  CREATE_ACCOUNT: `INSERT INTO users (email, password) VALUES ($1, $2);`,
  SELECT_PASSWORD: `SELECT password FROM users WHERE email = $1;`,
}

export class UserRepository {
  public constructor(private db: any, private secret: number) {}

  private async checkAccountExistence(email: string): Promise<boolean> {
    try {
      const { exists } = await this.db.oneOrNone(sql.CHECK_IF_EMAIL_EXISTS, [email]);
      return exists === 1;
    } catch (error) {
      if (error instanceof TypeError) {
        return false;
      }
      return error;
    }
  }

  public async createAccount(email: string, password: string) : Promise<boolean> {
      const exists = await <Promise<boolean>>this.checkAccountExistence(email);
      if (!exists) {
        const hashedPassword = <string>this.hashPassword(password);
        const { rowCount } = await this.db.result(sql.CREATE_ACCOUNT, [email, hashedPassword]);
        return rowCount == 1;
      }
      return false;
  }

  public hashPassword(password: string) : string {
    return <string>bcrypt.hashSync(password, this.secret);
  }

  public async authenticateAccount(email: string, password: string) : Promise<boolean> {
    try {
      const hashedPassword = await this.db.oneOrNone(sql.SELECT_PASSWORD, [email]);
      return <boolean>bcrypt.compareSync(password, hashedPassword);
    } catch (error) {
      return error;
    }
  }
}
