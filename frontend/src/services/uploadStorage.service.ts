import { storage } from "../firebase/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export async function upload(file: Blob, filename: string) {
  try {
    const storageRef = ref(storage, 'files/' + filename);
  
    const response = uploadBytes(storageRef, file);
  
    return getDownloadURL((await response).ref);
    
  } catch (error) {
    console.log(error);
  }
}