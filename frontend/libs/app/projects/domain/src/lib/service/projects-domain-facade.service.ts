/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { inject, Injectable, isDevMode } from '@angular/core';

import { marker as _i18n } from '@biesbjerg/ngx-translate-extract-marker';
import { Store } from '@ngxs/store';

import { AppFileUploaderService, ProjectsService } from '@apps/app-base-domain';
import {
  ProjectsResetDataStoreAction,
  ProjectsSetItemToEditStoreAction,
  ProjectsSetListDataStoreAction,
  ProjectsStoreState,
} from '@apps/app-projects-store';
import {
  AbstractDomainFacadeService,
  SearchParamsModel,
} from '@ng-techpromux-archetype-project/core-ddd';
import { TranslationService } from '@ng-techpromux-archetype-project/core-service';
import {
  catchError,
  firstValueFrom,
  forkJoin,
  map,
  Observable,
  of,
  switchMap,
  take,
} from 'rxjs';
import { v4 as uuidV4 } from 'uuid';
import { ProjectsCanvasUtilService } from './projects-canvas-util.service';

@Injectable()
export class ProjectsDomainFacadeService extends AbstractDomainFacadeService {
  // ----------------------------------------------------

  protected readonly __isDevMode = isDevMode();

  // ----------------------------------------------------

  protected store: Store = inject<Store>(Store);

  protected translate: TranslationService =
    inject<TranslationService>(TranslationService);

  protected projectsService: ProjectsService =
    inject<ProjectsService>(ProjectsService);

  protected fileUploader: AppFileUploaderService =
    inject<AppFileUploaderService>(AppFileUploaderService);

  protected canvasUtil: ProjectsCanvasUtilService =
    inject<ProjectsCanvasUtilService>(ProjectsCanvasUtilService);

  // ----------------------------------------------------

  constructor() {
    super();
  }

  // -----------------------------------------------------------------------------------------

  public override reset(): void {
    this.store.dispatch(new ProjectsResetDataStoreAction({}));
  }

  public override dispatchClearListData(): Observable<any> {
    return this.store.dispatch(
      new ProjectsSetListDataStoreAction(
        ProjectsStoreState.getListDataDefaultValue()
      )
    );
  }

  protected override dispatchSetListData(pagedData: any): Observable<any> {
    return this.store.dispatch(new ProjectsSetListDataStoreAction(pagedData));
  }

  // -----------------------------------------------------------------------------------------

  protected override executeListItemsRequest(
    paginationParams: SearchParamsModel
  ): Observable<any> {
    return this.projectsService
      .itemsIndex(
        {},
        null, // q,
        paginationParams.page + 1,
        paginationParams.pageSize,
        paginationParams.sorts && paginationParams.sorts[0]
          ? paginationParams.sorts[0]?.prop
          : null,
        paginationParams.sorts && paginationParams.sorts[0]
          ? paginationParams.sorts[0]?.dir
          : null
      )
      .pipe(catchError(this.handleError));
  }

  protected override createListDataFromListResponse(
    response: any,
    paginationParams: SearchParamsModel
  ): Observable<any> {
    // this.logger.console.debug(this.__classname, 'createListDataFromListResponse ', response, paginationParams);

    return of(response).pipe(
      switchMap((response: any) => {
        const observables: Observable<any>[] = [];
        response.data.forEach((item: any, i: number) => {
          observables.push(this.createItemDataFromSaveResponseData(item));
        });
        return observables.length === 0 ? of([]) : forkJoin(observables);
      }),
      map((updatedItems: any[]) => {
        // custom sorting

        const sortedItems = [...updatedItems];

        // custom filtering

        const filteredItems = [...sortedItems];

        return filteredItems;
      }),
      map((filteredItems: any[]) => {
        // Create Paged Data

        const pagedData: SearchParamsModel = {
          page: response.meta.current_page - 1,
          pageSize: response.meta.per_page,
          total: response.meta.total,

          filters: paginationParams.filters,
          sorts: paginationParams.sorts,

          items: [...filteredItems],
          selected: [],
        };

        return pagedData;
      })
    );
  }

