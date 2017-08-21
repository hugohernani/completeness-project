export class Address {
  constructor(public street: string, public number: number,
              public city?: string, public state?: string) {
    this.street = street;
    this.number = number;
    this.city = city;
    this.state = state;
  }
}
