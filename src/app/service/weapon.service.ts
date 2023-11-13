import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  updateDoc
} from "@angular/fire/firestore";
import {map, Observable} from "rxjs";
import {DocumentData} from "rxfire/firestore/interfaces";
import {Weapon} from "../data/weapon";

@Injectable({
  providedIn: 'root'
})
export class WeaponService {

  // URL d'accès aux documents sur Firebase
  private static url = 'weapons';

  constructor(private firestore: Firestore) {
  }

  getWeapons(): Observable<Weapon[]> {

    // get a reference to the user-profile collection
    const weaponCollection = collection(this.firestore, WeaponService.url);

    ///////////
    // Solution 1 : Transformation en une liste d'objets "prototype" de type Weapon
    // get documents (data) from the collection using collectionData
    //return collectionData(weaponCollection, { idField: 'id' }) as Observable<Weapon[]>;

    ///////////
    // Solution 2 : Transformation en une liste d'objets de type Weapon
    return collectionData(weaponCollection, { idField: 'id' }).pipe(
      map( (documents) => documents.map((weaponDocumentData) => {
        return WeaponService.transformationToWeapon(weaponDocumentData);
      }))) as Observable<Weapon[]>;
  }

  getWeapon(id: string): Observable<Weapon> {
    // Récupération du DocumentReference
    const weaponDocument = doc(this.firestore, WeaponService.url + "/" + id);

    ///////////
    // Solution 1 : Transformation en un objet "prototype" de type Weapon
    // get documents (data) from the collection using collectionData
    //return docData(weaponDocument, { idField: 'id' }) as Observable<Weapon>;

    ///////////
    // Solution 2 : Transformation en un objet de type Hero
    return docData(weaponDocument, { idField: 'id' }).pipe(     // Ajout de l'id dans le document data
      map( (weaponDocumentData) => {
        return WeaponService.transformationToWeapon(weaponDocumentData);
      })) as Observable<Weapon>;
  }

  addWeapon(weaponParam: Weapon): Promise<Weapon> {

    let weapon: Weapon = new Weapon();
    // get a reference to the hero collection
    const weaponCollection = collection(this.firestore, WeaponService.url);

    let weaponPromise: Promise<Weapon> = new Promise( (resolve, reject) => {
      addDoc(weaponCollection, WeaponService.transformationToJSON(weapon)).then(
        weaponDocument => { // success
          weapon.id = weaponDocument.id; // Récupération de l'id venant de firebase
          resolve(weapon);
        },
        msg => { // error
          reject(msg);
        });
    });

    //
    return weaponPromise;
  }

  updateWeapon(weapon: Weapon): Promise<void> {

    // Récupération du DocumentReference
    const weaponDocument = doc(this.firestore, WeaponService.url + "/" + weapon.id);

    // Update du document à partir du JSON et du documentReference
    return updateDoc(weaponDocument, WeaponService.transformationToJSON(weapon));
  }

  deleteWeapon(id: string): Promise<void> {

    // Récupération du DocumentReference
    const weaponDocument = doc(this.firestore, WeaponService.url + "/" + id);

    // Suppression du document
    return deleteDoc(weaponDocument);
  }

  private static transformationToWeapon(weaponDocumentData: DocumentData): Weapon {
    ///////
    // Il est nécessaire de concerver l'id du document dans l'objet de type Weapon
    ///////

    // Solution 1 : création de l'objet de type Weapon "ad hoc"
    //const data: Weapon = weaponDocumentData as Weapon;
    //return new Weapon(data.id, data.name, data.attack, data.evasion, data.damage, data.health);

    // Solution 2 : création de l'objet de type Weapon en utilisant la méthode fromJSON de la classe Weapon
    // Conversion du document data en chaine JSON puis chargment de l'objet par défaut Weapon
    let weaponTmp: Weapon = new Weapon();
    weaponTmp.fromJSON(JSON.stringify(weaponDocumentData));
    return weaponTmp;
  }

  private static transformationToJSON(weapon: Weapon): any {
    ///////
    // Il est nécessaire de concerver l'id du document dans l'objet de type Weapon
    ///////

    // Solution 1 : création de l'objet de type Weapon "ad hoc"
    //let newWeaponJSON = {data.id, data.name, data.attack, data.evasion, data.damage, data.health};

    // Solution 2 : création d'un JSON object en supprimant la propriété id
    let newWeaponJSON = Object.assign({}, weapon);   // Cette solution met l'id dans firebase au niveau du document
    delete newWeaponJSON.id;
    return newWeaponJSON;
  }
}
