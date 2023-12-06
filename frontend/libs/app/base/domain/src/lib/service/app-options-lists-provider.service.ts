/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, inject } from '@angular/core';
import {
  AbstractOptionsListsProviderService,
  OptionItemModel,
  OptionsListsRequestingOptionsStoreAction,
  OptionsListsStoreState,
} from '@ng-techpromux-archetype-project/core-service';

import { catchError, map, switchMap, take } from 'rxjs';
import {
  BlindsService,
  CategoriesService,
  DoorsService,
  ElectricalMechanismsService,
  FrameMaterialsService,
  GeoInfosService,
  LaboursService,
  ProductTypesService,
  SpaceTypesService,
  WindowsService,
} from '../api-client/laravel9';

@Injectable()
export class AppOptionsListsProviderService extends AbstractOptionsListsProviderService {
  // ----------------------------------------------------

  protected geoInfosService: GeoInfosService =
    inject<GeoInfosService>(GeoInfosService);

  protected spaceTypesService: SpaceTypesService =
    inject<SpaceTypesService>(SpaceTypesService);

  // ----------------------------------------------------

  protected productTypesService: ProductTypesService =
    inject<ProductTypesService>(ProductTypesService);

  protected categoriesService: CategoriesService =
    inject<CategoriesService>(CategoriesService);

  protected doorsService: DoorsService = inject<DoorsService>(DoorsService);

  protected windowsService: WindowsService =
    inject<WindowsService>(WindowsService);

  protected blindsService: BlindsService = inject<BlindsService>(BlindsService);

  protected electricalMechanismsService: ElectricalMechanismsService =
    inject<ElectricalMechanismsService>(ElectricalMechanismsService);

  protected frameMaterialsService: FrameMaterialsService =
    inject<FrameMaterialsService>(FrameMaterialsService);

  // ----------------------------------------------------

  protected laboursService: LaboursService =
    inject<LaboursService>(LaboursService);

  // ----------------------------------------------------

  constructor() {
    super();
  }

  // ----------------------------------------------------

  public override getProviderId(): string {
    return 'app-projects';
  }

  // ----------------------------------------------------

  public override getSupportedOptionsListsKeys(): string[] {
    return [
      'geo_infos_states',
      'geo_infos_cities',

      'spaces_types',

      'products_types',
      'products_categories',

      'products_doors',
      'products_windows',
      'products_blinds',
      'products_electrical_mechanisms',
      'products_electrical_mechanisms_by_category_id',

      'labours',
    ];
  }

  // ----------------------------------------------------

