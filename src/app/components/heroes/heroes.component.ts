import { Component, OnInit } from '@angular/core';
import { Hero } from '../../data/hero';
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
