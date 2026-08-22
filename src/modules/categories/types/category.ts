import type { MasterEntity } from "@joseparedesc/master-crud";

export type MovementType = "income" | "expense";

export interface Category extends MasterEntity {
  movementType: MovementType;
}

export type CategoryInput = Omit<Category, "id" | "createdAt" | "createdBy" | "updatedAt" | "updatedBy">;
