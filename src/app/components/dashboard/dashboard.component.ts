import { Component, OnInit } from '@angular/core';
import { Hero } from '../../data/hero'
import { Weapon } from '../../data/weapon'
import { HeroService } from '../../service/hero.service'
import { WeaponService } from '../../service/weapon.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  heroes: Hero[] = [];
  weapons: Weapon[] = [];

  constructor(private heroService: HeroService, private weaponService: WeaponService) { }

  ngOnInit(): void {
    this.getHeroes();
    this.getWeapons();
  }

  getHeroes(): void {
    this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes.slice(0, 5));
  }

  getWeapons(): void {
    this.weaponService.getWeapons()
      .subscribe(weapons => this.weapons = weapons.slice(0, 5));
  }
}
