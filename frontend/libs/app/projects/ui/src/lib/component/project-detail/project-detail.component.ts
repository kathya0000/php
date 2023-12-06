/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { AppFileUploaderService } from '@apps/app-base-domain';
import { AbstractUiComponent } from '@ng-techpromux-archetype-project/core-ddd';
import { ElementsResizeObserverService } from '@ng-techpromux-archetype-project/core-ui';

@Component({
  selector: 'app-projects-ui-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetailComponent
  extends AbstractUiComponent
  implements OnInit
{
  // --------------------------------------------------------------------------

  private fileUploader: AppFileUploaderService = inject<AppFileUploaderService>(
    AppFileUploaderService
  );

  protected imageStoreBasePath = this.fileUploader.getImageStoreBasePath();

  // --------------------------------------------------------------------------

  @Input() project: any = {};

  // --------------------------------------------------------------------------

  constructor() {
    super();
  }

  // --------------------------------------------------------------------------

  override ngOnInit(): void {
    super.ngOnInit();
  }

  // --------------------------------------------------------------------------

  hasMobileSize(): boolean {
    return ElementsResizeObserverService.hasMobileSize();
  }

  // --------------------------------------------------------------------------

  getSpaceWallsDesignsGalleries(spaceData: any): any[] {
    const designs_gallery: any[] = [];
    spaceData.walls.forEach((wall: any) => {
      designs_gallery.push(...wall.designs_gallery);
    });
    return designs_gallery;
  }
}
