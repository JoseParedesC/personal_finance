import { collection, getDocs, orderBy, query as firestoreQuery } from "firebase/firestore";
import type { MasterSearchFn, MasterSearchParams, MasterSearchResult } from "@joseparedesc/master-components";
import { firebaseDb } from "./firebase";

export function createMasterSelectorService<T>(userId: string): MasterSearchFn<T> {
  return async ({ entity, query, pageSize }: MasterSearchParams): Promise<MasterSearchResult<T>> => {
    const colRef = collection(firebaseDb, "users", userId, entity);
    const snapshot = await getDocs(firestoreQuery(colRef, orderBy("name")));

    const allItems = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as unknown as (T & { name?: string; active?: boolean })[];

    const term = query.trim().toLowerCase();

    const filtered = allItems.filter((item) => {
      const isActive = item.active !== false;
      if (!isActive) return false;
      if (!term) return true;
      return (item.name ?? "").toLowerCase().includes(term);
    });

    const page = filtered.slice(0, pageSize);

    return {
      items: page as T[],
      page: 1,
      pageSize,
      hasNextPage: filtered.length > pageSize,
    };
  };
}