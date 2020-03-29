const mongoose = require('mongoose');

module.exports = (on, config) => {
  on('task', require('@cypress/code-coverage/task'));
};
