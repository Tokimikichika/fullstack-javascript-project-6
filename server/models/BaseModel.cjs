// @ts-check

const { Model, AjvValidator } = require('objection');
const addFormats = require('ajv-formats');

module.exports = class BaseModel extends Model {
  // https://github.com/Vincit/objection.js/issues/2146
  static createValidator() {
    return new AjvValidator({
      onCreateAjv: (ajv) => {
        // @ts-ignore
        addFormats(ajv);
      },
    });
  }

  static get modelPaths() {
    return [__dirname];
  }
};
