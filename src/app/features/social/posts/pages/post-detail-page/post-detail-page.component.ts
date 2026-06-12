import {
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '@core/auth/auth.service';
import { CommentItemComponent } from '@features/social/posts/components/comment-item/comment-item.component';
import { PeopleYouMayKnowComponent } from '@features/social/profiles/components/people-you-may-know/people-you-may-know.component';
import { SocialPageLayoutComponent } from '@features/social/posts/components/social-page-layout/social-page-layout.component';
import { SocialPostCardComponent } from '@features/social/posts/components/social-post-card/social-post-card.component';
import { TrendsComponent } from '@features/social/posts/components/trends/trends.component';
import { SocialPostsStore } from '@features/social/posts/data-access/social-posts.store';
import { SocialProfileStore } from '@features/social/profiles/data-access/social-profile.store';

@Component({
  selector: 'app-post-detail-page',
  imports: [
    ReactiveFormsModule,
    SocialPageLayoutComponent,
    SocialPostCardComponent,
    CommentItemComponent,
    PeopleYouMayKnowComponent,
    TrendsComponent,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './post-detail-page.component.html',
  styleUrl: './post-detail-page.component.scss',
})
export class PostDetailPageComponent implements OnInit {
  private readonly store = inject(SocialPostsStore);
  private readonly profileStore = inject(SocialProfileStore);
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly title = inject(Title);

  protected readonly post = this.store.post;
  protected readonly isLoading = this.store.isLoading;
  protected readonly isAuthenticated = this.auth.isAuthenticated;
  protected readonly postLoaded = signal(false);

  protected readonly commentControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  ngOnInit(): void {
    this.title.setTitle('Post | Social Network');
    void this.loadPost();
    void this.profileStore.loadUserData();
  }

  protected async submitComment(): Promise<void> {
    const body = this.commentControl.value.trim();
    if (!body) {
      return;
    }

    const postId = this.route.snapshot.paramMap.get('id');
    if (!postId) {
      return;
    }

    await this.store.submitComment(postId, body);
    this.commentControl.reset('');
  }

  private async loadPost(): Promise<void> {
    const postId = this.route.snapshot.paramMap.get('id');
    if (!postId) {
      return;
    }

    await this.store.loadPost(postId);
    this.postLoaded.set(true);
  }
}
