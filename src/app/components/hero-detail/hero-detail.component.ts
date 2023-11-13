import { Component, OnInit } from '@angular/core';
import { Hero } from '../../data/hero';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';

import { HeroService } from '../../service/hero.service';


@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {
  hero: Hero | undefined;
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
  }, {
    validators: [
      this.forbiddenAttributsValidator(),
      this.remainingPointsValidator()
    ]
  });

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.heroService.getHero(id)
        .subscribe(hero => {
          this.hero = hero;
          this.heroForm.patchValue({
            name: this.hero.name,
            attack: this.hero.attack,
            evasion: this.hero.evasion,
            health: this.hero.health,
            damage: this.hero.damage
          });
        });
    }
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

  remainingPointsValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const attack = control.get('attack')?.value || 0;
      const evasion = control.get('evasion')?.value || 0;
      const health = control.get('health')?.value || 0;
      const damage = control.get('damage')?.value || 0;
      const totalAttributes = attack + evasion + health + damage;
      const remainingPoints = 40 - totalAttributes;

      if (totalAttributes < 40) {
        return { totalAttributesExceeded: true, remainingPoints };
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

        this.heroService.updateHero(this.hero)
          .then(response => {
            // Gérer la réponse ici, par exemple, afficher un message de succès
            console.log('Héros mis à jour avec succès', response);
          })
          .catch(error => {
            // Gérer les erreurs ici, par exemple, afficher un message d'erreur
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

}
