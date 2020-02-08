/**
 * @fileOverview Main app file
 * @author Patrick Vanegas
 * @version 1.0.0
 */
import { Request, Response } from 'express';
import { routing } from './routing';
import { IEventContext } from 'pg-promise';
import jwt = require('express-jwt');
import { NextFunction } from 'connect';
import config from './config';
import * as dotenv from "dotenv";

dotenv.config();

const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.disable('etag');

const pgp = require('pg-promise')({
  error(err: any, e: IEventContext) {
    if (e.cn) {
      fs.writeFile('db.log.txt', `DB ERROR: ${err}${e}${e.cn}`, function(err: any) {
        if (err) {
          return console.log(err);
        }
      });
      console.log('E: ', err, e, e.cn);
    }
  },
});

app.get("/", function(req: Request, res: Response): void {
  res.send('hello world');
})

const { PORT, DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_DATABASE } = process.env;

const db = pgp({
  user: DB_USER,
  password: DB_PASS,
  host: DB_HOST,
  port: DB_PORT,
  database: DB_DATABASE,
});

app.use(
  jwt({ secret: config.auth.secret }).unless({
    path: [
      { url: '/auth', methods: ['POST'] },
      { url: '/health', methods: ['GET'] },
      { url: '/users', methods: ['POST', 'GET'] },
      { url: '/routes', methods: ['GET'] },
    ],
  })
);

app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token...');
  }
});


const preparedRouting = <Object>routing(db, config.secret);
Object.keys(preparedRouting).forEach((item: string) : void => {
  app.use('/', (preparedRouting as any)[item]);
});

app.listen(PORT, (): void => console.log(`Running on ${PORT}`));