  // -----------------------------------------------------------------------------------------

  public setItemToEdit(id: string | null, item: any | null): Promise<any> {
    return firstValueFrom(
      this.store.dispatch(
        new ProjectsSetItemToEditStoreAction(
          id && item ? id : null,
          id && item ? item : null
        )
      )
    );
  }

  // -----------------------------------------------------------------------------------------

  protected override getBodyDataForSaveItem(
    id: string | null,
    itemData: any
  ): Observable<any> {
    return of(itemData).pipe(
      /*
      switchMap((itemData: any) => {
        return this.updateProjectImagesDesigns(itemData);
      }),
      */
      switchMap((itemData: any) => {
        return this.uploadProjectImagesDesigns(itemData);
      }),
      map((itemData) => {
        const bodyData = {
          // ------------
          ...itemData,
          reference: itemData.reference,
          description: itemData.description,
          // ------------
          client_data: this.utilEncodeData(itemData.client),
          client_data_version: this.getCurrentEncodeDecodeVersion(),
          // ------------
          address_data: this.utilEncodeData(itemData.address),
          address_data_version: this.getCurrentEncodeDecodeVersion(),
          // ------------
          spaces_data: this.utilEncodeData(itemData.spaces),
          spaces_data_version: this.getCurrentEncodeDecodeVersion(),
          space_count: itemData.spaces.length,
          // ------------
        };

        delete bodyData['client'];
        delete bodyData['address'];
        delete bodyData['spaces'];

        delete bodyData['$$__designs_gallery_updated'];

        return bodyData;
      })
    );
  }

  protected override executeSaveItemRequest(
    id: string | null,
    itemData: any,
    bodyData: any
  ): Observable<any> {
    if (!id) {
      return this.projectsService
        .itemsStore(bodyData)
        .pipe(catchError(this.handleError));
    }
    return this.projectsService
      .itemsUpdate(id, bodyData)
      .pipe(catchError(this.handleError));
  }

  protected override createItemDataFromSaveResponseData(
    itemData: any
  ): Observable<any> {
    this.logger.console.debug(
      this.__classname,
      'createItemDataFromSaveResponseData',
      itemData
    );
    const thumbnailUrl: string = itemData.thumbnails
      ? itemData.thumbnails
      : null;
    const newItemData: any = {
      ...itemData,
      thumbnailUrl:
        thumbnailUrl &&
        (thumbnailUrl.startsWith('https://') ||
          thumbnailUrl.startsWith('http://'))
          ? thumbnailUrl
          : './assets/img/application/projects/project-type-' +
            (itemData.id % 7) +
            '.png',
      client: this.utilDecodeData(
        itemData.client_data,
        itemData.client_data_version
      ),
      address: this.utilDecodeData(
        itemData.address_data,
        itemData.address_data_version
      ),
      spaces: this.utilDecodeData(
        itemData.spaces_data,
        itemData.spaces_data_version
      ),
    };

    delete newItemData['client_data'];
    delete newItemData['client_data_version'];

    delete newItemData['address_data'];
    delete newItemData['address_data_version'];

    delete newItemData['spaces_data'];
    delete newItemData['spaces_data_version'];

    this.logger.console.debug(this.__classname, 'newItemData', newItemData);

    return of(newItemData);
  }

  // -----------------------------------------------------------------------------------------

  protected override getBodyDataForRemoveItem(
    id: string | null,
    extraData: any
  ): Observable<any> {
    return of({
      id: id,
    });
  }

  protected override executeRemoveItemRequest(
    id: string | null,
    extraData: any,
    bodyData: any
  ): Observable<any> {
    return this.projectsService
      .itemsDelete(id)
      .pipe(catchError(this.handleError));
  }

  protected override createItemDataFromRemoveResponseData(
    response: any
  ): Observable<any> {
    return of({
      result: response.data ? response.data : response,
      deleted: response.data && response.data['alert-type'] === 'success',
      message: response?.data?.message ? response?.data?.message : response,
    });
  }

  // -----------------------------------------------------------------------------------------

