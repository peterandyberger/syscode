import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { email } from '@angular/forms/signals';

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
    this.http.get<Student[]>('http://localhost:3000/students').subscribe((data) => {
      this.students = data || [];
      this.detector.detectChanges();
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.http.post('http://localhost:3000/students', this.form.value).subscribe(() => {
      this.form.reset();
      this.load();
      this.detector.detectChanges();
    });
  }

  delete(id: string) {
    this.http.delete(`http://localhost:3000/students/${id}`).subscribe(() => {
      this.load();
      this.detector.detectChanges();
    });
  }
}
