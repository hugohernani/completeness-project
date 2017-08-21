export class User {
  constructor(public id: number, public name: string,
              public bio?: string, public age?: number,
              public genre?: string) {
    this.id = id;
    this.name = name;
    this.bio = bio;
    this.age = age;
    this.genre = genre;
  }
}
