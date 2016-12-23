const moment = require('moment');

function validateStringLength(text, limit) {
  let errorMessage = '';
  if (text.trim().length > limit) {
    errorMessage = `* Cannot be more than ${limit} characters`;
  } else if (text.trim().length <= 0) {
    errorMessage = '* Cannot be empty';
  } else {
    errorMessage = '';
  }
  return errorMessage;
}

function generateMessage(from, body) {
  return {
    from,
    body,
    createdAt: moment().valueOf(),
  };
}

function generateLocationMessage(from, lat, lng) {
  return {
    from,
    url: `https://www.google.com/maps?q=${lat},${lng}`,
    createdAt: moment().valueOf(),
  };
}

function isRealString(str) {
  return typeof str === 'string' && str.trim().length > 0;
}


module.exports = {
  validateStringLength,
  generateMessage,
  generateLocationMessage,
  isRealString,
};
