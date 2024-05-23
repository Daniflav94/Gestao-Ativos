import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  query,
  getDocs,
  doc,
  updateDoc,
  where,
  deleteDoc,
  startAt,
  limit,
} from "firebase/firestore";
import { ICollaborators } from "../interfaces/ICollaborators.interface";
import { findHistoricAsset } from "./assetsHistoric.service";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

export const createCollaborator = async (data: ICollaborators) => {
  try {
    const save = await addDoc(collection(db, "collaborators"), data);

    const docRef = doc(db, "collaborators", save.id);
    await updateDoc(docRef, { uidCollaborator: save.id });

    return { data: save };
  } catch (error) {
    console.log(getErrorMessage(error));
    return { error: getErrorMessage(error) };
  }
};

export const listAllCollaborators = async () => {
  try {
    let res: any[] = [];
    const q = query(collection(db, "collaborators"), where("status", "==", true));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((item) => {
      res.push(item.data());
    });

    return { data: res, total: querySnapshot.size };
  } catch (error) {
    console.log(getErrorMessage(error));
    return { error: getErrorMessage(error) };
  }
};

export const listCollaboratorsWithPagination = async (page: number) => {
  try {
    let res: any[] = [];

    const q = query(collection(db, "collaborators"));
    const firstSnapshot = await getDocs(q);

    if (firstSnapshot.size > 0) {
      const lastVisible = firstSnapshot.docs[page * 8];

      const next = query(
        collection(db, "assets"),
        startAt(lastVisible),
        limit(8)
      );

      const querySnapshot = await getDocs(next);

      querySnapshot?.forEach((item) => {
        res.push(item.data());
      });

      return { data: res, total: firstSnapshot.size };
    } else {
      return { data: undefined, total: 0 };
    }
  } catch (error) {
    console.log(getErrorMessage(error));
    return { error: getErrorMessage(error) };
  }
};

export const deleteCollaborator = async (uid: string) => {
  try {
    const existHistoric = findHistoricAsset("uidCollaborator", uid);

    if(!existHistoric){
      const docRef = doc(db, "collaborators", uid);
      await deleteDoc(docRef);
    }else{
      return {error: "Colaborador está relacionado a um ativo e não pode ser excluído."}
    }

    
  } catch (error) {
    console.log(getErrorMessage(error));
    return { error: getErrorMessage(error) };
  }
};

