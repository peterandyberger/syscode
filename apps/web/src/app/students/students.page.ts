import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

type Student = { id: string; name: string; email: string };

@Component({
  standalone: true,
  selector: 'app-students-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './students.page.html',
})
export class StudentsPage {
  students: Student[] = [];
  form: FormGroup;

  editingId: string | null = null;
  error: string | null = null;

  details: any = {};

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private detector: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    this.load();
  }

  load() {
    this.http.get<Student[]>('http://localhost:3000/students').subscribe(
      (data) => {
        this.students = data || [];
        this.detector.detectChanges();
      },
      () => {
        this.error = 'Load failed';
        this.detector.detectChanges();
      },
    );
  }

  submit() {
    if (this.form.invalid) return;

    this.error = null;

    if (this.editingId) {
      this.http
        .put(`http://localhost:3000/students/${this.editingId}`, this.form.value)
        .subscribe(
          () => {
            this.editingId = null;
            this.form.reset();
            this.load();
          },
          () => (this.error = 'Save failed'),
        );
    } else {
      this.http
        .post('http://localhost:3000/students', this.form.value)
        .subscribe(
          () => {
            this.form.reset();
            this.load();
          },
          () => (this.error = 'Create failed'),
        );
    }
  }

  startEdit(s: Student) {
    this.editingId = s.id;
    this.form.patchValue({ name: s.name, email: s.email });
  }

  cancelEdit() {
    this.editingId = null;
    this.form.reset();
  }

  delete(id: string) {
    this.http.delete(`http://localhost:3000/students/${id}`).subscribe(() => {
      this.load();
    });
  }

  loadDetails(id: string) {
    this.details[id] = { loading: true, address: null };

    this.http
      .get<any>(`http://localhost:3000/students/${id}/with-address`)
      .subscribe(
        (res) => {
          this.details[id] = {
            loading: false,
            address: res?.address || null,
          };
          this.detector.detectChanges();
        },
        () => {
          this.details[id] = { loading: false, address: null };
          this.detector.detectChanges();
        },
      );
  }
}