const GetToken = async (user) => {
  const { Employee, Role } = require('../db/models');
  const nconf = require('nconf');
  const JWT_KEY =
    process.env.JWT_KEY || require('crypto').randomBytes(64).toString('Hex');
  const TOKEN_TTL = parseInt(process.env.TOKEN_TTL) || 172800;
  const jwt = require('jsonwebtoken');
  let employee,
    role = null;
  try {
    user.employee_id && (employee = await Employee.findByPk(user.employee_id));
    employee && (role = await Role.findByPk(employee.role_id));
  } catch (error) {
    console.error(error);
  }
  if (user.id === (await nconf.get('ADMIN_UUID'))) {
    return jwt.sign(
      {
        user_id: user.id,
        employee_name: 'SYSTEM ADMIN',
      },
      JWT_KEY,
      { expiresIn: TOKEN_TTL },
    );
  }

  return jwt.sign(
    {
      user_id: user.id,
      employee_id: employee?.id,
      role_id: role?.id,
      employee_name: employee?.name,
      role_title: role?.title,
    },
    JWT_KEY,
    {
      expiresIn: TOKEN_TTL,
    },
  );
};

module.exports = { GetToken };
