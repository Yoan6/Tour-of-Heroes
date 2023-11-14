import {Component, OnInit} from '@angular/core';
import { Weapon } from "../../data/weapon";
import { WeaponService } from "../../service/weapon.service";
import {first, Observable, Subscription} from "rxjs";

@Component({
  selector: 'app-weapons',
  templateUrl: './weapons.component.html',
  styleUrls: ['./weapons.component.css']
})
export class WeaponsComponent implements OnInit {
  weapon?: Weapon;
  weapons: Weapon[] = [];
  weaponsAysnc?: Observable<Weapon[]>;

  subscriptionGetWeapons?: Subscription;

  constructor(private weaponService: WeaponService) {
  }

  ngOnInit(): void {
    this.getWeapons();
  }

  getWeapons(): void {

    // Subscription "simple"
    this.subscriptionGetWeapons = this.weaponService.getWeapons()
      .subscribe(weapons => this.weapons = weapons);
    this.weaponsAysnc = this.weaponService.getWeapons();
  }

  newWeapon() {
    let weapon = new Weapon();
    this.weaponService.addWeapon(weapon);
  }

  // Désabonnement de l'observable
  unsubscribeGetWeapons(): void {
    this.subscriptionGetWeapons?.unsubscribe();
  }

  /**
   * The ngDestroy is called in a component’s lifecycle just before the instance of the component is finally destroyed.
   * It is the perfect place to clean the component — for example, to cancel background tasks.
   */
  ngOnDestroy(): void {

      // Utilisation du cycle de vie du composant pour unsubscribe
      console.log("Destroy weapons component");
      this.subscriptionGetWeapons?.unsubscribe();
  }
}
