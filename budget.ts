import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ✅ Define the BudgetCategory interface
export interface BudgetCategory {
  id?: number;
  name: string;
  budget: number;
  actual: number;
}

// ✅ Define the Budget model (if you need an entire trip budget object)
export interface Budget {
  id?: number;
  totalBudget: number;
  categories: BudgetCategory[];
}

@Injectable({ providedIn: 'root' })
export class BudgetService {
  private apiUrl = 'http://localhost:3000/api/budget'; // ✅ matches backend

  constructor(private http: HttpClient) {}

  /** Fetch all budget categories */
  getAll(): Observable<BudgetCategory[]> {
    return this.http.get<BudgetCategory[]>(this.apiUrl);
  }

  /** Add new budget category */
  create(category: BudgetCategory): Observable<any> {
    return this.http.post(this.apiUrl, category);
  }

  /** Update a budget category */
  update(id: number, category: BudgetCategory): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, category);
  }

  /** Delete a category */
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}


