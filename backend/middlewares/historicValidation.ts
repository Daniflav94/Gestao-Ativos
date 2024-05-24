import { body } from "express-validator";

export const historicValidation = () => {
  return [
    body("dateRegister")
      .isISO8601()
      .withMessage("Data da ocorrência é obrigatória"),
      body("status")
      .isString()
      .withMessage("Status é obrigatório"),
      body("assetId")
      .isString()
      .withMessage("Ativo é obrigatório"),
   
  ];
};
