import { body } from "express-validator";

export const assetValidation = () => {
  return [
    body("idClient").isString().withMessage("O id é obrigatório."),
    body("description").isString().withMessage("Descrição é obrigatória"),
    body("purchaseDate")
      .isISO8601()
      .withMessage("Data de compra é obrigatória"),
    body("closingGuarantee")
      .isISO8601()
      .withMessage("Data de garantia é obrigatória"),
    body("supplier").isString().withMessage("Descrição é obrigatória"),
    body("canAllocated")
      .isString()
      .withMessage("Campo pode ser alocado é obrigatório"),
  ];
};
