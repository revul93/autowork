const SendAuthCode = async (user) => {
  const { Employee } = require('../db/models');
  const employee = await Employee.findByPk(user.employee_id);
  const email = employee.email;
  console.log(`Auth code sent to ${email}: ${user.auth_code}`);
};

const SendUserLoginInfo = (user) => {
  console.log(`username: ${user.username} | password: ${user.password}`);
};

module.exports = { SendAuthCode, SendUserLoginInfo };
