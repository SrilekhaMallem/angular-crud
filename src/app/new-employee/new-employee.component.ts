import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-new-employee',
  templateUrl: './new-employee.component.html',
  styleUrls: ['./new-employee.component.scss']
})
export class NewEmployeeComponent implements OnInit {
  addForm: FormGroup;
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private employeeService: EmployeeService,
    public bsModalRef: BsModalRef,
    private toastrService: ToastrService) { }
  title: string;
  list: any[] = [];
  ngOnInit(): void {

    this.addForm = this.formBuilder.group({
      id: [],
      employee_name: ['', Validators.required],
      employee_age: ['', Validators.required],
      employee_salary: ['', Validators.required],
    });
    if (this.list[0]) {
      this.employeeService.getEmployeeById(this.list[0].data).subscribe((res: any) => {
        this.addForm.patchValue({
          id: res.data.id,
          employee_name: res.data.employee_name,
          employee_age: res.data.employee_age,
          employee_salary: res.data.employee_salary,
        });
      });
    }
  }
  onSubmit() {
    if (this.title === 'Add Form') {
      this.employeeService.createEmployee(this.addForm.value)
        .subscribe((data: any) => {
          if (data.status === "success") {
            this.toastrService.success('Added succesfully!');
            this.bsModalRef.content.onClose.next(true);
          }
        });
    }
    else {
      this.employeeService.updateEmployee(this.list[0].data, this.addForm.value).subscribe((res: any) => {
        if (res.status === "success") {
          this.toastrService.success('Updated succesfully!');
          this.bsModalRef.content.onClose.next(true);
        }
      });
    }
    this.router.navigate(['/employees']);
    this.bsModalRef.hide();
  }
  onClose() {
    this.bsModalRef.hide();
    this.addForm.reset();
    this.bsModalRef.content.onClose.next(true);
  }
}
