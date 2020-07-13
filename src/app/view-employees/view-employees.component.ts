import { Component, OnInit, AfterViewInit, Renderer2, ViewChild, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { EmployeeService } from '../employee.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NewEmployeeComponent } from '../new-employee/new-employee.component';
import { ToastrService } from 'ngx-toastr';
import { DataTableDirective } from 'angular-datatables';


@Component({
  selector: 'app-view-employees',
  templateUrl: './view-employees.component.html',
  styleUrls: ['./view-employees.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class ViewEmployeesComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  modalRef: BsModalRef;

  constructor(private employeeService: EmployeeService,
    private renderer: Renderer2,
    private modalService: BsModalService,
    private toastrService: ToastrService
  ) { }
  dtOptions: DataTables.Settings = {};
  ngOnInit() {
    this.loadData();
  }
  loadData() {
    this.dtOptions = {
      paging: true,
      searching: true,
      ordering: true,
      responsive: true,
      destroy: true,
      // columns definition
      columns: [
        {
          data: "id",
          title: "Employee ID"
        },
        {
          data: "employee_name",
          title: "Name"
        }, {
          data: "employee_age",
          title: "Age",
          render: function (data: any, type: any, full: any, meta: any) {
            return meta.settings.fnFormatNumber(data);
          }
        }, {
          data: "employee_salary",
          title: "Salary",
          type: "currency",
          render: function (data: any, type: any, full: any) {
            return Number(data).toLocaleString('en-US', {
              maximumFractionDigits: 2,
              style: 'currency',
              currency: 'USD',
              //@ts-ignore
              notation: 'compact',
              compactDisplay: "short"
            })
          }
        }, {
          data: "id",
          title: "Actions",
          render: function (data: any, type: any, full: any, meta: any) {
            //   return 'View';
            return `<span><button id="Edit" >
                      <i class="fa fa-edit" view-data-id="${data}"></i></span>
                      <span><button id="Delete">
                      <i class = "fa fa-trash"  delete-data-id="${data}"></i></button></span>`;
          },
        }
      ],
    }
    this.employeeService.getEmployees().subscribe((res: any) => {
      console.log(res.data);
      this.dtOptions.data = res.data;
      this.rerender();
    });
  }
  onAdd(flag: String) {
    if (flag === 'add') {
      const initialState = {
        list:[],
        title: 'Add Form'
      };
      this.modalRef = this.modalService.show(NewEmployeeComponent, { initialState });
    }
    else {
      const initialState = {
        list: [
          { 'data': flag }
        ],
        title: 'Edit Form'
      };
      this.modalRef = this.modalService.show(NewEmployeeComponent, { initialState });
    }  
    this.modalRef.content.onClose = new Subject<boolean>();
    this.modalRef.content.onClose.subscribe(result => {
      console.log('results', result);
      this.loadData();
    });
  }

  onDelete(id: number) {
    this.employeeService.deleteEmployee(id).subscribe((res) => {
      if (res.status === "success") {
        this.toastrService.success('Deleted succesfully!');
        this.loadData();
      }
      else {
        this.toastrService.error('Error !!!');
      }
    });
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }
  ngAfterViewInit(): void {
    this.renderer.listen('document', 'click', (evt) => {
      if (evt.target.hasAttribute("view-data-id")) {
        this.onAdd(evt.target.getAttribute("view-data-id"));
      }
      if (evt.target.hasAttribute("delete-data-id")) {
        this.onDelete(evt.target.getAttribute("delete-data-id"));
      }
    });
    this.dtTrigger.next();

  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
