export class Hero {
    id: string | undefined;
    name: string;
    attack: number;
    evasion: number;
    damage: number;
    health: number;

    constructor(id: string = "id_test", name: string = "Doe", attack: number = 10, evasion: number = 10, damage: number = 10, health: number = 10) {
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
