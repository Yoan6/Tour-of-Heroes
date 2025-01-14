import { Component } from '@angular/core';
import { Weapon} from "../../data/weapon";
import { Hero } from "../../data/hero";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {WeaponService} from "../../service/weapon.service";
import {HeroService} from "../../service/hero.service";

@Component({
  selector: 'app-weapon-detail',
  templateUrl: './weapon-detail.component.html',
  styleUrls: ['./weapon-detail.component.css']
})
export class WeaponDetailComponent {
  weapon: Weapon | undefined;
  heroesOfWeapon: Hero[] | undefined;
  weaponForm: FormGroup = new FormGroup({
    name: new FormControl('',Validators.compose([
      Validators.required, Validators.minLength(3)])),
    attack: new FormControl(0, Validators.compose([
      Validators.required, Validators.min(-5), Validators.max(5)])),
    evasion: new FormControl(0, Validators.compose([
      Validators.required, Validators.min(-5), Validators.max(5)])),
    health: new FormControl(0, Validators.compose([
      Validators.required, Validators.min(-5), Validators.max(5)])),
    damage: new FormControl(0, Validators.compose([
      Validators.required, Validators.min(-5), Validators.max(5)])),
  }, {
    validators: [
      this.forbiddenAttributsValidator(),
    ]
  });

  constructor(
    private route: ActivatedRoute,
    private weaponService: WeaponService,
    private heroService: HeroService,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getWeapon();
    this.getHeroesOfWeapon();
  }

  getWeapon(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.weaponService.getWeapon(id)
        .subscribe(weapon => {
          this.weapon = weapon;
          this.weaponForm.patchValue({
            name: this.weapon.name,
            attack: this.weapon.attack,
            evasion: this.weapon.evasion,
            health: this.weapon.health,
            damage: this.weapon.damage
          });
        });
    }
  }

  getHeroesOfWeapon(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.heroService.getHeroes().subscribe(heroes => {
        this.heroesOfWeapon = heroes.filter(hero => hero.weaponId === id);
      });
    }
  }

  forbiddenAttributsValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const attack = control.get('attack')?.value;
      const evasion = control.get('evasion')?.value;
      const health = control.get('health')?.value;
      const damage = control.get('damage')?.value;
      const totalAttributes = attack + evasion + health + damage;

      if (totalAttributes != 0) {
        return { forbiddenAttributes: true };
      } else {
        return null;
      }
    };
  }

  // Fonction qui permet d'afficher les points restants à attribuer à une arme :
  // @ts-ignore
  remainingPoints(): number {
    const weaponAttack = this.weaponForm.value.attack;
    const weaponEvasion = this.weaponForm.value.evasion;
    const weaponHealth = this.weaponForm.value.health;
    const weaponDamage = this.weaponForm.value.damage;
    const totalAttributes = weaponAttack + weaponEvasion + weaponHealth + weaponDamage;
    if (totalAttributes < 0) {
      return 0 - totalAttributes;
    }
  }

  goBack(): void {
    this.location.back();
  }

  modifyWeapon(): void {
    if (this.weaponForm.valid) { // Vérifie si le formulaire est valide
      const formValues = this.weaponForm.value; // Valeurs du formulaire
      if (this.weapon && this.weapon.id) {
        // On met à jour les attributs du héros avec les valeurs du formulaire
        this.weapon.name = formValues.name;
        this.weapon.attack = formValues.attack;
        this.weapon.evasion = formValues.evasion;
        this.weapon.health = formValues.health;
        this.weapon.damage = formValues.damage;

        this.weaponService.updateWeapon(this.weapon)
          .then(response => {
            // Gérer la réponse ici, par exemple, afficher un message de succès
            console.log('Arme mise à jour avec succès', response);
            this.router.navigateByUrl('/weapons');
          })
          .catch(error => {
            // Gérer les erreurs ici, par exemple, afficher un message d'erreur
            console.error('Erreur lors de la mise à jour de l\'arme', error);
          });
      }
    }
  }

  deleteWeapon(id: string): void {
    if (this.weapon && this.weapon.id) {
      this.weaponService.deleteWeapon(id).then(() => {
          this.weapon = undefined;
          console.log("Suppression de l'arme");
          this.router.navigateByUrl('/weapons');
      })
          .catch((error) => console.log("Problème lors de la suppression de l'arme"));
    }
  }
}