  public openAndDownloadBudgetPdf(
    id: string,
    item: any,
    download = false
  ): Observable<any> {
    const uuid = uuidV4().replace(/-/g, '').toLowerCase();

    const fileName =
      this.translate.translate.instant(
        _i18n('app.projects.feature.list.pdf.title')
      ) +
      (' [' + item.reference + ']-' + uuid + '.pdf')
        .replaceAll(' ', '-')
        .toLowerCase();

    return this.projectsService.budgetPdf(id).pipe(
      catchError(this.handleError),
      map((response) => {
        if (response === null) {
          return false;
        }
        const blobObject = response;
        if ((window.navigator as any)?.msSaveOrOpenBlob) {
          (window.navigator as any)?.msSaveOrOpenBlob(blobObject, fileName);
        } else {
          const url = URL.createObjectURL(blobObject);

          // open in new window

          if (!download) {
            const newWindow = window.open(undefined, '_blank');
            if (newWindow) {
              newWindow.location.href = url;
              newWindow.document.title = fileName;
            }
          }

          // open download dialog

          if (download) {
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
        }
        return true;
      })
    );
  }

  public getUrlForBudgetPdf(id: string, item: any): Observable<any> {
    const uuid = uuidV4().replace(/-/g, '').toLowerCase();

    const fileName =
      this.translate.translate.instant(
        _i18n('app.projects.feature.list.pdf.title')
      ) +
      (' [' + item.reference + ']-' + uuid + '.pdf')
        .replaceAll(' ', '-')
        .toLowerCase();

    return this.projectsService.budgetPdf(id).pipe(
      catchError(this.handleError),
      map((response) => {
        if (response === null) {
          return false;
        }
        const blobObject = response;
        const url = URL.createObjectURL(blobObject);
        return url;
      })
    );
  }

  // -----------------------------------------------------------------------------------------

  public calculateAreaFromSpaceData(spaceData: any): number {
    const walls = spaceData.walls;

    let x = 0,
      y = 0;

    let xc = 0,
      yc = 0;

    let degrees =
      -1 * (180 - (walls.wall_length > 0 ? walls[0].wall_angle : 0));

    walls.forEach((wall: any, index: number) => {
      xc += x;
      yc += y;

      const wall_width = Number.parseFloat('' + wall.wall_width);

      degrees += 180 - wall.wall_angle;

      x += wall_width * Math.cos((degrees * Math.PI) / 180);
      y += wall_width * Math.sin((degrees * Math.PI) / 180);
    });

    xc = walls.wall_length > 2 ? xc / walls.wall_length : 0;
    yc = walls.wall_length > 2 ? yc / walls.wall_length : 0;

    let A = 0;

    (x = 0), (y = 0);

    degrees = -1 * (180 - (walls.wall_length > 0 ? walls[0].wall_angle : 0));

    const xs_array: number[] = [];
    const ys_array: number[] = [];

    walls.forEach((wall: any, index: number) => {
      const wall_width = Number.parseFloat('' + wall.wall_width);

      degrees += 180 - wall.wall_angle;

      const x1 = x;
      const y1 = y;

      xs_array.push(x);
      ys_array.push(y);

      x += wall_width * Math.cos((degrees * Math.PI) / 180);
      y += wall_width * Math.sin((degrees * Math.PI) / 180);

      /*
      const x2 = x;
      const y2 = y;

      const L1 = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
      const L2 = Math.sqrt(Math.pow(xc - x1, 2) + Math.pow(yc - y1, 2));
      const L3 = Math.sqrt(Math.pow(xc - x2, 2) + Math.pow(yc - y2, 2));
      const SP = (L1 + L2 + L3) / 2;
      const Ar = Math.sqrt(SP * (SP - L1) * (SP - L2) * (SP - L3));
      A += Ar;
      */
    });

    let A1 = 0;
    let A2 = 0;
    xs_array.forEach((x, i) => {
      A1 += xs_array[i % xs_array.length] * ys_array[(i + 1) % xs_array.length];
      A2 += ys_array[i % xs_array.length] * xs_array[(i + 1) % xs_array.length];
    });

    // this.logger.console.debug('Area 1', A);

    // this.logger.console.debug('Area 2', Math.abs(A1 - A2) / 2);

    A = Math.abs(A1 - A2) / 2;

    return A;
  }

  public updateProjectImagesDesigns(
    projectData: any,
    initialItemData: any
  ): Observable<any> {
    projectData.$$__designs_gallery_updated = false;
    return of(projectData).pipe(
      switchMap((projectData: any) => {
        const observables: Observable<any>[] = [];
        observables.push(of(projectData));
        projectData.spaces
          .map((spaceData: any, index: number, array: any[]) => {
            const initialSpaceData =
              initialItemData &&
              initialItemData.spaces &&
              initialItemData.spaces[index]
                ? initialItemData.spaces[index]
                : null;

            spaceData['designs_gallery'] = initialSpaceData
              ? initialSpaceData['designs_gallery']
              : [];

            spaceData.doors.forEach((doorData: any, i: number) => {
              doorData['designs_gallery'] =
                initialSpaceData &&
                initialSpaceData.doors &&
                initialSpaceData.doors[i]
                  ? initialSpaceData.doors[i]['designs_gallery']
                  : [];
            });
            spaceData.walls.forEach((wallData: any, i: number) => {
              wallData['designs_gallery'] =
                initialSpaceData &&
                initialSpaceData.walls &&
                initialSpaceData.walls[i]
                  ? initialSpaceData.walls[i]['designs_gallery']
                  : [];
            });
            spaceData.windows.forEach((windowData: any, i: number) => {
              windowData['designs_gallery'] =
                initialSpaceData &&
                initialSpaceData.windows &&
                initialSpaceData.windows[i]
                  ? initialSpaceData.windows[i]['designs_gallery']
                  : [];
            });
            spaceData.modules.forEach((moduleData: any, i: number) => {
              moduleData['designs_gallery'] =
                initialSpaceData &&
                initialSpaceData.modules &&
                initialSpaceData.modules[i]
                  ? initialSpaceData.modules[i]['designs_gallery']
                  : [];
            });
            return spaceData;
          })
          .filter((spaceData: any, index: number, array: any[]) => {
            const spaceDataToCheck = JSON.parse(JSON.stringify(spaceData));
            const itemSpaceDataToCheck = JSON.parse(
              JSON.stringify(
                initialItemData &&
                  initialItemData.spaces &&
                  initialItemData.spaces[index]
                  ? initialItemData.spaces[index]
                  : null
              )
            );
            (itemSpaceDataToCheck
              ? [spaceDataToCheck, itemSpaceDataToCheck]
              : [spaceDataToCheck]
            ).forEach((spaceDataToCheck: any) => {
              spaceDataToCheck['designs_gallery'] = [];
              spaceDataToCheck?.doors?.forEach((doorData: any) => {
                spaceDataToCheck['designs_gallery'] = [];
                spaceDataToCheck['door_photos_gallery'] = [];
              });
              spaceDataToCheck?.walls?.forEach((wallData: any) => {
                spaceDataToCheck['designs_gallery'] = [];
                spaceDataToCheck['wall_photos_gallery'] = [];
              });
              spaceDataToCheck?.windows?.forEach((windowData: any) => {
                windowData['designs_gallery'] = [];
                windowData['window_photos_gallery'] = [];
              });
              spaceDataToCheck?.modules?.forEach((moduleData: any) => {
                moduleData['designs_gallery'] = [];
                moduleData['module_photos_gallery'] = [];
              });
            });

            return (
              this.__isDevMode ||
              JSON.stringify(spaceDataToCheck) !==
                JSON.stringify(itemSpaceDataToCheck)
            );
          })
          .forEach((spaceData: any, index: number, array: any[]) => {
            observables.push(this.updateSpaceImagesDesigns(spaceData));
          });
        return forkJoin(observables);
      }),
      map(([projectData, ...others]) => {
        projectData.$$__designs_gallery_updated = true;
        return projectData;
      })
    );
  }

  private uploadProjectImagesDesigns(projectData: any): Observable<any> {
    return of(projectData).pipe(
      switchMap((projectData) => {
        const observables: Observable<any>[] = [];
        observables.push(of(projectData));
        projectData.spaces.forEach((space: any) => {
          space.designs_gallery.forEach((photo: any) => {
            if (!photo.saved) {
              observables.push(
                this.fileUploader.upload(photo.url, photo.format).pipe(
                  take(1),
                  map((response: any) => {
                    photo.url = response.file;
                    photo.saved = true;
                  })
                )
              );
            }
          });
          space.walls.forEach((wall: any, wall_index: number) => {
            wall.designs_gallery.forEach((photo: any, photo_index: number) => {
              if (!photo.saved) {
                observables.push(
                  this.fileUploader.upload(photo.url, photo.format).pipe(
                    take(1),
                    map((response: any) => {
                      photo.url = response.file;
                      photo.saved = true;
                    })
                  )
                );
              }
            });
          });
          space.doors.forEach((door: any) => {
            door.door_photos_gallery.forEach((photo: any) => {
              if (!photo.saved) {
                observables.push(
                  this.fileUploader.upload(photo.url, photo.format).pipe(
                    take(1),
                    map((response: any) => {
                      photo.url = response.file;
                      photo.saved = true;
                    })
                  )
                );
              }
            });
          });
          space.windows.forEach((window: any, window_index: number) => {
            window.window_photos_gallery.forEach(
              (photo: any, photo_index: number) => {
                if (!photo.saved) {
                  observables.push(
                    this.fileUploader.upload(photo.url, photo.format).pipe(
                      take(1),
                      map((response: any) => {
                        photo.url = response.file;
                        photo.saved = true;
                      })
                    )
                  );
                }
              }
            );
          });
        });
        return forkJoin(observables);
      }),
      map(([projectData, ...others]) => {
        return projectData;
      })
    );
  }

  // -----------------------------------------------------------------------------------------

  private updateSpaceImagesDesigns(spaceData: any): Observable<any> {
    return of(spaceData).pipe(
      switchMap((spaceData) => {
        // const space$: Subject<any> = new Subject<any>();

        const canvas = this.canvasUtil.getSpaceDesignCanvas(spaceData);

        if (canvas) {
          /*
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              setTimeout(() => {
                spaceData.designs_gallery = [
                  {
                    url: url,
                    saved: false,
                    format: 'image/png',
                  },
                ];
                space$.next(spaceData);
                space$.complete();
              }, 100);
            }
          }, 'image/png');
          */
          const url = canvas.toDataURL('image/png');
          spaceData.designs_gallery = [
            {
              url: url,
              saved: false,
              format: 'image/png',
            },
          ];
          // space$.next(spaceData);
          // space$.complete();
        }
        return of(spaceData); // space$.asObservable();
      }),
      switchMap((spaceData: any) => {
        const observables: Observable<any>[] = [];
        observables.push(of(spaceData));
        spaceData.walls.forEach((wallData: any) => {
          observables.push(this.updateWallImagesDesigns(spaceData, wallData));
        });
        return forkJoin(observables);
      }),
      map(([spaceData, ...others]) => {
        return spaceData;
      })
    );
  }

  private updateWallImagesDesigns(
    spaceData: any[],
    wallData: any
  ): Observable<any> {
    return of(spaceData).pipe(
      switchMap((spaceData) => {
        // const wall$: Subject<any> = new Subject<any>();

        const canvas = this.canvasUtil.getWallDesignCanvas(spaceData, wallData);

        if (canvas) {
          /*
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              setTimeout(() => {
                wallData.designs_gallery = [
                  {
                    url: url,
                    saved: false,
                    format: 'image/png',
                  },
                ];
                wall$.next(wallData);
                wall$.complete();
              }, 100);
            }
          }, 'image/png');
          */
          const url = canvas.toDataURL('image/png');
          wallData.designs_gallery = [
            {
              url: url,
              saved: false,
              format: 'image/png',
            },
          ];
        }

        return of(wallData); // wall$.asObservable();
      })
    );
  }

  // -----------------------------------------------------------------------------------------
}
