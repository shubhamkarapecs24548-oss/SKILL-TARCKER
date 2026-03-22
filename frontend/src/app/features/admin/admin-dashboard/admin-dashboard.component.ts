import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { StatsCardComponent } from '../../../shared/components/stats-card/stats-card.component';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, StatsCardComponent, RouterLink],
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
  stats: any = null;
  loading = true;

  constructor(public adminService: AdminService, private router: Router) {}

  ngOnInit() {
    this.adminService.getAnalytics().subscribe({
        next: (data) => {
            this.stats = data;
            this.loading = false;
        },
        error: () => this.router.navigate(['/dashboard'])
    });
  }
}
