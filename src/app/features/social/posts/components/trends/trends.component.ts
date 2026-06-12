import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

import { SocialPostsStore } from '@features/social/posts/data-access/social-posts.store';

@Component({
  selector: 'app-trends',
  imports: [MatCardModule, MatButtonModule, RouterLink],
  templateUrl: './trends.component.html',
  styleUrl: './trends.component.scss',
})
export class TrendsComponent implements OnInit {
  private readonly store = inject(SocialPostsStore);

  protected readonly trends = this.store.trends;

  ngOnInit(): void {
    void this.store.loadTrends();
  }
}
