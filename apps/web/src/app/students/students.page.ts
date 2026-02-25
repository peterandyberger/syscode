import { Component, ChangeDetectorRef, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../app.config';

type Student = { id: string; name: string; email: string };
type Address = { id: string; address: string };
type StudentDetail = { loading: boolean; address: Address | null };

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

  details: Record<string, StudentDetail> = {};

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private detector: ChangeDetectorRef,
    @Inject(API_URL) private apiUrl: string,
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    this.load();
  }

  load() {
    this.http.get<Student[]>(`${this.apiUrl}/students`).subscribe({
      next: (data) => {
        this.students = data || [];
        this.detector.detectChanges();
      },
      error: () => {
        this.error = 'Load failed';
        this.detector.detectChanges();
      },
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.error = null;

    if (this.editingId) {
      this.http
        .put(`${this.apiUrl}/students/${this.editingId}`, this.form.value)
        .subscribe({
          next: () => {
            this.editingId = null;
            this.form.reset();
            this.load();
          },
          error: () => (this.error = 'Save failed'),
        });
    } else {
      this.http
        .post(`${this.apiUrl}/students`, this.form.value)
        .subscribe({
          next: () => {
            this.form.reset();
            this.load();
          },
          error: () => (this.error = 'Create failed'),
        });
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
    this.http.delete(`${this.apiUrl}/students/${id}`).subscribe(() => {
      this.load();
    });
  }

  loadDetails(id: string) {
    this.details[id] = { loading: true, address: null };

    this.http
      .get<Student & { address: Address }>(`${this.apiUrl}/students/${id}/with-address`)
      .subscribe({
        next: (res) => {
          this.details[id] = {
            loading: false,
            address: res?.address || null,
          };
          this.detector.detectChanges();
        },
        error: () => {
          this.details[id] = { loading: false, address: null };
          this.detector.detectChanges();
        },
      });
  }
}
