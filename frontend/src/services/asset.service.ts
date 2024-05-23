import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  query,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  limit,
  startAt,
} from "firebase/firestore";
import { IAssets } from "../interfaces/IAssets.interface";
import { findHistoricAsset } from "./assetsHistoric.service";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}


export const createAsset = async (data: IAssets) => {
  try {
    const save = await addDoc(collection(db, "assets"), data);

    const docRef = doc(db, "assets", save.id);
    await updateDoc(docRef, { uidAsset: save.id });

    return { data: save };
  } catch (error) {
    console.log(getErrorMessage(error));
    return { error: getErrorMessage(error) };
  }
};

export const listAll = async () => {
  try {
    let res: any[] = [];
    const q = query(collection(db, "assets"));
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

export const listAllWithPagination = async (page: number) => {
  try {
    let res: any[] = [];

    const q = query(collection(db, "assets"));
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

export const editAsset = async (uid: string, asset: Partial<IAssets>) => {
    try {
      const docRef = doc(db, "assets", uid);
      const update = await updateDoc(docRef, asset);
  
      return { data: update };
    } catch (error) {
      console.log(getErrorMessage(error));
      return { error: getErrorMessage(error) };
    }
  };


export const deleteAsset = async (uid: string) => {
  try {
    const existHistoric = await findHistoricAsset("uidAsset", uid);
    console.log(existHistoric)

    if(!existHistoric){
      const docRef = doc(db, "assets", uid);
      await deleteDoc(docRef);
    }else{
      return {error: "Ativo possui histórico e não pode ser excluído."}
    }

    
  } catch (error) {
    console.log(getErrorMessage(error));
    return { error: getErrorMessage(error) };
  }
};
