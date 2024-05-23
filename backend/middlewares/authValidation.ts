import { body } from "express-validator";

export const userCreateValidation = () => {
  return [
    body("name")
      .isString()
      .withMessage("O nome é obrigatório.")
      .isLength({ min: 6 })
      .withMessage("Insira o nome completo."),
    body("email")
      .isString()
      .withMessage("O email é obrigatório")
      .isEmail()
      .withMessage("Insira um email válido"),
    body("password")
      .isString()
      .withMessage("A senha é obrigatória")
      .isLength({ min: 6 })
      .withMessage("A senha precisa ter no mínimo 6 caracteres"),
    body("phone")
      .isString()
      .withMessage("O telefone é obrigatório")
      .isLength({min:15, max:15}),
    body("type").isString().withMessage("Tipo é obrigatório"),
  ];
};

export const loginValidation = () => {
    return [
      body("email")
      .isString()
      .withMessage("O email é obrigatório")
      .isEmail()
      .withMessage("Insira um email válido"),
      body("password")
        .isString()
        .withMessage("A senha é obrigatória")
    ]
  }