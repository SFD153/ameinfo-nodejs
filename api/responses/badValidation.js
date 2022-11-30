/**
 * badValidation.js
 *
 * A custom response.
 *
 * Example usage:
 * ```
 *     return res.badValidation();
 *     // -or-
 *     return res.badValidation(optionalData);
 * ```
 *
 * Or with actions2:
 * ```
 *     exits: {
 *       somethingHappened: {
 *         responseType: 'badValidation'
 *       }
 *     }
 * ```
 *
 * ```
 *     throw 'somethingHappened';
 *     // -or-
 *     throw { somethingHappened: optionalData }
 * ```
 */

module.exports = function badValidation(optionalData) {

  // Get access to `req` and `res`
  var req = this.req;
  var res = this.res;

  // Define the status code to send in the response.
  var statusCodeToSet = 400;

  // If no data was provided, use res.sendStatus().
  if (optionalData === undefined) {
    sails.log.info('Ran custom response: res.badValidation()');
    return res.sendStatus(statusCodeToSet);
  }
  // Set status code and send response data.
  else {
    let data = {
      code: 'E_VALIDATION',
      message: 'validation error',
      details: optionalData.details.map(detail => detail.message),
    };

    return res.status(statusCodeToSet).send(data);
  }

};
