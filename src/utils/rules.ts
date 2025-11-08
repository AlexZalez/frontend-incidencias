const email = (value: string) => {
  return /.+@.+\..+/.test(value) || "Ingrese un correo valido"
}

const required = (value: any) => {
  return !!value || "Este campo es requerido"
}

export default {
  email,
  required,
}
