import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoalService } from '../../../core/services/goal.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-goal-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './goal-list.component.html'
})
export class GoalListComponent implements OnInit {
  goals: any[] = [];
  loading = true;
  showForm = false;
  newGoal = { title: '', description: '', startDate: '', endDate: '' };
  today: string;

  constructor(private goalService: GoalService) {
    this.today = new Date().toISOString().split('T')[0];
  }

  ngOnInit() {
    this.loadGoals();
  }

  loadGoals() {
    this.loading = true;
    this.goalService.getGoals().subscribe((data: any[]) => {
      this.goals = data;
      this.loading = false;
    });
  }

  submitGoal() {
    this.goalService.createGoal(this.newGoal).subscribe(() => {
      this.showForm = false;
      this.newGoal = { title: '', description: '', startDate: '', endDate: '' };
      this.loadGoals();
    });
  }

  deleteGoal(id: string) {
    if (confirm('Are you sure you want to delete this goal?')) {
      this.goalService.deleteGoal(id).subscribe(() => this.loadGoals());
    }
  }

  toggleMilestone(goal: any, milestoneIdx: number) {
    goal.milestones[milestoneIdx].completed = !goal.milestones[milestoneIdx].completed;
    
    // Recalculate progress
    const completed = goal.milestones.filter((m: any) => m.completed).length;
    const total = goal.milestones.length;
    goal.progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    if (goal.progress === 100) goal.status = 'Completed';
    else if (goal.progress > 0) goal.status = 'In Progress';

    this.goalService.updateGoal(goal._id, goal).subscribe();
  }
}
