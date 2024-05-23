import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  query,
  getDocs,
  doc,
  updateDoc,
  limit,
  where,
  orderBy,
} from "firebase/firestore";
import { IAssets } from "../interfaces/IAssets.interface";
import { IAssetsHistoric } from "../interfaces/IAssetsHistoric.interface";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

export const createAssetHistoric = async (data: IAssetsHistoric) => {
  try {
    const save = await addDoc(collection(db, "assetsHistoric"), data);

    const docRef = doc(db, "assetsHistoric", save.id);
    await updateDoc(docRef, { uid: save.id });

    return { data: save };
  } catch (error) {
    console.log(getErrorMessage(error));
    return { error: getErrorMessage(error) };
  }
};

export const findHistoricAsset = async (key: string, value: string) => {
  try {
    let res: any[] = [];
    const q = query(collection(db, "assetsHistoric"), where(key, "==", value));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((item) => {
      res.push(item.data());
    });

    if (res.length > 0) {
      return { data: res };
    } else {
      return null;
    }
  } catch (error) {
    console.log(getErrorMessage(error));
    return { error: getErrorMessage(error) };
  }
};

export const listAllHistoricAssets = async () => {
  try {
    let res: any[] = [];
    const q = query(collection(db, "assetsHistoric"));
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

export const listLastHistoric = async () => {
  try {
    let res: any[] = [];
    const q = query(
      collection(db, "assetsHistoric"),
      orderBy("createdAt", "desc"),
      limit(10)
    );
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

export const editRegisterHistoric = async (uid: string, asset: Partial<IAssets>) => {
  try {
    const docRef = doc(db, "assetsHistoric", uid);
    const update = await updateDoc(docRef, asset);

    return { data: update };
  } catch (error) {
    console.log(getErrorMessage(error));
    return { error: getErrorMessage(error) };
  }
};
