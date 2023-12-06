/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, inject } from '@angular/core';
import { marker as _i18n } from '@biesbjerg/ngx-translate-extract-marker';
import {
  DatatableColumnsSettings,
  DatatableDataSettings,
  DatatableSettingsHandler,
  DatatableViewSettings,
  ElementsResizeObserverService,
} from '@ng-techpromux-archetype-project/core-ui';
import { BudgetPipe } from '../../pipe/budget.pipe';
import { CreatedAtPipe } from '../../pipe/created-at.pipe';
import { ThumbnailPipe } from '../../pipe/thumbnail.pipe';
import { UpdatedAtPipe } from '../../pipe/updated-at.pipe';

@Injectable()
export class ProjectsTableSettingsHandler extends DatatableSettingsHandler {
  constructor() {
    super();
  }

  protected override getDefaultDataSettings(): DatatableDataSettings {
    const defaultDataSettings = {
      ...super.getDefaultDataSettings(),
      ...{
        rowIdentity: (row: any) => {
          return row.id;
        },
        displayCheck: (row: any, column: string, value: any) => {
          return row.id > 0;
        },
        selectCheck: (row: any, column: string, value: any) => {
          return row.id > 0;
        },
        sorts: [
          {
            prop: 'created_at',
            dir: 'desc',
          },
        ],
        // groupRows: true,
        // groupRowsBy: 'rating',
        // groupExpansionDefault: false,
      },
    };

    return defaultDataSettings;
  }

  protected override getDefaultColumnsSettings(): DatatableColumnsSettings {
    const defaultColumnsSettings = { ...super.getDefaultColumnsSettings() };

    defaultColumnsSettings.columns.push(
      ...[
        ...(ElementsResizeObserverService.hasMobileSize()
          ? [
              {
                name: _i18n('app.projects.ui.table.title.actions'),
                nameTranslation: true,
                prop: 'actions',
                width: 120,
                resizeable: false,
                sortable: false,
                draggable: false,
                canAutoResize: false,
              },
            ]
          : []),
        {
          name: '',
          prop: 'thumbnailUrl',
          width: 70,
          resizeable: false,
          sortable: false,
          draggable: false,
          canAutoResize: false,
          pipe: inject<ThumbnailPipe>(ThumbnailPipe),
        },

        {
          name: _i18n('app.projects.ui.table.title.reference'),
          nameTranslation: true,
          prop: 'reference',
          width: 100,
          resizeable: true,
          sortable: true,
          draggable: false,
          canAutoResize: true,
        },

        {
          name: _i18n('app.projects.ui.table.title.space_count'),
          nameTranslation: true,
          prop: 'space_count',
          width: 100,
          resizeable: false,
          sortable: true,
          draggable: false,
          canAutoResize: false,
        },

        {
          name: _i18n('app.projects.ui.table.title.budget'),
          nameTranslation: true,
          prop: 'budget',
          width: 100,
          resizeable: false,
          sortable: true,
          draggable: false,
          canAutoResize: false,
          pipe: inject<BudgetPipe>(BudgetPipe),
        },

        /*{
          name: _i18n('app.projects.ui.table.title.rating'),
          nameTranslation: true,
          prop: 'rating',
          width: 100,
          resizeable: false,
          sortable: false,
          draggable: false,
          canAutoResize: false,
          pipe: inject<RatingPipe>(RatingPipe),
        },*/

        {
          name: _i18n('app.projects.ui.table.title.created_at'),
          nameTranslation: true,
          prop: 'created_at',
          width: 100,
          resizeable: false,
          sortable: true,
          draggable: false,
          canAutoResize: false,
          pipe: inject<CreatedAtPipe>(CreatedAtPipe),
        },

        {
          name: _i18n('app.projects.ui.table.title.created_by'),
          nameTranslation: true,
          prop: 'created_by_name',
          width: 100,
          resizeable: false,
          sortable: true,
          draggable: false,
          canAutoResize: false,
        },

        {
          name: _i18n('app.projects.ui.table.title.updated_at'),
          nameTranslation: true,
          prop: 'updated_at',
          width: 100,
          resizeable: false,
          sortable: true,
          draggable: false,
          canAutoResize: false,
          pipe: inject<UpdatedAtPipe>(UpdatedAtPipe),
        },

        ...(!ElementsResizeObserverService.hasMobileSize()
          ? [
              {
                name: _i18n('app.projects.ui.table.title.actions'),
                nameTranslation: true,
                prop: 'actions',
                width: 220,
                resizeable: false,
                sortable: false,
                draggable: false,
                canAutoResize: false,
              },
            ]
          : []),
      ]
    );

    return defaultColumnsSettings;
  }

  protected override getDefaultViewSettings(): DatatableViewSettings {
    const defaultViewSettings = {
      ...super.getDefaultViewSettings(),
      ...{
        tableClasses: 'striped bordered', // 'dark',
        wrapperStyles: {
          'min-width': '800px',
        },
        rowClass: (row: any) => {
          return {
            /*
            highRating: row.rating > 3,
            mediumRating: row.rating === 3,
            lowRating: row.rating < 3,
            */
          };
        },
        toggleRowDetailByWindowSize: false,
        groupRowsHeaderHeight: 55,
        // footerHide: false,
        // footerShowCustomTemplate: true,
        footerPagingPageSizeOptions: [5, 10, 15, 20, 50],
        // footerMobileHeight: 60,
        // footerTabletHeight: 60,
        // footerDesktopHeight: 60,
      },
    };
    return defaultViewSettings;
  }

  protected override getDefaultExtraSettings(): any {
    const defaultExtraSettings = {
      ...super.getDefaultExtraSettings(),
    };
    return defaultExtraSettings;
  }
}
