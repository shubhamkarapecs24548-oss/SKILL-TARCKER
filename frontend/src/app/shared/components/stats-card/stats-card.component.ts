import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card p-6 flex items-center justify-between hover:scale-[1.02] transition-transform duration-300">
      <div>
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{{title}}</p>
        <h3 class="text-3xl font-bold text-gray-800 dark:text-gray-100">{{value}}</h3>
      </div>
      <div class="p-3 rounded-full {{bgColor}} bg-opacity-20 text-opacity-80 flex items-center justify-center h-12 w-12 text-xl">
        {{icon}}
      </div>
    </div>
  `
})
export class StatsCardComponent {
  @Input() title: string = '';
  @Input() value: number | string = 0;
  @Input() bgColor: string = 'bg-caramel-400';
  @Input() icon: string = '📈';
}
