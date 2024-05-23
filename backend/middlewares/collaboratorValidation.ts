import { body } from "express-validator";

export const collaboratorValidation = () => {
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
    body("phone")
      .isString()
      .withMessage("O telefone é obrigatório")
      .isLength({min:15, max:15}),
  ];
};