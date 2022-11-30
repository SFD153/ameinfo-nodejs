/**
 * itemExist.js
 *
 * A custom response.
 *
 * Example usage:
 * ```
 *     return res.itemExist();
 *     // -or-
 *     return res.itemExist(optionalData);
 * ```
 *
 * Or with actions2:
 * ```
 *     exits: {
 *       somethingHappened: {
 *         responseType: 'itemExist'
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

module.exports = function itemExist(optionalData) {

  // Get access to `req` and `res`
  var req = this.req;
  var res = this.res;

  // Define the status code to send in the response.
  var statusCodeToSet = 400;

  // If no data was provided, use res.sendStatus().
  if (optionalData === undefined) {
    sails.log.info('Ran custom response: res.itemExist()');
    return res.sendStatus(statusCodeToSet);
  }
  // Set status code and send response data.
  else {
    let data = {
      code: 'E_UNIQUE',
      message: optionalData,
      details: [],
    };

    return res.status(statusCodeToSet).send(data);
  }

};
