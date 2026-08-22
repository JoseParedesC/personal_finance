import { z } from "zod";
import type { MasterCrudConfig } from "@joseparedesc/master-crud";
import type { Category } from "../types/category";

export const categoryConfig: MasterCrudConfig<Category> = {
  collection: "categories",
  title: "Categorías",
  singularTitle: "Categoría",
  codeField: "code",
  nameField: "name",
  searchableFields: ["code", "name"],
  columns: [
    { field: "code", label: "Código" },
    { field: "name", label: "Nombre" },
    {
      field: "movementType",
      label: "Tipo de movimiento",
      render: (value) => value === "income" ? "Ingreso" : "Egreso",
    },
    {
      field: "active",
      label: "Estado",
      render: (value) => value ? "Activo" : "Inactivo",
    },
  ],
  formFields: [
    { name: "code", label: "Código", type: "text", required: true, disabledOnEdit: true, placeholder: "Ej: ALIM" },
    { name: "name", label: "Nombre", type: "text", required: true, placeholder: "Ej: Alimentación" },
    {
      name: "movementType",
      label: "Tipo de movimiento",
      type: "select",
      required: true,
      options: [
        { value: "income", label: "Ingreso" },
        { value: "expense", label: "Egreso" },
      ],
    },
    {
      name: "color",
      label: "Color",
      type: "color",
      required: true,
      placeholder: "#4ADE80",
      helperText: "Elige el color con el que se identificará esta categoría.",
    },
  ],
  allowDelete: false,
  allowDeactivate: true,
  validationSchema: z.object({
    code: z.string().trim().min(1, "El código es obligatorio").max(20),
    name: z.string().trim().min(1, "El nombre es obligatorio").max(80),
    movementType: z.enum(["income", "expense"]),
  }),
};