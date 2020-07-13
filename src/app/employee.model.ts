export class Employee{
    id : number;
    employee_name : String;
    employee_salary : number;
    employee_age : number;
    constructor(id :  number,employee_name : String,employee_salary:number,employee_age : number){
        this.id = id;
        this.employee_name = employee_name;
        this.employee_salary = employee_salary;
        this.employee_age = employee_age
    }
}