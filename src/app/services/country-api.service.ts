import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CountryApiService {
  private url = environment.baseApiUrl;

  constructor(private httpClient: HttpClient) {}

  getCountries(): Observable<string[]> {
    return this.httpClient.get<any[]>(this.url).pipe(
      map((data) => {
        const countries: string[] = [];
        if (Array.isArray(data)) {
          data.forEach((country) => {
            countries.push(country?.name?.common);
          });
        }
        return countries;
      })
    );
  }
}
