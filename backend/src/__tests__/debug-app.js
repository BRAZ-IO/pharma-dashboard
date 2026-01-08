const { app } = require('../app');

console.log('App loaded successfully:', typeof app);
console.log('App has listen method:', typeof app.listen);
console.log('App has use method:', typeof app.use);

module.exports = { app };
