// src/shared/services/master-selector.ts
import {
  collection,
  query as fsQuery,
  orderBy,
  startAt,
  endAt,
  limit,
  getDocs,
} from "firebase/firestore";
import { MasterSearchParams, MasterSearchResult } from "@joseparedesc/master-components";
import { firebaseDb } from "./firebase";

export const MasterSelectorService = async <T>({
  entity,
  query: searchTerm,
  page,
  pageSize,
}: MasterSearchParams): Promise<MasterSearchResult<T>> => {
  // "entity" es la colección de Firestore, no una ruta REST
  const colRef = collection(firebaseDb, entity);

  const q = fsQuery(
    colRef,
    orderBy("name"),
    startAt(searchTerm),
    endAt(searchTerm + "\uf8ff"),
    limit(pageSize)
  );

  const snapshot = await getDocs(q);
  const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as T[];

  return {
    items: items.filter((item) => (item as T & { active?: boolean }).active !== false),
    page,
    pageSize,
    hasNextPage: items.length === pageSize,
  };
};