import {Component, OnInit} from '@angular/core';
import {Hero} from '../../data/hero';
import {HeroService} from "../../service/hero.service";
import {first, Observable, Subscription} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})

export class HeroesComponent implements OnInit {
  hero?: Hero;
  heroes: Hero[] = [];
  selectedSortOption: string = ""; // Pour stocker l'attribut sélectionné dans la liste déroulante du tri

  selectedFilterOption: string = ""; // Pour stocker l'attribut sélectionné dans la liste déroulante du filtre
  selectedFilterOperator: string = ""; // Pour stocker l'opérateur sélectionné dans la liste déroulante du filtre
  selectedFilterValue: string = ""; // Pour stocker la valeur sélectionnée dans la liste déroulante du filtre
  heroesAysnc?: Observable<Hero[]>;
  subscriptionGetHeroes?: Subscription;
  selectedHero1?: null; // Pour le match de héro
  selectedHero2?: null; // Pour le match de héro

  constructor(private heroService: HeroService, private router: Router) {
  }

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {

    // Subscription "simple"
    this.subscriptionGetHeroes = this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes);
    this.heroesAysnc = this.heroService.getHeroes();
  }

  newHero() {
    let hero = new Hero();
    this.heroService.addHero(hero);
  }

  // Fonction pour trier les héros en fonction de l'attribut renseigné
  // (note : si l'utilisateur passe par goBack après avoir cliqué sur un héro, cela appellera la base de donnée
  // et donc le tri sera perdu)
  sortHeroes(sort: string) {
    console.log("Liste des héros: " + this.heroes);
    if (sort == "name") {
      this.heroes.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort == "attack") {
      this.heroes.sort((a, b) => b.attack - a.attack);
    } else if (sort == "evasion") {
      this.heroes.sort((a, b) => b.evasion - a.evasion);
    } else if (sort == "damage") {
      this.heroes.sort((a, b) => b.damage - a.damage);
    } else if (sort == "health") {
      this.heroes.sort((a, b) => b.health - a.health);
    } else {
      this.heroes.slice(); // Retourner une copie du tableau pour éviter de modifier l'original
    }
  }

  // Fonction pour filtrer les héros en fonction de l'attribut, de l'opérateur et de la valeur renseignés
  // (note : si l'utilisateur passe par goBack après avoir cliqué sur un héro, cela appellera la base de donnée
  // et donc le filtre sera perdu)
  filterHeroes() {
    const filterValue = parseInt(this.selectedFilterValue);
    if (this.selectedFilterOption == "attack") {
      if (this.selectedFilterOperator == ">" && this.selectedFilterValue) {
        this.heroes = this.heroes.filter(hero => hero.attack > filterValue);
      } else if (this.selectedFilterOperator == "<" && this.selectedFilterValue) {
        this.heroes = this.heroes.filter(hero => hero.attack < filterValue);
      } else if (this.selectedFilterOperator == "=" && this.selectedFilterValue) {
        this.heroes = this.heroes.filter(hero => hero.attack == filterValue);
      }
    } else if (this.selectedFilterOption == "evasion") {
      if (this.selectedFilterOperator == ">" && this.selectedFilterValue) {
        this.heroes = this.heroes.filter(hero => hero.evasion > filterValue);
      } else if (this.selectedFilterOperator == "<" && this.selectedFilterValue) {
        this.heroes = this.heroes.filter(hero => hero.evasion < filterValue);
      } else if (this.selectedFilterOperator == "=" && this.selectedFilterValue) {
        this.heroes = this.heroes.filter(hero => hero.evasion == filterValue);
      }
    } else if (this.selectedFilterOption == "damage") {
      if (this.selectedFilterOperator == ">" && this.selectedFilterValue) {
        this.heroes = this.heroes.filter(hero => hero.damage > filterValue);
      } else if (this.selectedFilterOperator == "<" && this.selectedFilterValue) {
        this.heroes = this.heroes.filter(hero => hero.damage < filterValue);
      } else if (this.selectedFilterOperator == "=" && this.selectedFilterValue) {
        this.heroes = this.heroes.filter(hero => hero.damage == filterValue);
      }
    } else if (this.selectedFilterOption == "health") {
      if (this.selectedFilterOperator == ">" && this.selectedFilterValue) {
        this.heroes = this.heroes.filter(hero => hero.health > filterValue);
      } else if (this.selectedFilterOperator == "<" && this.selectedFilterValue) {
        this.heroes = this.heroes.filter(hero => hero.health < filterValue);
      } else {
        this.heroes = this.heroes.filter(hero => hero.health == filterValue);
      }
    } else {
      this.heroes.slice(); // Retourne une copie du tableau pour éviter de modifier l'original
    }
  }

  // Fonction pour commencer un fight entre 2 héros
  // @ts-ignore
  fightHeroes() {
    if (this.selectedHero1 != null && this.selectedHero2 != null && this.selectedHero1 != this.selectedHero2) {
      this.router.navigateByUrl('/fight/' + this.selectedHero1 + '/' + this.selectedHero2);
    }
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
