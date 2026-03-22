import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SkillCardComponent } from '../../../shared/components/skill-card/skill-card.component';
import { SkillService } from '../../../core/services/skill.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-skill-list',
  standalone: true,
  imports: [CommonModule, FormsModule, SkillCardComponent],
  templateUrl: './skill-list.component.html'
})
export class SkillListComponent implements OnInit {
  skills: any[] = [];
  loading = true;

  filters = {
    search: '',
    category: [] as string[],
    level: '',
    status: '',
    sortBy: 'createdAt'
  };

  searchSubject = new Subject<string>();

  categories = ['Frontend', 'Backend', 'Database', 'DevOps', 'Mobile', 'Design', 'Marketing', 'Business', 'Cooking', 'Language', 'Other'];
  levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  statuses = ['Not Started', 'In Progress', 'Completed'];

  constructor(private skillService: SkillService, public router: Router) {
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(val => {
      this.filters.search = val;
      this.loadSkills();
    });
  }

  ngOnInit() {
    this.loadSkills();
    this.loadCategories();
  }

  loadCategories() {
    this.skillService.getCategories().subscribe(cats => {
      // Merge with default suggestions if empty, or just use what we have
      this.categories = cats.length > 0 ? cats : ['Frontend', 'Backend', 'Database', 'DevOps', 'Mobile', 'Other'];
    });
  }

  onSearch(event: any) {
    this.searchSubject.next(event.target.value);
  }

  loadSkills() {
    this.loading = true;
    this.skillService.getSkills(this.filters).subscribe((data: any[]) => {
      this.skills = data;
      this.loading = false;
    });
  }

  toggleCategory(cat: string) {
    const idx = this.filters.category.indexOf(cat);
    if (idx > -1) {
      this.filters.category.splice(idx, 1);
    } else {
      this.filters.category.push(cat);
    }
    this.loadSkills();
  }

  editSkill(skill: any) {
    this.router.navigate(['/skills', skill._id, 'edit']);
  }

  deleteSkill(skill: any) {
    if (confirm(`Are you sure you want to delete ${skill.name}?`)) {
      this.skillService.deleteSkill(skill._id).subscribe(() => {
        this.loadSkills();
      });
    }
  }
}
