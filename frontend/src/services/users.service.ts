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
import { findHistoricAsset } from "./assetsHistoric.service";
import { IUsers } from "../interfaces/IUser.interface";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

export const createUser = async (data: IUsers) => {
  try {
    const save = await addDoc(collection(db, "users"), data);

    const docRef = doc(db, "users", save.id);
    await updateDoc(docRef, { uidUser: save.id });

    return { data: save };
  } catch (error) {
    console.log(getErrorMessage(error));
    return { error: getErrorMessage(error) };
  }
};

export const listAllUsers = async () => {
  try {
    let res: any[] = [];
    const q = query(collection(db, "users"), where("status", "==", true));
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

export const listUsersWithPagination = async (page: number) => {
    try {
      let res: any[] = [];
  
      const q = query(collection(db, "users"));
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

export const deleteUser = async (uid: string) => {
  try {
    const existHistoric = findHistoricAsset("uidUser", uid);

    if(!existHistoric){
      const docRef = doc(db, "users", uid);
      await deleteDoc(docRef);
    }else{
      return {error: "Usuário está relacionado a um ativo e não pode ser excluído."}
    }

    
  } catch (error) {
    console.log(getErrorMessage(error));
    return { error: getErrorMessage(error) };
  }
};

