import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '@/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserHttpService {
  private httpClient = inject(HttpClient);

  getDemoUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>("/api/demo-users")
  }

  login(username: string, password: string): Observable<User> {
    return this.httpClient.post<User>("/api/login", {username, password})
  }
}
