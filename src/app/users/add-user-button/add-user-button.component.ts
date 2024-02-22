import {
  AfterViewChecked,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { GenderEnum, IUser } from 'src/app/models/user.model';
import { UsersService } from '../users.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserErrorStateMatcher } from './error-matcher';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-add-user-button',
  templateUrl: './add-user-button.component.html',
  styleUrls: ['./add-user-button.component.css'],
})
export class AddUserButtonComponent
  implements OnInit, OnDestroy, AfterViewChecked
{
  @ViewChild('userDetailsForm') userDetailsForm: NgForm | undefined;

  newUser: IUser = {
    id: '',
    firstName: '',
    lastName: '',
    gender: GenderEnum.Male,
    age: 0,
    country: '',
    city: '',
  };
  genderList: string[];
  errorStateMatcher = new UserErrorStateMatcher();
  updateUser: boolean = false;
  selectedGender: string = '';
  countries: string[] = [];
  filteredCountries: Observable<string[]> | undefined;
  countriesChanged$: Subscription | undefined;

  constructor(
    private readonly userService: UsersService,
    public dialogRef: MatDialogRef<AddUserButtonComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IUser
  ) {
    this.genderList = Object.keys(GenderEnum).filter((f) => f !== undefined);
    if (data) {
      this.newUser = { ...data };
      this.selectedGender = data.gender;
      this.updateUser = true;
    }
  }
  ngAfterViewChecked(): void {
    this.filteredCountries = this.userDetailsForm?.form?.controls[
      'country'
    ]?.valueChanges.pipe(
      startWith(''),
      map(() => {
        const temp = this.userDetailsForm?.form?.controls['country'].value;
        return this._filter(temp);
      })
    );
  }

  ngOnInit(): void {
    this.countriesChanged$ = this.userService
      .getCountries()
      .subscribe((data: string[]) => {
        this.countries = data.slice();
      });
  }
  ngOnDestroy(): void {
    this.countriesChanged$?.unsubscribe();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.userDetailsForm?.form?.valid) {
      if (!this.updateUser) {
        this.userService.createUser(this.newUser);
      } else {
        this.onUpdate();
      }
      this.onCancel();
    }
  }

  onUpdate(): void {
    if (this.userDetailsForm?.form?.valid) {
      this.userService.updateUser(this.newUser);
    }
  }

  _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    const res = this.countries.filter((country) =>
      country.toLowerCase().includes(filterValue)
    );
    return res;
  }
}
