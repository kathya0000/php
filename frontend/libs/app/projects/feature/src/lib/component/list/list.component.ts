/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { marker as _i18n } from '@biesbjerg/ngx-translate-extract-marker';

import { Device } from '@capacitor/device';
import { ProjectsDomainFacadeService } from '@apps/app-projects-domain';
import { ProjectsStoreState } from '@apps/app-projects-store';
import {
  AbstractDomainFacadeService,
  AbstractListFeatureComponent,
  SearchParamsModel,
} from '@ng-techpromux-archetype-project/core-ddd';
import { FlowService } from '@ng-techpromux-archetype-project/core-service';
import {
  DatatableDataSettings,
  ElementsResizeObserverService,
} from '@ng-techpromux-archetype-project/core-ui';
import { Select } from '@ngxs/store';

import { Observable, take } from 'rxjs';

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent
  extends AbstractListFeatureComponent
  implements OnInit, OnDestroy
{
  // ----------------------------------------------------------
  // PROPERTIES
  // ----------------------------------------------------------

  // ----------------------------------------------------------
  // SERVICES
  // ----------------------------------------------------------

  private facade: ProjectsDomainFacadeService =
    inject<ProjectsDomainFacadeService>(ProjectsDomainFacadeService);

  private flow: FlowService = inject<FlowService>(FlowService);

  // ----------------------------------------------------------
  // OBSERVABLES
  // ----------------------------------------------------------

  @Select(ProjectsStoreState.getListData)
  private pagedDataSettings$!: Observable<DatatableDataSettings>;

  // ----------------------------------------------------------

  constructor() {
    super();
  }

  // ----------------------------------------------------------

  protected override getSearchParamsDefaultValue(): SearchParamsModel {
    return {
      page: 0,
      pageSize: 5,
      filters: {},
      sorts: [
        {
          prop: 'created_at',
          dir: 'desc',
        },
      ],
    };
  }

  protected override getPagedDataDefaultValue(): DatatableDataSettings {
    return ProjectsStoreState.getListDataDefaultValue();
  }

  protected override getDomainFacade(): AbstractDomainFacadeService {
    return this.facade;
  }

  protected override getPagedDataSettings$(): Observable<DatatableDataSettings> {
    return this.pagedDataSettings$;
  }

  // ----------------------------------------------------------

  protected goToAdd(): void {
    this.flow.startAction('', 'projects', 'add', 'step1').then();
  }

  // ----------------------------------------------------------

  protected onClickBtn_Edit(event: any): void {
    this.uiModalOpenConfirm(
      this.uiTranslate().instant(
        _i18n('app.projects.feature.list.edit.confirmationTitle')
      ),
      this.uiTranslate().instant(
        _i18n('app.projects.feature.list.edit.confirmationBody')
      ),
      (result) => {
        if (result.confirmed) {
          this.startLoader('List-Click-Edit-Project');
          this.facade.setItemToEdit(event.id, event).then(() => {
            setTimeout(() => {
              this.flow
                .startAction('', 'projects', 'edit', 'step1')
                .then(() => {
                  this.endLoader('List-Click-Edit-Project');
                });
            }, 200);
          });
        }
      }
    );
  }

  // ----------------------------------------------------------

  protected onClickBtn_Delete(event: any): void {
    this.uiModalOpenConfirm(
      this.uiTranslate().instant(
        _i18n('app.projects.feature.list.delete.confirmationTitle')
      ),
      this.uiTranslate().instant(
        _i18n('app.projects.feature.list.delete.confirmationBody')
      ),
      (result) => {
        if (result.confirmed) {
          this.startLoader('List-Click-Delete');
          this.addSubscription(
            this.facade
              .removeItem(event.id, event)
              .pipe(take(1))
              .subscribe((resultD) => {
                if (this.pagedData.items.length === 1) {
                  this.listItems(
                    { _eventName: 'page', page: this.pagedData.page - 1 },
                    true
                  );
                } else {
                  this.listItems(
                    { _eventName: 'page', page: this.pagedData.page },
                    true
                  );
                }
                this.uiModalOpenAlert(
                  this.uiTranslate().instant(
                    _i18n(
                      'app.projects.feature.list.deleted.confirmationTitle'
                    )
                  ),
                  this.uiTranslate().instant(
                    _i18n(
                      'app.projects.feature.list.deleted.confirmationEditedBody'
                    )
                  ),
                  () => {
                    this.endLoader('List-Click-Delete');
                  }
                );
              })
          );
        }
      },
      {
        btnConfirmIconClass: 'cil-trash',
        btnConfirmColorClass: 'danger',
      }
    );
  }

  // ----------------------------------------------------------

  protected onClickBtn_Doc(event: any): void {
    this.startLoader('List-Click-Doc-Download');
    Device.getInfo().then((info) => {
      if (ElementsResizeObserverService.isXSmall()) {
        this.addSubscription(
          this.facade
            .openAndDownloadBudgetPdf(event.id, event, true)
            .pipe(take(1))
            .subscribe((result) => {
              this.endLoader('List-Click-Doc-Download');
            })
        );
      } else {
        this.addSubscription(
          this.facade
            .openAndDownloadBudgetPdf(event.id, event, false)
            .pipe(take(1))
            .subscribe((result) => {
              this.endLoader('List-Click-Doc-Download');
            })
        );
      }
      return;
    });
  }

  // ----------------------------------------------------------

  @HostListener('window:dev-button-clicked', ['$event'])
  protected onDevBtnClickedEvent($event: any): void {
    if (!this.__isDevMode) {
      return;
    }

    this.logger.console.log(
      this.__classname,
      'pageDataLoaded',
      this.pageDataLoaded
    );

    this.logger.console.log(this.__classname, 'pagedData', this.pagedData);

    this.logger.console.log(
      this.__classname,
      'pagedData -> items',
      this.pagedData.items
    );
  }
}
