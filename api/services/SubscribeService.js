module.exports = {
  getQuery(inputs) {
    let data = {
      CID: 281897723,
      SID: '',
      UID: '',
      f: 5205,
      p: 2,
      a: 'r',
      el: '',
      endlink: '',
      llid: '',
      c: '',
      counted: '',
      RID: '',
      mailnow: '',
    };

    let fields = {
      inp_1: inputs.firstName,
      inp_2: inputs.lastName,
      inp_3: inputs.email,
      optin: inputs.privacy ? 'y' : 'n'
    };

    let result = _.assign({}, data, fields);

    return result;
  }
};
