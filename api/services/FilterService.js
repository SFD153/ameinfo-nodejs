const moment = require('moment');
module.exports = {
  dateRange(startDate, endDate) {
    let filter = {
      'year': moment().year(),
      'month': moment().month(),
      'day': { $gte: 1 },
    };

    if(!_.isEmpty(startDate) && !_.isEmpty(endDate)) {
      startDate = startDate.split('-').map(date => Number(date));
      endDate = endDate.split('-').map(date => Number(date));
      filter = {
        'year': { $gte: startDate[0], $lte: endDate[0] },
        'month': { $gte: startDate[1], $lte: endDate[1] },
        'day': { $gte: startDate[2], $lte: endDate[2] }
      };
    }

    return filter;
  }
};
