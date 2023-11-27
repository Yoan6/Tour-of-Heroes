import {Component, OnInit} from '@angular/core';
import {Hero} from '../../data/hero';
import {HeroService} from "../../service/hero.service";
import {first, Observable, Subscription} from "rxjs";

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})

export class HeroesComponent implements OnInit {
  hero?: Hero;
  heroes: Hero[] = [];
  selectedSortOption: string = ""; // Pour stocker la valeur sélectionnée dans la liste déroulante du tri
  heroesAysnc?: Observable<Hero[]>;

  subscriptionGetHeroes?: Subscription;

  constructor(private heroService: HeroService) {
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

  // Fonction pour trier les héros en fonction de l'attribut renseigné:
  // @ts-ignore
  filterHeroes(sort: string): Heros[] {
    if (sort == "name") {
      return this.heroes.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort == "attack") {
      return this.heroes.sort((a, b) => a.attack - b.attack);
    } else if (sort == "evasion") {
      return this.heroes.sort((a, b) => a.evasion - b.evasion);
    } else if (sort == "damage") {
      return this.heroes.sort((a, b) => a.damage - b.damage);
    } else if (sort == "health") {
      return this.heroes.sort((a, b) => a.health - b.health);
    }
    else {
      return this.heroes.slice(); // Retourner une copie du tableau pour éviter de modifier l'original
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
