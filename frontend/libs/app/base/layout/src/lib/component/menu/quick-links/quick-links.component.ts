import { Component, OnInit } from '@angular/core';
import { AbstractComponent } from '@ng-techpromux-archetype-project/core-api';

@Component({
  selector: 'app-quick-links',
  templateUrl: './quick-links.component.html',
  styleUrls: ['./quick-links.component.scss'],
})
export class QuickLinksComponent
  extends AbstractComponent
  implements OnInit
{
  constructor() {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }
}
