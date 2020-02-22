// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
const mongoose = require("mongoose");

module.exports = (on, config) => {
  on('task', {
    'flush:db': async () => {
      const url = 'mongodb://localhost:27017/purify';
      await mongoose.connect(url)
      await mongoose.connection.collection('users').remove()
      return null
    }
  })
}