  public override loadOptionsLists(
    keys: string[],
    lang: string
  ): Promise<boolean> {
    this.logger.console.debug(this.__classname, 'loadOptionsLists', keys, lang);
    const requested = this.store.selectSnapshot(
      OptionsListsStoreState.getRequestedKeys
    );
    keys.forEach((key) => {
      const keyAndParts = (key + '__').split('__');
      if (requested[keyAndParts[0] + '__' + keyAndParts[1]]) {
        return;
      }

      switch (keyAndParts[0]) {
        // ----------------------------------------------
        case 'geo_infos_states':
          // ----------------------------------------------
          this.store.dispatch(
            new OptionsListsRequestingOptionsStoreAction(
              keyAndParts[0] + '__' + keyAndParts[1]
            )
          );
          // ----------------------------------------------
          this.geoInfosService
            .itemsIndex(
              {
                info_type: 'STATE',
              },
              null,
              null,
              -1
            )
            .pipe(
              catchError(this.handleError),
              map((response) => {
                const list: OptionItemModel[] = [...response.data].map(
                  (item: any) => {
                    return {
                      value: item.state_code,
                      label: item.state_name,
                      item: {
                        state_code: item.state_code,
                        state_name: item.state_name,
                      },
                    };
                  }
                );
                return list;
              }),
              map((list: OptionItemModel[]) => {
                const unique = Array.from(
                  new Set(list.map((a) => a.value))
                ).map((value) => {
                  return list.find((a) => a.value === value);
                });
                return unique;
              }),
              take(1)
            )
            .subscribe((list: OptionItemModel[] | any) => {
              this.saveOptionsList(key, list, lang);
            });
          // ----------------------------------------------
          break;
        case 'geo_infos_cities':
          // ----------------------------------------------
          this.store.dispatch(
            new OptionsListsRequestingOptionsStoreAction(
              keyAndParts[0] + '__' + keyAndParts[1]
            )
          );
          // ----------------------------------------------
          this.geoInfosService
            .itemsIndex(
              {
                state_code:
                  keyAndParts[1] &&
                  keyAndParts[1] !== '' &&
                  keyAndParts[1] !== 'null' &&
                  keyAndParts[1] !== 'undefined'
                    ? keyAndParts[1]
                    : '---',
                info_type: 'CITY',
              },
              null,
              null,
              -1
            )
            .pipe(
              catchError(this.handleError),
              map((response: any) => {
                const list: OptionItemModel[] = [...response.data].map(
                  (item: any) => {
                    return {
                      value: item.city_code,
                      label: item.city_name,
                      item: {
                        city_code: item.city_code,
                        city_name: item.city_name,
                      },
                    };
                  }
                );
                return list;
              }),
              map((list: OptionItemModel[]) => {
                const unique = Array.from(
                  new Set(list.map((a) => a.value))
                ).map((value) => {
                  return list.find((a) => a.value === value);
                });
                return unique;
              }),
              take(1)
            )
            .subscribe((list: OptionItemModel[] | any) => {
              this.saveOptionsList(key, list, lang);
            });
          // ----------------------------------------------
          break;
        // ----------------------------------------------
        case 'spaces_types':
          // ----------------------------------------------
          this.store.dispatch(
            new OptionsListsRequestingOptionsStoreAction(
              keyAndParts[0] + '__' + keyAndParts[1]
            )
          );
          // ----------------------------------------------
          this.spaceTypesService
            .itemsIndex({}, null, null, -1)
            .pipe(
              catchError(this.handleError),
              map((response: any) => {
                const list: OptionItemModel[] = [...response.data].map(
                  (item: any) => {
                    return {
                      value: item.id,
                      label: item.name,
                      item: {
                        id: item.id,
                        code: item.code,
                        name: item.name,
                        description: item.description,
                      },
                    };
                  }
                );
                return list;
              }),
              map((list: OptionItemModel[]) => {
                const unique = Array.from(
                  new Set(list.map((a) => a.value))
                ).map((value) => {
                  return list.find((a) => a.value === value);
                });
                return unique;
              }),
              take(1)
            )
            .subscribe((list: OptionItemModel[] | any) => {
              this.saveOptionsList(key, list, lang);
            });
          // ----------------------------------------------
          break;
        // ----------------------------------------------
        case 'products_types':
          // ----------------------------------------------
          this.store.dispatch(
            new OptionsListsRequestingOptionsStoreAction(
              keyAndParts[0] + '__' + keyAndParts[1]
            )
          );
          // ----------------------------------------------
          this.productTypesService
            .itemsIndex({}, null, null, -1)
            .pipe(
              catchError(this.handleError),
              map((response: any) => {
                const list: OptionItemModel[] = [...response.data].map(
                  (item: any) => {
                    return {
                      value: item.id,
                      label: item.name,
                      item: {
                        id: item.id,
                        name: item.name,
                        price: item.unit_price,
                        iva_percent: item.iva_percent,
                        installation_price: item.installation_price,
                        installation_iva_percent: item.installation_iva_percent,
                        enabled: item.enabled,
                      },
                    };
                  }
                );
                return list;
              }),
              map((list: OptionItemModel[]) => {
                const unique = Array.from(
                  new Set(list.map((a) => a.value))
                ).map((value) => {
                  return list.find((a) => a.value === value);
                });
                return unique;
              }),
              take(1)
            )
            .subscribe((list: OptionItemModel[] | any) => {
              this.saveOptionsList(key, list, lang);
            });

          // ----------------------------------------------
          break;
        case 'products_categories':
          // ----------------------------------------------
          this.store.dispatch(
            new OptionsListsRequestingOptionsStoreAction(
              keyAndParts[0] + '__' + keyAndParts[1]
            )
          );
          // ----------------------------------------------
          this.categoriesService
            .itemsIndex(
              {
                product_type_code: keyAndParts[1].toLocaleUpperCase(),
              },
              null,
              null,
              -1
            )
            .pipe(
              catchError(this.handleError),
              map((response: any) => {
                const list: OptionItemModel[] = [...response.data].map(
                  (item: any) => {
                    return {
                      value: item.id,
                      label: item.name,
                      item: {
                        id: item.id,
                        name: item.name,
                        price: item.unit_price,
                        iva_percent: item.iva_percent,
                        installation_price: item.installation_price,
                        installation_iva_percent: item.installation_iva_percent,
                        enabled: item.enabled,
                      },
                    };
                  }
                );
                return list;
              }),
              map((list: OptionItemModel[]) => {
                const unique = Array.from(
                  new Set(list.map((a) => a.value))
                ).map((value) => {
                  return list.find((a) => a.value === value);
                });
                return unique;
              }),
              take(1)
            )
            .subscribe((list: OptionItemModel[] | any) => {
              this.saveOptionsList(key, list, lang);
            });

          // ----------------------------------------------
          break;
        case 'products_doors':
          // ----------------------------------------------
          this.store.dispatch(
            new OptionsListsRequestingOptionsStoreAction(
              keyAndParts[0] + '__' + keyAndParts[1]
            )
          );
          // ----------------------------------------------
          this.doorsService
            .itemsIndex({}, null, null, -1)
            .pipe(
              catchError(this.handleError),
              map((response: any) => {
                const list: OptionItemModel[] = [...response.data].map(
                  (item: any) => {
                    return {
                      value: item.id,
                      label: item.name,
                      item: {
                        id: item.id,
                        name: item.name,
                        price: item.unit_price,
                        iva_percent: item.iva_percent,
                        installation_price: item.installation_price,
                        installation_iva_percent: item.installation_iva_percent,
                        enabled: item.enabled,
                      },
                    };
                  }
                );
                return list;
              }),
              map((list: OptionItemModel[]) => {
                const unique = Array.from(
                  new Set(list.map((a) => a.value))
                ).map((value) => {
                  return list.find((a) => a.value === value);
                });
                return unique;
              }),
              take(1)
            )
            .subscribe((list: OptionItemModel[] | any) => {
              this.saveOptionsList(key, list, lang);
            });

          // ----------------------------------------------
          break;
        case 'products_windows':
          // ----------------------------------------------
          this.store.dispatch(
            new OptionsListsRequestingOptionsStoreAction(
              keyAndParts[0] + '__' + keyAndParts[1]
            )
          );
          // ----------------------------------------------
          this.windowsService
            .itemsIndex({}, null, null, -1)
            .pipe(
              catchError(this.handleError),
              map((response: any) => {
                const list: OptionItemModel[] = [...response.data].map(
                  (item: any) => {
                    return {
                      value: item.id,
                      label: item.name,
                      item: {
                        id: item.id,
                        name: item.name,
                        price: item.unit_price,
                        iva_percent: item.iva_percent,
                        installation_price: item.installation_price,
                        installation_iva_percent: item.installation_iva_percent,
                        enabled: item.enabled,
                      },
                    };
                  }
                );
                return list;
              }),
              map((list: OptionItemModel[]) => {
                const unique = Array.from(
                  new Set(list.map((a) => a.value))
                ).map((value) => {
                  return list.find((a) => a.value === value);
                });
                return unique;
              }),
              take(1)
            )
            .subscribe((list: OptionItemModel[] | any) => {
              this.saveOptionsList(key, list, lang);
            });

          // ----------------------------------------------
          break;
        case 'products_blinds':
          // ----------------------------------------------
          this.store.dispatch(
            new OptionsListsRequestingOptionsStoreAction(
              keyAndParts[0] + '__' + keyAndParts[1]
            )
          );
          // ----------------------------------------------
          this.blindsService
            .itemsIndex({}, null, null, -1)
            .pipe(
              catchError(this.handleError),
              map((response: any) => {
                const list: OptionItemModel[] = [...response.data].map(
                  (item: any) => {
                    return {
                      value: item.id,
                      label: item.name,
                      item: {
                        id: item.id,
                        name: item.name,
                        price: item.unit_price,
                        iva_percent: item.iva_percent,
                        installation_price: item.installation_price,
                        installation_iva_percent: item.installation_iva_percent,
                        enabled: item.enabled,
                      },
                    };
                  }
                );
                return list;
              }),
              map((list: OptionItemModel[]) => {
                const unique = Array.from(
                  new Set(list.map((a) => a.value))
                ).map((value) => {
                  return list.find((a) => a.value === value);
                });
                return unique;
              }),
              take(1)
            )
            .subscribe((list: OptionItemModel[] | any) => {
              this.saveOptionsList(key, list, lang);
            });

          // ----------------------------------------------
          break;
        case 'products_electrical_mechanisms':
          // ----------------------------------------------
          this.store.dispatch(
            new OptionsListsRequestingOptionsStoreAction(
              keyAndParts[0] + '__' + keyAndParts[1]
            )
          );
          // ----------------------------------------------
          let category_by_code: any = null;
          this.categoriesService
            .itemsIndex(
              {
                product_type_code: keyAndParts[1].toLocaleUpperCase(),
              },
              null,
              null,
              -1
            )
            .pipe(
              catchError(this.handleError),
              map((response: any) => {
                const list: OptionItemModel[] = [...response.data];
                category_by_code = list.length > 0 ? list[0] : null;
                return category_by_code;
              }),
              switchMap((category: any) => {
                return this.electricalMechanismsService.itemsIndex(
                  {
                    category_id: category?.id,
                  },
                  null,
                  null,
                  -1
                );
              }),
              take(1),
              catchError(this.handleError),
              map((response: any) => {
                const list: OptionItemModel[] = [...response.data].map(
                  (item: any) => {
                    return {
                      value: item.id,
                      label: item.name,
                      item: {
                        id: item.id,
                        name: item.name,
                        price: item.unit_price,
                        iva_percent: item.iva_percent,
                        installation_price: item.installation_price,
                        installation_iva_percent: item.installation_iva_percent,
                        enabled: item.enabled,
                      },
                    };
                  }
                );
                return list;
              }),
              map((list: OptionItemModel[]) => {
                const unique = Array.from(
                  new Set(list.map((a) => a.value))
                ).map((value) => {
                  return list.find((a) => a.value === value);
                });
                return unique;
              }),
              take(1)
            )
            .subscribe((list: OptionItemModel[] | any) => {
              this.saveOptionsList(key, list, lang);
            });
          // ----------------------------------------------
          break;
        case 'products_electrical_mechanisms_by_category_id':
          // ----------------------------------------------
          this.store.dispatch(
            new OptionsListsRequestingOptionsStoreAction(
              keyAndParts[0] + '__' + keyAndParts[1]
            )
          );
          // ----------------------------------------------
          this.electricalMechanismsService
            .itemsIndex(
              {
                category_id: keyAndParts[1],
              },
              null,
              null,
              -1
            )
            .pipe(
              catchError(this.handleError),
              map((response: any) => {
                const list: OptionItemModel[] = [...response.data].map(
                  (item: any) => {
                    return {
                      value: item.id,
                      label: item.name,
                      item: {
                        id: item.id,
                        name: item.name,
                        price: item.unit_price,
                        iva_percent: item.iva_percent,
                        installation_price: item.installation_price,
                        installation_iva_percent: item.installation_iva_percent,
                        enabled: item.enabled,
                      },
                    };
                  }
                );
                return list;
              }),
              map((list: OptionItemModel[]) => {
                const unique = Array.from(
                  new Set(list.map((a) => a.value))
                ).map((value) => {
                  return list.find((a) => a.value === value);
                });
                return unique;
              }),
              take(1)
            )
            .subscribe((list: OptionItemModel[] | any) => {
              this.saveOptionsList(key, list, lang);
            });

          // ----------------------------------------------
          break;
        // ----------------------------------------------
        case 'labours':
          // ----------------------------------------------
          this.store.dispatch(
            new OptionsListsRequestingOptionsStoreAction(
              keyAndParts[0] + '__' + keyAndParts[1]
            )
          );
          // ----------------------------------------------
          this.laboursService
            .itemsIndex(
              {
                product_type_code: keyAndParts[1].toLocaleUpperCase(),
              },
              null,
              null,
              -1
            )
            .pipe(
              catchError(this.handleError),
              map((response: any) => {
                const list: OptionItemModel[] = [...response.data].map(
                  (item: any) => {
                    return {
                      value: item.id,
                      label: item.work_do,
                      item: {
                        id: item.id,
                        name: item.name,
                        description: item.description,
                        price: item.unit_price,
                        iva_percent: item.iva_percent,
                        installation_price: item.installation_price,
                        installation_iva_percent: item.installation_iva_percent,
                        enabled: item.enabled,
                      },
                    };
                  }
                );
                return list;
              }),
              map((list: OptionItemModel[]) => {
                const unique = Array.from(
                  new Set(list.map((a) => a.value))
                ).map((value) => {
                  return list.find((a) => a.value === value);
                });
                return unique;
              }),
              take(1)
            )
            .subscribe((list: OptionItemModel[] | any) => {
              this.saveOptionsList(key, list, lang);
            });

          // ----------------------------------------------
          break;
        // ----------------------------------------------
        default:
          return;
      }
      // ----------------------------------------------
    });
    return Promise.resolve(true);
  }
}
