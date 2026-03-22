import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StatsCardComponent } from '../../shared/components/stats-card/stats-card.component';
import { SkillService } from '../../core/services/skill.service';
import { AuthService } from '../../core/services/auth.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, StatsCardComponent, BaseChartDirective],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  skills: any[] = [];
  totalSkills = 0;
  completedSkills = 0;
  inProgressSkills = 0;
  streak = 0;
  
  public chartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      { data: [65, 59, 80, 81, 56, 55, 40], label: 'Hours Spent', backgroundColor: '#d8a878', borderRadius: 4 }
    ]
  };
  public chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    scales: {
      y: { beginAtZero: true }
    }
  };

  constructor(private skillService: SkillService, public authService: AuthService) {}

  ngOnInit() {
    this.skillService.getSkills().subscribe((data: any[]) => {
      this.skills = data;
      this.totalSkills = data.length;
      this.completedSkills = data.filter((s: any) => s.status === 'Completed').length;
      this.inProgressSkills = data.filter((s: any) => s.status === 'In Progress').length;
    });
    const user = this.authService.currentUser();
    if (user) {
      this.streak = user.streak || 0;
    }
  }
}
