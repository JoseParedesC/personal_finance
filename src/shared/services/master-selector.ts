import {
  collection,
  endAt,
  getDocs,
  limit,
  orderBy,
  query as firestoreQuery,
  startAt,
} from "firebase/firestore";
import type { MasterSearchFn, MasterSearchParams, MasterSearchResult } from "@joseparedesc/master-components";
import { firebaseDb } from "./firebase";

export function createMasterSelectorService<T>(userId: string): MasterSearchFn<T> {
  return async ({ entity, query, pageSize }: MasterSearchParams): Promise<MasterSearchResult<T>> => {
    const colRef = collection(firebaseDb, "users", userId, entity);

    const trimmed = query.trim();
    const constraints = trimmed
      ? [orderBy("name"), startAt(trimmed), endAt(trimmed + "\uf8ff"), limit(pageSize)]
      : [orderBy("name"), limit(pageSize)];

    const snapshot = await getDocs(firestoreQuery(colRef, ...constraints));

    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];

    return {
      items: items.filter((item) => (item as T & { active?: boolean }).active !== false),
      page: 1,
      pageSize,
      hasNextPage: items.length === pageSize,
    };
  };
}