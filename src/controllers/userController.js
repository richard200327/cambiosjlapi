const UserRepository = require('../repositories/userRepository');
const { ApiResponse, ApiResponseSimple } = require('../dto');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

const getAll = async (req, res) => {
  try {
    const users = await UserRepository.getAll();
    return res.status(200).json(ApiResponse(true, 'Usuarios obtenidos exitosamente', users));
  } catch (err) {
    console.error('Error en getAll:', err.message);
    return res.status(500).json(ApiResponse(false, 'Error interno del servidor', null, err.message));
  }
};

const getById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const user = await UserRepository.getById(id);
    if (!user) return res.status(404).json(ApiResponse(false, `Usuario con ID ${id} no encontrado`));
    return res.status(200).json(ApiResponse(true, 'Usuario obtenido exitosamente', user));
  } catch (err) {
    console.error('Error en getById:', err.message);
    return res.status(500).json(ApiResponse(false, 'Error interno del servidor', null, err.message));
  }
};

const create = async (req, res) => {
  try {
    const user = req.body;

    if (!user || !user.correo || !user.nombre || !user.password) {
      return res.status(400).json(ApiResponse(false, 'Datos del usuario inválidos'));
    }

    // Assign fecha if not provided
    if (!user.fecha) user.fecha = new Date();

    const id = await UserRepository.create(user);
    user.id = id;

    return res.status(201).json(ApiResponse(true, 'Usuario creado exitosamente', user));
  } catch (err) {
    console.error('Error en create:', err.message);
    // Duplicate entry code handling can be added by checking err.code === 'ER_DUP_ENTRY'
    return res.status(500).json(ApiResponse(false, 'Error al crear el usuario', null, err.message));
  }
};

const update = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const user = req.body;

    if (!user || id !== user.id) {
      return res.status(400).json(ApiResponseSimple(false, 'El ID del usuario no coincide con la URL'));
    }

    const existing = await UserRepository.getById(id);
    if (!existing) return res.status(404).json(ApiResponseSimple(false, `Usuario con ID ${id} no encontrado`));

    const updated = await UserRepository.update(user);
    if (!updated) return res.status(500).json(ApiResponseSimple(false, 'Error al actualizar el usuario'));

    return res.status(200).json(ApiResponseSimple(true, 'Usuario actualizado exitosamente'));
  } catch (err) {
    console.error('Error en update:', err.message);
    return res.status(500).json(ApiResponseSimple(false, 'Error al actualizar el usuario', err.message));
  }
};

const remove = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const existing = await UserRepository.getById(id);
    if (!existing) return res.status(404).json(ApiResponseSimple(false, `Usuario con ID ${id} no encontrado`));

    const deleted = await UserRepository.delete(id);
    if (!deleted) return res.status(500).json(ApiResponseSimple(false, 'Error al eliminar el usuario'));

    return res.status(200).json(ApiResponseSimple(true, 'Usuario eliminado exitosamente'));
  } catch (err) {
    console.error('Error en delete:', err.message);
    return res.status(500).json(ApiResponseSimple(false, 'Error al eliminar el usuario', err.message));
  }
};

const login = async (req, res) => {
  try {
    const { correo, password } = req.body || {};
    if (!correo || !password) return res.status(400).json(ApiResponse(false, 'Correo y contraseña son requeridos'));

    const user = await UserRepository.login(correo, password);
    if (!user) return res.status(401).json(ApiResponse(false, 'Credenciales inválidas'));

    // build response without password
    const loginResponse = {
      id: user.id,
      nombre: user.nombre,
      correo: user.correo,
      telefono: user.telefono,
      rol: user.rol,
      nombreRol: user.NombreRol || user.nombreRol,
      fecha: user.fecha
    };

  // Sign JWT token
  const payload = { id: user.id, correo: user.correo, rol: user.rol };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  loginResponse.token = token;

    return res.status(200).json(ApiResponse(true, 'Login exitoso', loginResponse));
  } catch (err) {
    console.error('Error en login:', err.message);
    return res.status(500).json(ApiResponse(false, 'Error durante el login', null, err.message));
  }
};

const getByEmail = async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).json(ApiResponse(false, 'El parámetro email es requerido'));

    const user = await UserRepository.getByEmail(email);
    if (!user) return res.status(404).json(ApiResponse(false, `Usuario con email ${email} no encontrado`));

    return res.status(200).json(ApiResponse(true, 'Usuario encontrado exitosamente', user));
  } catch (err) {
    console.error('Error en getByEmail:', err.message);
    return res.status(500).json(ApiResponse(false, 'Error interno del servidor', null, err.message));
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  login,
  getByEmail
};
