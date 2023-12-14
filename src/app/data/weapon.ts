export class Weapon {
    id: string | undefined;
    name: string;
    attack: number;
    evasion: number;
    damage: number;
    health: number;

    constructor(id: string = "", name: string = "", attack: number = 0, evasion: number = 0, damage: number = 0, health: number = 0) {
        this.id = id;
        this.name = name;
        this.attack = attack;
        this.evasion = evasion;
        this.damage = damage;
        this.health = health;
    }


      fromJSON(jsonStr: string): void {

        let jsonObj = JSON.parse(jsonStr);
        for (const propName in jsonObj) {
          (this as any)[propName] = jsonObj[propName];
        }
      }
}
