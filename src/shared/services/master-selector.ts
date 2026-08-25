import type { MasterSearchFn, MasterSearchParams, MasterSearchResult } from "@joseparedesc/master-components";
import { apiFetch } from "./api";

/**
 * Adapta el buscador de `@joseparedesc/master-components` (usado en el
 * selector de categoría del formulario de movimientos) para consultar la
 * API REST propia en vez de Firestore. `entity` (ej: "categories") se usa
 * como segmento de ruta.
 */
export function createMasterSelectorService<T extends { active?: boolean }>(
  _userId: string,
  extraFilter?: (item: T) => boolean
): MasterSearchFn<T> {
  return async ({ entity, query, pageSize }: MasterSearchParams): Promise<MasterSearchResult<T>> => {
    const params = new URLSearchParams({ status: "active" });
    if (query.trim()) params.set("search", query.trim());

    const items = await apiFetch<T[]>(`/${entity}?${params.toString()}`);
    const filtered = extraFilter ? items.filter(extraFilter) : items;
    const page = filtered.slice(0, pageSize);

    return {
      items: page,
      page: 1,
      pageSize,
      hasNextPage: filtered.length > pageSize,
    };
  };
}
