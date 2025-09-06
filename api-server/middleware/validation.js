const validateUserData = (req, res, next) => {
  const { name, email, password, role } = req.body;
  const errors = [];

  // Required field validation
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters long');
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    errors.push('Valid email is required');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password is required and must be at least 6 characters long');
  }

  if (!role || !['student', 'faculty', 'admin'].includes(role)) {
    errors.push('Valid role is required (student, faculty, or admin)');
  }

  // Optional field validation
  if (req.body.studentId && typeof req.body.studentId !== 'string') {
    errors.push('Student ID must be a string');
  }

  if (req.body.year && (typeof req.body.year !== 'number' || req.body.year < 1 || req.body.year > 4)) {
    errors.push('Year must be a number between 1 and 4');
  }

  if (req.body.phone && typeof req.body.phone !== 'string') {
    errors.push('Phone must be a string');
  }

  if (req.body.department && typeof req.body.department !== 'string') {
    errors.push('Department must be a string');
  }

  if (req.body.address && typeof req.body.address !== 'string') {
    errors.push('Address must be a string');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }

  next();
};

const validateUserUpdateData = (req, res, next) => {
  const allowedFields = ['name', 'email', 'role', 'studentId', 'department', 'year', 'phone', 'address', 'isActive'];
  const errors = [];

  // Check for invalid fields
  const invalidFields = Object.keys(req.body).filter(field => !allowedFields.includes(field));
  if (invalidFields.length > 0) {
    errors.push(`Invalid fields: ${invalidFields.join(', ')}`);
  }

  // Validate individual fields if provided
  if (req.body.name && (typeof req.body.name !== 'string' || req.body.name.trim().length < 2)) {
    errors.push('Name must be at least 2 characters long');
  }

  if (req.body.email && (typeof req.body.email !== 'string' || !req.body.email.includes('@'))) {
    errors.push('Valid email is required');
  }

  if (req.body.role && !['student', 'faculty', 'admin'].includes(req.body.role)) {
    errors.push('Role must be student, faculty, or admin');
  }

  if (req.body.studentId && typeof req.body.studentId !== 'string') {
    errors.push('Student ID must be a string');
  }

  if (req.body.year && (typeof req.body.year !== 'number' || req.body.year < 1 || req.body.year > 4)) {
    errors.push('Year must be a number between 1 and 4');
  }

  if (req.body.phone && typeof req.body.phone !== 'string') {
    errors.push('Phone must be a string');
  }

  if (req.body.department && typeof req.body.department !== 'string') {
    errors.push('Department must be a string');
  }

  if (req.body.address && typeof req.body.address !== 'string') {
    errors.push('Address must be a string');
  }

  if (req.body.isActive && typeof req.body.isActive !== 'boolean') {
    errors.push('isActive must be a boolean');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }

  next();
};

const validatePaginationParams = (req, res, next) => {
  const { page, limit } = req.query;
  const errors = [];

  if (page && (isNaN(page) || parseInt(page) < 1)) {
    errors.push('Page must be a positive integer');
  }

  if (limit && (isNaN(limit) || parseInt(limit) < 1 || parseInt(limit) > 100)) {
    errors.push('Limit must be a positive integer between 1 and 100');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Invalid pagination parameters',
      details: errors
    });
  }

  next();
};

module.exports = {
  validateUserData,
  validateUserUpdateData,
  validatePaginationParams
};
