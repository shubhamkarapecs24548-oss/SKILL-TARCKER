import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-skill-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="card p-5 group flex flex-col justify-between h-full hover:shadow-lg transition-all transform hover:-translate-y-1">
      <div>
        <div class="flex justify-between items-start mb-4">
          <div>
            <span class="inline-block px-3 py-1 bg-caramel-100 dark:bg-dark-border text-caramel-800 dark:text-caramel-400 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
              {{ skill.category }}
            </span>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white line-clamp-1" [title]="skill.name">{{ skill.name }}</h3>
          </div>
          
          <div class="space-x-1 opacity-0 group-hover:opacity-100 transition-opacity flex">
             <button class="p-1.5 text-blue-500 hover:bg-blue-50 rounded" (click)="$event.stopPropagation(); edit.emit(skill)">
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
             </button>
             <button class="p-1.5 text-red-500 hover:bg-red-50 rounded" (click)="$event.stopPropagation(); delete.emit(skill)">
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
             </button>
          </div>
        </div>

        <p class="text-sm text-gray-500 dark:text-gray-400 font-medium mb-4 flex items-center">
            <svg class="w-4 h-4 mr-1 text-caramel-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            {{ skill.level }}
        </p>

        <div class="mb-4">
          <div class="flex justify-between items-end mb-1">
             <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
             <span class="text-xs font-bold" [ngClass]="{'text-green-500': skill.progress === 100, 'text-caramel-600': skill.progress < 100}">{{ skill.progress }}%</span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-dark-border rounded-full h-2.5">
            <div class="h-2.5 rounded-full" 
                 [ngClass]="skill.progress === 100 ? 'bg-green-500' : 'bg-caramel-400'"
                 [style.width.%]="skill.progress"></div>
          </div>
        </div>
      </div>
      
      <div class="mt-4 pt-4 border-t border-gray-100 dark:border-dark-border flex justify-between items-center">
        <span class="text-xs font-medium text-gray-500" [ngClass]="{'text-red-500': isUrgent(skill.deadline)}">
           {{ skill.deadline ? 'Due: ' + (skill.deadline | date:'mediumDate') : 'No Deadline' }}
        </span>
        <button [routerLink]="['/skills', skill._id]" class="text-caramel-600 hover:text-caramel-700 text-sm font-bold flex items-center transition-colors">
          View Details <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>
    </div>
  `
})
export class SkillCardComponent {
  @Input() skill: any;
  @Output() edit = new EventEmitter();
  @Output() delete = new EventEmitter();

  isUrgent(deadline: string): boolean {
    if (!deadline) return false;
    const date = new Date(deadline);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000; // <= 7 days
  }
}
