export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  gender: GenderEnum;
  age: number;
  country: string;
  city: string;
}

export enum GenderEnum {
  Male = 'Male',
  Female = 'Female',
}
