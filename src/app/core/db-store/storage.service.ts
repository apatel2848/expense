
import { format } from 'date-fns';
import { initializeApp } from 'firebase/app';
import { deleteObject, getStorage, getDownloadURL as getStorageDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';

const BUCKET_URL = "gs://expense-tracker-8e80a.appspot.com"

@Injectable({
    providedIn : 'root'
})
export class StorageService {

    private app = initializeApp(environment.firebaseConfig);
    private storage = getStorage(this.app);

    constructor() { }

    async uploadImage(image: any, uid: any, filename: any) {
        const formattedDate = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z");
        const bucket = `${BUCKET_URL}/${uid}/${formattedDate}-${filename}`;
        const storageRef = ref(this.storage, bucket);
        await uploadBytes(storageRef, image);
        return bucket;
    }

    async getDownloadURL(bucket: any) {
        return await getStorageDownloadURL(ref(this.storage, bucket));
    }
} 