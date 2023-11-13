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
import {Hero} from "../data/hero";

@Injectable({
  providedIn: 'root'
})
export class HerointerfaceService {

  // URL d'accès aux documents sur Firebase
  private static url = 'heroes';

  constructor(private firestore: Firestore) {
  }

  getHeroes(): Observable<Hero[]> {

    // get a reference to the hero collection
    const heroCollection = collection(this.firestore, HerointerfaceService.url);

    ///////////
    // Solution 1 : Transformation en une liste d'objets "prototype" de type Hero
    // get documents (data) from the collection using collectionData
    return collectionData(heroCollection, { idField: 'id' }) as Observable<Hero[]>;
  }

  getHero(id: string): Observable<Hero> {

    // Récupération du DocumentReference
    const heroDocument = doc(this.firestore, HerointerfaceService.url + "/" + id);

    ///////////
    // Solution 1 : Transformation en un objet "prototype" de type Hero
    // get documents (data) from the collection using collectionData
    return docData(heroDocument, { idField: 'id' }) as Observable<Hero>;
  }

  deleteHero(id: string): Promise<void> {

    // Récupération du DocumentReference
    const heroDocument = doc(this.firestore, HerointerfaceService.url + "/" + id);

    //
    return deleteDoc(heroDocument);
  }

  addHero(hero: Hero): void {

    // get a reference to the hero collection
    const heroCollection = collection(this.firestore, HerointerfaceService.url);

    //
    addDoc(heroCollection, hero);
  }

  updateHero(hero: Hero): void {

    // Récupération du DocumentReference
    const heroDocument = doc(this.firestore, HerointerfaceService.url + "/" + hero.id);

    // Update du document à partir du JSON et du documentReference
    let newHeroJSON = {name: hero.name, attaque: hero.attack, esquive: hero.evasion, degats: hero.damage, PV: hero.health};
    updateDoc(heroDocument, newHeroJSON);
  }
}
