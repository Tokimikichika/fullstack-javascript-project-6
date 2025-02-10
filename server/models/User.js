// @ts-check

import { Model } from 'objection';
import objectionUnique from 'objection-unique';
import bcrypt from 'bcrypt';

const unique = objectionUnique({ fields: ['email'] });

export default class User extends unique(Model) {
  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['firstName', 'lastName', 'email', 'password'],
      properties: {
        id: { type: 'integer' },
        firstName: { type: 'string', minLength: 1 },
        lastName: { type: 'string', minLength: 1 },
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 3 },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
      },
    };
  }

  async $beforeInsert() {
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
    if (this.password) {
      this.passwordDigest = await bcrypt.hash(this.password, 10);
    }
  }

  async $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
    if (this.password) {
      this.passwordDigest = await bcrypt.hash(this.password, 10);
    }
  }

  verifyPassword(password) {
    return bcrypt.compare(password, this.passwordDigest);
  }
} 