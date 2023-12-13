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
  selectedSortOption: string = ""; // Pour stocker l'attribut sélectionné dans la liste déroulante du tri

  selectedFilterOption: string = ""; // Pour stocker l'attribut sélectionné dans la liste déroulante du filtre
  selectedFilterOperator: string = ""; // Pour stocker l'opérateur sélectionné dans la liste déroulante du filtre
  selectedFilterValue: string = ""; // Pour stocker la valeur sélectionnée dans la liste déroulante du filtre
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

  // Fonction pour trier les armes en fonction de l'attribut renseigné
  // (note : si l'utilisateur passe par goBack après avoir cliqué sur une arme, cela appellera la base de donnée
  // et donc le tri sera perdu)
  // @ts-ignore
  sortWeapons(sort: string) {
    console.log("Liste des armes: " + this.weapons);
    if (sort == "name") {
      this.weapons.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort == "attack") {
      this.weapons.sort((a, b) => b.attack - a.attack);
    } else if (sort == "evasion") {
      this.weapons.sort((a, b) => b.evasion - a.evasion);
    } else if (sort == "damage") {
      this.weapons.sort((a, b) => b.damage - a.damage);
    } else if (sort == "health") {
      this.weapons.sort((a, b) => b.health - a.health);
    }
    else {
      this.weapons.slice(); // Retourner une copie du tableau pour éviter de modifier l'original
    }
  }

  // Fonction pour filtrer les armes en fonction de l'attribut, de l'opérateur et de la valeur renseignés
  // (note : si l'utilisateur passe par goBack après avoir cliqué sur une arme, cela appellera la base de donnée
  // et donc le filtre sera perdu)
  filterWeapons() {
    const filterValue = parseInt(this.selectedFilterValue);
    if (this.selectedFilterOption == "attack") {
      if (this.selectedFilterOperator == ">" && this.selectedFilterValue) {
        this.weapons = this.weapons.filter(weapon => weapon.attack > filterValue);
      } else if (this.selectedFilterOperator == "<" && this.selectedFilterValue) {
        this.weapons = this.weapons.filter(weapon => weapon.attack < filterValue);
      } else if (this.selectedFilterOperator == "=" && this.selectedFilterValue) {
        this.weapons = this.weapons.filter(weapon => weapon.attack == filterValue);
      }
    }
    else if (this.selectedFilterOption == "evasion") {
      if (this.selectedFilterOperator == ">" && this.selectedFilterValue) {
        this.weapons = this.weapons.filter(weapon => weapon.evasion > filterValue);
      } else if (this.selectedFilterOperator == "<" && this.selectedFilterValue) {
        this.weapons = this.weapons.filter(weapon => weapon.evasion < filterValue);
      } else if (this.selectedFilterOperator == "=" && this.selectedFilterValue) {
        this.weapons = this.weapons.filter(weapon => weapon.evasion == filterValue);
      }
    }
    else if (this.selectedFilterOption == "damage") {
      if (this.selectedFilterOperator == ">" && this.selectedFilterValue) {
        this.weapons = this.weapons.filter(weapon => weapon.damage > filterValue);
      } else if (this.selectedFilterOperator == "<" && this.selectedFilterValue) {
        this.weapons = this.weapons.filter(weapon => weapon.damage < filterValue);
      } else if (this.selectedFilterOperator == "=" && this.selectedFilterValue) {
        this.weapons = this.weapons.filter(weapon => weapon.damage == filterValue);
      }
    }
    else if (this.selectedFilterOption == "health") {
      if (this.selectedFilterOperator == ">" && this.selectedFilterValue) {
        this.weapons = this.weapons.filter(weapon => weapon.health > filterValue);
      } else if (this.selectedFilterOperator == "<" && this.selectedFilterValue) {
        this.weapons = this.weapons.filter(weapon => weapon.health < filterValue);
      } else if (this.selectedFilterOperator == "=" && this.selectedFilterValue) {
        this.weapons = this.weapons.filter(weapon => weapon.health == filterValue);
      }
    }
    else {
      this.weapons.slice(); // Retourne une copie du tableau pour éviter de modifier l'original
    }
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
