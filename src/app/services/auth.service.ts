import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { UsernameCheckResponse } from '../types/username-check-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl: string = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  register<T>(user: T) {
    return this.http.post(`${this.baseUrl}/createUser`, user);
  }

  usernameExists(username: string) {
    return this.http.get<UsernameCheckResponse>(`${this.baseUrl}/username-exist/${username}`);
  }
}
