/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';

import {
  ClassToggleService,
  HeaderComponent as CoreUiHeaderComponent,
  SidebarService,
} from '@coreui/angular';
import { Select, Store } from '@ngxs/store';
import {
  LayoutSidebarVisibleToggleStoreAction,
  LayoutStoreState,
} from '@ng-techpromux-archetype-project/core-layout';
import { ElementsResizeObserverService } from '@ng-techpromux-archetype-project/core-ui';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent
  extends CoreUiHeaderComponent
  implements OnInit, OnDestroy
{
  @Input() sidebarId: string = 'sidebar';

  private store: Store = inject<Store>(Store);

  private sidebarService: SidebarService =
    inject<SidebarService>(SidebarService);

  private readonly __subscriptions: Subscription = new Subscription();

  @Select(LayoutStoreState.isSidebarVisibleToggled)
  private sidebarToggled$!: Observable<boolean>;

  sidebarToggled: boolean | null = null;

  public newMessages = new Array(4);
  public newTasks = new Array(5);
  public newNotifications = new Array(5);

  constructor(private classToggler: ClassToggleService) {
    super();
  }

  ngOnInit(): void {
    this.addSubscription(
      this.sidebarToggled$.subscribe((data) => {
        if (
          this.sidebarToggled === null &&
          data === true &&
          !ElementsResizeObserverService.hasMobileSize()
        ) {
          setTimeout(() => {
            this.sidebarService.toggle({ toggle: 'visible', id: 'sidebar' });
          }, 100);
        }
        this.sidebarToggled = data;
      })
    );
  }

  onSideBarToggle($event: any): void {
    if (!ElementsResizeObserverService.hasMobileSize()) {
      this.store.dispatch(
        new LayoutSidebarVisibleToggleStoreAction(!this.sidebarToggled)
      );
    }
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }

  protected addSubscription(subscription?: Subscription): Subscription {
    if (subscription) {
      this.__subscriptions.add(subscription);
    }
    return subscription as Subscription;
  }

  ngOnDestroy(): void {
    this.__subscriptions.unsubscribe();
  }
}
