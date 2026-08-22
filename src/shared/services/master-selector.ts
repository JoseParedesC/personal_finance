import { MasterSearchParams, MasterSearchResult  } from "@joseparedesc/master-components";


export const MasterSelectorService = async <T>({
  entity,
  query,
  page,
  pageSize,
}: MasterSearchParams): Promise<MasterSearchResult<T>> => {
  const response = await fetch(
    `/api/${entity}?search=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}`
  );

  if (!response.ok) {
    throw new Error(`Error searching ${entity}`);
  }

  const result: MasterSearchResult<T> = await response.json();

  return {
    ...result,
    items: result.items.filter((item: T) => (item as T & { active: boolean }).active === true),
  };
};