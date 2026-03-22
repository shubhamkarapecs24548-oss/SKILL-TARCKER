import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SkillService } from '../../../core/services/skill.service';
import { ProgressService } from '../../../core/services/progress.service';

@Component({
  selector: 'app-skill-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './skill-detail.component.html'
})
export class SkillDetailComponent implements OnInit {
  skill: any;
  progressHistory: any[] = [];
  loading = true;
  progressForm: FormGroup;
  loggingProgress = false;

  constructor(
    private route: ActivatedRoute,
    private skillService: SkillService,
    private progressService: ProgressService,
    private fb: FormBuilder,
    public location: Location,
    private router: Router
  ) {
    this.progressForm = this.fb.group({
      hoursSpent: [1, [Validators.min(0)]],
      newProgress: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      notes: ['']
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadSkillData(id);
    }
  }

  loadSkillData(id: string) {
    this.loading = true;
    this.skillService.getSkillById(id).subscribe({
      next: (data) => {
        this.skill = data;
        this.progressForm.patchValue({ newProgress: data.progress });
        this.loadProgressHistory(id);
      },
      error: () => this.router.navigate(['/skills']) // Handle if not found
    });
  }

  loadProgressHistory(id: string) {
    this.progressService.getSkillProgress(id).subscribe((data: any[]) => {
      this.progressHistory = data;
      this.loading = false;
    });
  }

  logProgress() {
    if (this.progressForm.invalid) return;
    this.loggingProgress = true;
    
    const payload = {
      skillId: this.skill._id,
      ...this.progressForm.value
    };

    this.progressService.addProgress(payload).subscribe({
      next: () => {
        this.loggingProgress = false;
        this.progressForm.reset({ hoursSpent: 1, newProgress: payload.newProgress, notes: '' });
        this.loadSkillData(this.skill._id); // Reload to reflect changes
      },
      error: () => this.loggingProgress = false
    });
  }

  get isUrgent(): boolean {
    if (!this.skill?.deadline) return false;
    const diff = new Date(this.skill.deadline).getTime() - Date.now();
    return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
  }
}
