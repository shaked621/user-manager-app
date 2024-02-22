import { Injectable } from '@angular/core';
import { GenderEnum, IUser } from '../models/user.model';
import { Subject, Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { CountryApiService } from '../services/country-api.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private users: IUser[] = [];
  userChanged$: Subject<IUser[]> = new Subject<IUser[]>();
  constructor(private countryApiService: CountryApiService) {}

  createUser(user: IUser) {
    user.id = uuidv4();
    this.users.push({ ...user });
    this.userChanged$.next(this.users.slice());
    this.saveAuthData(this.users);
  }

  deleteUser(userId: string) {
    const index = this.users.findIndex((user) => user.id === userId);
    this.users.splice(index, 1);
    this.userChanged$.next(this.users.slice());
    this.saveAuthData(this.users);
  }

  updateUser(newUserData: IUser) {
    const index = this.users.findIndex((user) => user.id === newUserData.id);
    this.users[index] = newUserData;
    this.userChanged$.next(this.users.slice());
    this.saveAuthData(this.users);
  }

  getUsers() {
    this.getCountries();
    const usersFromLocalStorage: IUser[] = this.getAuthData();
    if (usersFromLocalStorage) {
      this.users.push(...usersFromLocalStorage);
    }
    return this.users.slice();
  }

  getUser(userId: string) {
    return this.users.find((user) => user.id === userId);
  }

  getCountries() {
    return this.countryApiService.getCountries();
  }

  private saveAuthData(usres: IUser[]) {
    localStorage.setItem('users', JSON.stringify(usres));
  }

  private clearAuthData() {
    localStorage.removeItem('users');
  }

  private getAuthData(): IUser[] {
    const getItem = localStorage.getItem('users');
    let users;
    if (getItem) {
      users = JSON.parse(getItem);
    }
    return users;
  }
}
