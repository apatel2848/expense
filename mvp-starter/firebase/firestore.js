/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, setDoc, where } from 'firebase/firestore';
import { db } from './firebase';
import { getDownloadURL } from './storage';
import dashboardTableData from '../assets/dashboard-table-data.json';
import locationData from '../assets/location.json';
import purchaseData from '../assets/purchase.json';
import salesData from '../assets/sales.json';
import targetData from '../assets/target.json';


const RECEIPTS_COLLECTION = 'receipts';

export function addReceipt(uid, date, locationName, address, items, amount, imageBucket) {
    addDoc(collection(db, RECEIPTS_COLLECTION), { uid, date, locationName, address, items, amount, imageBucket });
}

export async function getReceipts(uid) {
    const receipts = query(collection(db, RECEIPTS_COLLECTION), orderBy("date", "desc"));
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

function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if (d > 0) {//Use timestamp until depleted
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}


export function getLocationData(uid) {

    const location = locationData;
    location.id = "301556";
    location.name = "Brton";

    const sales = salesData;
    sales.id = generateUUID();
    sales.locationID = location.id;
    sales.netSales = 24242.57;

    const purchase = purchaseData;
    purchase.dcp = 4460.68;
    purchase.donut = 1242.49;
    purchase.pepsi = 0;

    const target = targetData;
    target.locationID = location.id;
    target.dcp = 17;
    target.donut = 6.5;
    target.pepsi = 0.5;

    const percentageDcp = ((sales.netSales / purchase.dcp) * 100).toFixed(2);
    const percentageDonut = ((sales.netSales / purchase.donut) * 100).toFixed(2);
    const percentagePepsi = ((sales.netSales / purchase.pepsi) * 100).toFixed(2);

    const diffOfDcp = target.dcp - percentageDcp;
    const diffOfDonut = target.donut - percentageDonut;
    const diffOfPepsi = target.pepsi - percentagePepsi;
    const totFoodCost = sales.netSales - purchase.donut;

    let allLocations = {
        "rowNames":["Weekly Net Sales",
                    "Dcp Amount Purchase","% of DCP","Target DCP","Difference Of DCP",
                    "Donut Purchase","% of Donut","Target Donut","Difference Of Donut",
                    "Pepsi Purchase","% of Pepsi","Target Pepsi","Difference Of Pepsi",
                    "Total Food Cost"
                ],
        "locations": [],
        "percentageDcp": percentageDcp,
        "percentageDonut": percentageDonut,
        "percentagePepsi": percentagePepsi,
        "diffOfDcp": diffOfDcp,
        "diffOfDonut": diffOfDonut,
        "diffOfPepsi": diffOfPepsi,
        "totFoodCost": totFoodCost
    };

    allLocations.locations.push({
        "location": location,
        "sales": sales,
        "purchase": purchase,
        "target": target,
    });

    console.log('allLocations', allLocations);
    return allLocations;
}


export function getReceiptFromJson(uid) {
    return dashboardTableData;
}

