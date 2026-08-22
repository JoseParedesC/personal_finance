import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import type { Transaction, TransactionInput } from "../../../shared/types/transaction";
import { Category } from "../../../../src/modules/categories/types/category";
import { firebaseDb } from "../../../shared/services/firebase";

export type FirestoreMovimiento = {
  uid: string;
  amount: number;
  category: Category | null,
  type: Transaction["type"];
  description: string;
  date: string;
  createdAt: Timestamp | Date;
  updatedAt?: Timestamp | Date;
};

const MOVIMIENTOS_PATH = (uid: string) => `users/${uid}/movimientos`;

function toTransaction(docSnap: { id: string; data: () => DocumentData | undefined }): Transaction {
  const raw = docSnap.data();
  if (!raw) {
    throw new Error("No se pudo leer el documento de Firestore");
  }

  const data = raw as FirestoreMovimiento;
  const createdAt =
    data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : new Date(data.createdAt).toISOString();
  const updatedAt = data.updatedAt
    ? data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : new Date(data.updatedAt).toISOString()
    : createdAt;

  return {
    id: docSnap.id,
    category: data.category,
    amount: data.amount,
    type: data.type,
    description: data.description,
    date: data.date,
    createdAt,
    updatedAt,
  };
}

export async function getMovimientos(uid: string): Promise<Transaction[]> {
  const movimientosRef = collection(firebaseDb, MOVIMIENTOS_PATH(uid));
  const q = query(movimientosRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => toTransaction(docSnap));
}

export async function createMovimiento(uid: string, input: TransactionInput): Promise<Transaction> {
  const movimientosRef = collection(firebaseDb, MOVIMIENTOS_PATH(uid));
  const payload: FirestoreMovimiento = {
    uid,
    amount: input.amount,
    category: input.category,
    type: input.type,
    description: input.description,
    date: input.date,
    createdAt: serverTimestamp() as unknown as Timestamp,
    updatedAt: serverTimestamp() as unknown as Timestamp,
  };

  console.info("Firestore: creando movimiento", {
    path: MOVIMIENTOS_PATH(uid),
    type: input.type,
    amount: input.amount,
  });
  const docRef = await addDoc(movimientosRef, payload);
  const saved = await getDoc(docRef);

  return toTransaction(saved);
}

export async function updateMovimiento(
  uid: string,
  id: string,
  changes: Partial<TransactionInput>
): Promise<Transaction | null> {
  const ref = doc(firebaseDb, MOVIMIENTOS_PATH(uid), id);
  await updateDoc(ref, {
    ...changes,
    updatedAt: serverTimestamp(),
  });

  const saved = await getDoc(ref);
  return saved.exists() ? toTransaction(saved) : null;
}

export async function deleteMovimiento(uid: string, id: string): Promise<void> {
  const ref = doc(firebaseDb, MOVIMIENTOS_PATH(uid), id);
  await deleteDoc(ref);
}

export async function clearAllMovimientos(uid: string): Promise<void> {
  const movimientosRef = collection(firebaseDb, MOVIMIENTOS_PATH(uid));
  const snapshot = await getDocs(movimientosRef);
  const batch = writeBatch(firebaseDb);

  snapshot.docs.forEach((docSnap) => {
    batch.delete(docSnap.ref);
  });

  if (!snapshot.empty) {
    await batch.commit();
  }
}

export async function importMovimientos(uid: string, transactions: Transaction[]): Promise<Transaction[]> {
  if (!transactions.length) return [];

  const batch = writeBatch(firebaseDb);
  const collectionRef = collection(firebaseDb, MOVIMIENTOS_PATH(uid));

  transactions.forEach((transaction) => {
    const ref = doc(collectionRef);
    batch.set(ref, {
      uid,
      amount: transaction.amount,
      type: transaction.type,
      description: transaction.description,
      date: transaction.date,
      createdAt: Timestamp.fromDate(new Date(transaction.createdAt)),
      updatedAt: Timestamp.fromDate(new Date(transaction.createdAt)),
    });
  });

  await batch.commit();
  return getMovimientos(uid);
}
