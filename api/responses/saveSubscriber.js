/**
 * saveSubscriber.js
 *
 * A custom response.
 *
 * Example usage:
 * ```
 *     return res.saveSubscriber();
 *     // -or-
 *     return res.saveSubscriber(optionalData);
 * ```
 *
 * Or with actions2:
 * ```
 *     exits: {
 *       somethingHappened: {
 *         responseType: 'saveSubscriber'
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

module.exports = function saveSubscriber(optionalData) {

  // Get access to `req` and `res`
  var req = this.req;
  var res = this.res;

  // Define the status code to send in the response.
  var statusCodeToSet = 200;

  // If no data was provided, use res.sendStatus().
  if (optionalData === undefined) {
    sails.log.info('Ran custom response: res.saveSubscriber()');
    return res.sendStatus(statusCodeToSet);
  }
  // Set status code and send response data.
  else {
    let data = { message: 'thank you! your subscription to our list has been confirmed' };
    return res.status(statusCodeToSet).send(data);
  }

};
