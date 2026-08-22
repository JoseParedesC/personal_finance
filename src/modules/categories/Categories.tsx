import { MasterCrud } from "@joseparedesc/master-crud";
import { categoryConfig } from "./config/category.config";
import { firebaseDb } from "../../shared/services/firebase";
import { useAuth } from "../auth/context/AuthContext";

export function Categories() {
  const { user } = useAuth();

  if (!user) return null;

  return <MasterCrud db={firebaseDb} config={categoryConfig} currentUser={user} />;
}