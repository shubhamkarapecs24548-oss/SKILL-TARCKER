import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AchievementService } from '../../../core/services/achievement.service';

@Component({
  selector: 'app-achievement-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './achievement-list.component.html'
})
export class AchievementListComponent implements OnInit {
  achievementsData: any = null;
  loading = true;

  badgesMap: {[key: string]: {icon: string, desc: string, color: string}} = {
    'Beginner': { icon: '🌱', desc: 'Added your very first skill. The journey begins!', color: 'bg-green-100 text-green-700 border-green-200' },
    'Consistent Learner': { icon: '🔥', desc: 'Maintained a 7-day learning streak.', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    'Pro': { icon: '✨', desc: 'Reached 100% progress on a skill.', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    'Category Master': { icon: '👑', desc: 'Completed 3 skills in the same category.', color: 'bg-purple-100 text-purple-700 border-purple-200' }
  };

  allBadges = Object.keys(this.badgesMap);

  constructor(private achievementService: AchievementService) {}

  ngOnInit() {
    this.achievementService.getAchievements().subscribe((data: any) => {
      this.achievementsData = data;
      this.loading = false;
    });
  }

  hasBadge(badgeId: string): boolean {
    if (!this.achievementsData?.achievements) return false;
    return this.achievementsData.achievements.some((a: any) => a.badgeId === badgeId);
  }

  getBadgeDate(badgeId: string): Date | null {
    if (!this.achievementsData?.achievements) return null;
    const a = this.achievementsData.achievements.find((a: any) => a.badgeId === badgeId);
    return a ? new Date(a.earnedAt) : null;
  }
}
