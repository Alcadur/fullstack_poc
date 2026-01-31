import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '@/models/task.model';
import { HttpClient } from '@angular/common/http';
import { UserStore } from '@/stores/user-store/user-store';

const BASE_URL = '/api/tasks' as const;

@Injectable({
  providedIn: 'root'
})
export class TaskHttpService {
  private readonly httpClient = inject(HttpClient);
  private readonly userStore = inject(UserStore);

  private get userUuid() {
    return this.userStore.user()!.uuid;
  }

  getTasksByCompleted(completed: boolean): Observable<Task[]> {
    return this.httpClient.get<Task[]>(`${BASE_URL}/${completed ? 'completed' : 'todo'}`);
  }

  updateTask(task: Task): Observable<Task> {
    return this.httpClient.patch<Task>(BASE_URL, task);
  }
}
