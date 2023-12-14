import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Hero} from "../../data/hero";
import {HeroService} from "../../service/hero.service";
import {Observable} from "rxjs";
import {WeaponService} from "../../service/weapon.service";
import {Weapon} from "../../data/weapon";

@Component({
  selector: 'app-fight',
  templateUrl: './fight.component.html',
  styleUrls: ['./fight.component.css']
})
export class FightComponent implements OnInit {
    heroes: Hero[] = [];
    weapons: Weapon[] = [];
    selectedHero1: Hero | undefined; // Pour le match de héro
    selectedHero2: Hero | undefined; // Pour le match de héro
    heroesAysnc?: Observable<Hero[]>;
    subscriptionGetHeroes?: any;
    fight: boolean = false;
    fight_details: [string] = [""];

    constructor(
      private heroService: HeroService,
      private router: Router,
      private weaponService: WeaponService,
    ) {}

    ngOnInit(): void {
        this.getHeroes();
    }

    getHeroes(): void {
      // Subscription "simple"
      this.subscriptionGetHeroes = this.heroService.getHeroes()
        .subscribe(heroes => this.heroes = heroes);
      this.heroesAysnc = this.heroService.getHeroes();
      this.getWeapons();
    }

    getWeapons(): void {
    this.weaponService.getWeapons()
      .subscribe(weapons => {
        this.weapons = weapons;
      });
  }

    // Affiche les héros pour le combat
    initHeroes() {
      if (this.selectedHero1 != null && this.selectedHero2 != null && this.selectedHero1 != this.selectedHero2) {
        this.fight = true;
        this.selectedHero1 = this.heroes.find(hero => hero.id === this.selectedHero1);
        this.selectedHero2 = this.heroes.find(hero => hero.id === this.selectedHero2);
        // Pour les 2 héros, on leut ajoute les bonus des attributs de l'arme qu'ils ont équipé
        // @ts-ignore
        if (this.selectedHero1.weaponId != null) {
          // @ts-ignore
          this.selectedHero1.damage += this.weapons.find(weapon => weapon.id === this.selectedHero1?.weaponId)?.damage;
          // @ts-ignore
          this.selectedHero1.evasion += this.weapons.find(weapon => weapon.id === this.selectedHero1?.weaponId)?.evasion;
          // @ts-ignore
          this.selectedHero1.attack += this.weapons.find(weapon => weapon.id === this.selectedHero1?.weaponId)?.attack;
          // @ts-ignore
          this.selectedHero1.health += this.weapons.find(weapon => weapon.id === this.selectedHero1?.weaponId)?.health;
        }
        // @ts-ignore
        if (this.selectedHero2.weaponId != null) {
          // @ts-ignore
          this.selectedHero2.damage += this.weapons.find(weapon => weapon.id === this.selectedHero2?.weaponId)?.damage;
          // @ts-ignore
          this.selectedHero2.evasion += this.weapons.find(weapon => weapon.id === this.selectedHero2?.weaponId)?.evasion;
          // @ts-ignore
          this.selectedHero2.attack += this.weapons.find(weapon => weapon.id === this.selectedHero2?.weaponId)?.attack;
          // @ts-ignore
          this.selectedHero2.health += this.weapons.find(weapon => weapon.id === this.selectedHero2?.weaponId)?.health;
        }
        this.fight_details = [""];
      }
    }

    // Fonction pour commencer un fight entre 2 héros
    // @ts-ignore
    fightHeroes() {
      if (this.selectedHero1 != null && this.selectedHero2 != null) {
        if (this.selectedHero1.evasion <= this.selectedHero2.attack && this.selectedHero2.evasion <= this.selectedHero1.attack) {
          while (this.selectedHero1?.health > 0 && this.selectedHero2.health > 0) {

            // Le héro 1 attaque le héro 2
            if (this.selectedHero1.attack > this.selectedHero2.evasion) {
              this.selectedHero2.health = this.selectedHero2.health - this.selectedHero1.damage;
              this.fight_details.push(this.selectedHero1.name + " attaque " + this.selectedHero2.name + " et lui inflige " + this.selectedHero1.damage + " points de dégats");
              this.fight_details.push(this.selectedHero2.name + " a plus que " + this.selectedHero2.health + " points de vie");

              // Vérifie si le héros 2 est vaincu
              if (this.selectedHero2.health <= 0) {
                this.fight_details.push(this.selectedHero1.name + " est vainqueur du match");
                break;
              }
            } else {
              this.fight_details.push(this.selectedHero1.name + " attaque " + this.selectedHero2.name + " mais il esquive l'attaque");
            }

            // Le héro 2 attaque le héro 1
            if (this.selectedHero2.attack > this.selectedHero1.evasion) {
              this.selectedHero1.health = this.selectedHero1.health - this.selectedHero2.damage;
              this.fight_details.push(this.selectedHero2.name + " attaque " + this.selectedHero1.name + " et lui inflige " + this.selectedHero2.damage + " points de dégats");
              this.fight_details.push(this.selectedHero1.name + " a plus que " + this.selectedHero1.health + " points de vie");

              // Vérifie si le héros 1 est vaincu
              if (this.selectedHero1.health <= 0) {
                this.fight_details.push(this.selectedHero2.name + " est vainqueur du match");
                break;
              }
            } else {
              this.fight_details.push(this.selectedHero2.name + " attaque " + this.selectedHero1.name + " mais il esquive l'attaque");
            }
          }
        }
        else {
          this.fight_details.push("Les deux héros ont une esquive trop importante pour s'infliger des dégats");
        }
      }
    }

    changeHeroes() {
        this.fight = false;
        this.selectedHero1 = undefined;
        this.selectedHero2 = undefined;
    }

    // Désabonnement de l'observable
    unsubscribeGetHeroes(): void {
      this.subscriptionGetHeroes?.unsubscribe();
    }

    /**
     * The ngDestroy is called in a component’s lifecycle just before the instance of the component is finally destroyed.
     * It is the perfect place to clean the component — for example, to cancel background tasks.
     */
    ngOnDestroy(): void {
      // Utilisation du cycle de vie du composant pour unsubscribe
      console.log("Destroy heroes component");
      this.subscriptionGetHeroes?.unsubscribe();
    }
}
