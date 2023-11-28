import { Component, OnInit } from '@angular/core';
import { Hero } from '../../data/hero';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';

import { HeroService } from '../../service/hero.service';
import { WeaponService } from "../../service/weapon.service";
import {Weapon} from "../../data/weapon";
import {catchError, first, Observable, of, Subscription, switchMap} from "rxjs";


@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {
  hero: Hero | undefined;
  weapons: Weapon[] = [];
  subscriptionGetWeapons?: Subscription;
  errorMessages: string[] = [];

  heroForm: FormGroup = new FormGroup({
    name: new FormControl('',Validators.compose([
      Validators.required, Validators.minLength(3)])),
    attack: new FormControl(10, Validators.compose([
      Validators.required, Validators.min(1)])),
    evasion: new FormControl(10, Validators.compose([
      Validators.required, Validators.min(1)])),
    health: new FormControl(10, Validators.compose([
      Validators.required, Validators.min(1)])),
    damage: new FormControl(10, Validators.compose([
      Validators.required, Validators.min(1)])),
    weapon: new FormControl('', Validators.compose([
      Validators.required, Validators.minLength(3)])),
  }, {
    validators: [
      this.forbiddenAttributsValidator(),
      this.remainingPointsValidator(),
      this.forbiddenWeaponAttributsValidator()
    ]
  });

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private weaponService: WeaponService,
    private location: Location,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getHero();

  }

  getHero(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.heroService.getHero(id).pipe(first())
        .subscribe(hero => {
          this.hero = hero;
          this.heroForm.patchValue({
            name: this.hero.name,
            attack: this.hero.attack,
            evasion: this.hero.evasion,
            health: this.hero.health,
            damage: this.hero.damage
          });

          // On fait l'appel à getWeapon après avoir récupérer le héro et son weaponId
          this.getWeapons();
        });
    }
  }

  getWeapons(): void {
    this.weaponService.getWeapons()
      .subscribe(weapons => {
        this.weapons = weapons;
        this.heroForm.patchValue({
          weapon: this.hero?.weaponId
        });
      });


  }

  // Validateur personnalisé qui vérifie que la somme des attributs n'est pas supérieure à 40
  forbiddenAttributsValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const attack = control.get('attack')?.value;
      const evasion = control.get('evasion')?.value;
      const health = control.get('health')?.value;
      const damage = control.get('damage')?.value;
      const totalAttributes = attack + evasion + health + damage;

      if (totalAttributes > 40) {
        return { forbiddenAttributes: true };
      } else {
        return null;
      }
    };
  }

  // Validateur personnalisé qui vérifie que la somme des attributs n'est pas supérieure à 40
  remainingPointsValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const attack = control.get('attack')?.value || 0;
      const evasion = control.get('evasion')?.value || 0;
      const health = control.get('health')?.value || 0;
      const damage = control.get('damage')?.value || 0;
      const totalAttributes = attack + evasion + health + damage;
      const remainingPoints = 40 - totalAttributes;

      if (totalAttributes < 40) {
        return { remainingPointsValidator: true, remainingPoints };
      }
      return null;
    };
  }

  // On fait un validateur pour check pour chaque attributs du héro si la somme
  // avec l'attribut correspondant de son arme est supérieur à 0
  // Si c'est le cas, on renvoie une erreur
  forbiddenWeaponAttributsValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const attack = control.get('attack')?.value || 0;
      const evasion = control.get('evasion')?.value || 0;
      const health = control.get('health')?.value || 0;
      const damage = control.get('damage')?.value || 0;
      const weaponId = control.get('weapon')?.value;

      if (weaponId == null) {
        return null;
      }
      let foundWeapon: Weapon | undefined;
      // On parcourt les armes de la liste des armes pour trouver l'arme correspondant à weaponId
      foundWeapon = this.weapons.find(weapon => weapon.id === weaponId);
      if (foundWeapon) {
        const weaponAttack = foundWeapon.attack;
        const weaponEvasion = foundWeapon.evasion;
        const weaponHealth = foundWeapon.health;
        const weaponDamage = foundWeapon.damage;
        const totalAttack = attack + weaponAttack;
        const totalEvasion = evasion + weaponEvasion;
        const totalHealth = health + weaponHealth;
        const totalDamage = damage + weaponDamage;
        const invalidAttributes: string[] = [];
        if (totalAttack <= 0) {
          invalidAttributes.push('Attack');
        }
        if (totalEvasion <= 0) {
          invalidAttributes.push('Evasion');
        }
        if (totalHealth <= 0) {
          invalidAttributes.push('Health');
        }
        if (totalDamage <= 0) {
          invalidAttributes.push('Damage');
        }
        if (totalAttack <= 0 || totalEvasion <= 0 || totalHealth <= 0 || totalDamage <= 0) {
          return { forbiddenWeaponAttributsValidator: true, invalidAttributes };
        }
      }
      return null;
    };
  }

  goBack(): void {
    this.location.back();
  }

  modifyHero() {
    if (this.heroForm.valid) { // Vérifie si le formulaire est valide
      const formValues = this.heroForm.value; // Valeurs du formulaire
      if (this.hero && this.hero.id) {
        // On met à jour les attributs du héros avec les valeurs du formulaire
        this.hero.name = formValues.name;
        this.hero.attack = formValues.attack;
        this.hero.evasion = formValues.evasion;
        this.hero.health = formValues.health;
        this.hero.damage = formValues.damage;
        this.hero.weaponId = formValues.weapon;

        this.heroService.updateHero(this.hero)
          .then(response => {
            // On gère la réponse ici
            console.log('Héros mis à jour avec succès', response);
            this.router.navigateByUrl('/heroes');
          })
          .catch(error => {
            // On gère les erreurs ici
            console.error('Erreur lors de la mise à jour du héros', error);
          });
      }
    }
  }

  deleteHero(id: string) {
    if (this.hero && this.hero.id) {
      this.heroService.deleteHero(this.hero.id).then(() => {
          this.hero = undefined;
          console.log("Suppression du hero");
          this.router.navigateByUrl('/heroes');
      })
          .catch((error) => console.log("Problème lors de la suppression du hero"));
    }
  }
  ngOnDestroy(): void {

    // Utilisation du cycle de vie du composant pour unsubscribe
    console.log("Destroy heroe-detail component");
    this.subscriptionGetWeapons?.unsubscribe();
  }
}
