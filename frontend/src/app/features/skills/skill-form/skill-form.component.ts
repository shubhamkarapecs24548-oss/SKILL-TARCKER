import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SkillService } from '../../../core/services/skill.service';

@Component({
  selector: 'app-skill-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './skill-form.component.html'
})
export class SkillFormComponent implements OnInit {
  skillForm: FormGroup;
  isEditMode = false;
  skillId: string | null = null;
  loading = false;
  submitting = false;
  categories = ['Frontend', 'Backend', 'Database', 'DevOps', 'Mobile', 'Design', 'Marketing', 'Business', 'Cooking', 'Language', 'Other'];
  levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  statuses = ['Not Started', 'In Progress', 'Completed'];
  today = new Date().toISOString().split('T')[0];

  constructor(
    private fb: FormBuilder,
    private skillService: SkillService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.skillForm = this.fb.group({
      name: ['', Validators.required],
      category: ['Frontend', Validators.required],
      level: ['Beginner', Validators.required],
      notes: [''],
      deadline: [''],
      status: ['Not Started'],
      progress: [0, [Validators.min(0), Validators.max(100)]],
      resourcesText: ['']
    });
  }

  ngOnInit() {
    this.skillId = this.route.snapshot.paramMap.get('id');
    if (this.skillId) {
      this.isEditMode = true;
      this.loadSkill();
    }
  }

  loadSkill() {
    this.loading = true;
    this.skillService.getSkillById(this.skillId!).subscribe({
      next: (skill) => {
        const d = skill.deadline ? new Date(skill.deadline).toISOString().substring(0, 10) : '';
        this.skillForm.patchValue({
          name: skill.name,
          category: skill.category,
          level: skill.level,
          notes: skill.notes,
          deadline: d,
          status: skill.status,
          progress: skill.progress,
          resourcesText: skill.resources ? skill.resources.join(', ') : ''
        });
        this.loading = false;
      },
      error: () => {
        this.router.navigate(['/skills']);
      }
    });
  }

  onSubmit() {
    if (this.skillForm.invalid) return;
    this.submitting = true;

    const formValue = this.skillForm.value;
    const resources = formValue.resourcesText ? formValue.resourcesText.split(',').map((s: string) => s.trim()) : [];
    
    const skillData = {
      ...formValue,
      resources
    };
    delete skillData.resourcesText;

    if (this.isEditMode) {
      this.skillService.updateSkill(this.skillId!, skillData).subscribe({
        next: () => this.router.navigate(['/skills', this.skillId]),
        error: () => { this.submitting = false; }
      });
    } else {
      this.skillService.createSkill(skillData).subscribe({
        next: (res) => this.router.navigate(['/skills', res._id]),
        error: () => { this.submitting = false; }
      });
    }
  }

  onCancel() {
    if (this.isEditMode) {
      this.router.navigate(['/skills', this.skillId]);
    } else {
      this.router.navigate(['/skills']);
    }
  }
}
