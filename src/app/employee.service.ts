import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Employee } from './employee.model';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {
  private baseUrl = 'https://5f0336c64c6a2b001648fee4.mockapi.io/employees';
  constructor(private http: HttpClient, private toastr:ToastrService) { }
  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.baseUrl}`).pipe(
      catchError(this.handleError)
    );
  }

  getEmployeeById(id : number):Observable<Employee>{
    return this.http.get<Employee>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }
  createEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(`${this.baseUrl}`,employee).pipe(
      catchError(this.handleError)
    );;
  }

  updateEmployee(id: number, employee : Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.baseUrl}/${id}`,employee).pipe(
      catchError(this.handleError)
    );;
  }

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`,{responseType :'json'}).pipe(
      catchError(this.handleError)
    );;
  }

  private handleError(error: HttpErrorResponse) {
    this.toastr.error('Error',error.error.message);
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
      
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
   
    return throwError(
      'Something bad happened; please try again later.');
  };
}