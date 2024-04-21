import { Injectable } from "@angular/core";
import { collection, getDocs, getFirestore, orderBy, query } from "firebase/firestore";
import { FireTable } from "../constants/tables"
import { environment } from "../../../environments/environment";
import { initializeApp } from "firebase/app"; 
import { getDownloadURL } from "firebase/storage";

@Injectable({
    providedIn: 'root',
})
export class DBStore {

    private app = initializeApp(environment.firebaseConfig);
    private db = getFirestore(this.app);

    async getUsers(): Promise<any[]> {
        const users = query(collection(this.db, FireTable.USERS_COLLECTION));
        const querySnapshot = await getDocs(users);

        let allUsers: any[] = [];
        querySnapshot.docs.forEach(async element => {
            const user = element.data()
            await allUsers.push({
                ...user,
                id: element.id
            })
        });

        return allUsers
    }

    async getReceipts(uid: any) {
        const receipts = query(collection(this.db, FireTable.RECEIPTS_COLLECTION), orderBy("date", "desc"));
        const querySnapshot = await getDocs(receipts);

        let allReceipts = [];
        for (const documentSnapshot of querySnapshot.docs) {
            const receipt = documentSnapshot.data();
            await allReceipts.push({
                ...receipt,
                date: receipt['date'].toDate(),
                id: documentSnapshot.id,
                imageUrl: await getDownloadURL(receipt['imageBucket'])
            })
        }
        console.log('121313', allReceipts)
        return allReceipts;
    }
}