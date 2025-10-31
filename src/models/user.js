class User {
  constructor({ id, nombre, correo, telefono, password, fecha, rol, nombreRol } = {}) {
    this.id = id;
    this.nombre = nombre;
    this.correo = correo;
    this.telefono = telefono;
    this.password = password;
    this.fecha = fecha; // JavaScript Date or string
    this.rol = rol;
    this.nombreRol = nombreRol;
  }
}

module.exports = User;
