import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { IUser } from '../models/user.model';
import { UsersService } from './users.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AddUserButtonComponent } from './add-user-button/add-user-button.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  standalone: true,
  imports: [MatTableModule, MatSortModule, MatButtonModule, MatIconModule],
})
export class UsersComponent implements OnInit, OnDestroy, OnChanges {
  private readonly usersService = inject(UsersService);
  dialog = inject(MatDialog);

  private users: IUser[] = [];
  users$: Subscription | undefined;
  dataSource: MatTableDataSource<IUser> = new MatTableDataSource<IUser>();
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'gender',
    'age',
    'country',
    'city',
    'edit',
  ];

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  ngOnInit(): void {
    this.users$ = this.usersService.userChanged$.subscribe((users: IUser[]) => {
      this.users = users;
      this.initializeTable();
    });
    this.users = this.usersService.getUsers();
    this.initializeTable();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.users = this.usersService.getUsers();
    this.initializeTable();
  }
  ngOnDestroy(): void {
    this.users$?.unsubscribe();
  }

  initializeTable() {
    this.dataSource = new MatTableDataSource<IUser>(this.users);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddUserButtonComponent);
  }
  onEdit(userId: string): void {
    const index = this.users.findIndex((user) => user.id === userId);
    const userData = this.users[index];
    const dialogRef = this.dialog.open(AddUserButtonComponent, {
      data: { ...userData },
    });
  }

  onDelete(userId: string): void {
    this.usersService.deleteUser(userId);
  }
}
