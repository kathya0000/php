/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { AppFileUploaderService } from '@apps/app-base-domain';
import { ProjectsDomainFacadeService } from '@apps/app-projects-domain';
import { ProjectsStoreState } from '@apps/app-projects-store';
import { marker as _i18n } from '@biesbjerg/ngx-translate-extract-marker';
import {
  AbstractDomainFacadeService,
  AbstractWizardFormFeatureComponent,
} from '@ng-techpromux-archetype-project/core-ddd';
import { ElementsResizeObserverService } from '@ng-techpromux-archetype-project/core-ui';
import { UtilUuidService } from '@ng-techpromux-archetype-project/core-util';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import {
  BehaviorSubject,
  Observable,
  debounceTime,
  distinctUntilChanged,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';

@Component({
  template: '',
})
export abstract class AbstractAddEditComponent
  extends AbstractWizardFormFeatureComponent
  implements OnInit, OnDestroy
{
  // ----------------------------------------------------------
  // SERVICES
  // ----------------------------------------------------------

  private uuidService: UtilUuidService =
    inject<UtilUuidService>(UtilUuidService);

  private sanitizer: DomSanitizer = inject<DomSanitizer>(DomSanitizer);

  private fileUploader: AppFileUploaderService = inject<AppFileUploaderService>(
    AppFileUploaderService
  );

  private facade: ProjectsDomainFacadeService =
    inject<ProjectsDomainFacadeService>(ProjectsDomainFacadeService);

  // ----------------------------------------------------------
  // PROPERTIES
  // ----------------------------------------------------------

  // Element Data

  @SelectSnapshot(ProjectsStoreState.getEditElementItemData)
  protected element!: any | null;

  @SelectSnapshot(ProjectsStoreState.getEditElementIdData)
  protected elementId!: string | null;

  protected elementIsNew: boolean | null = null;

  // FormData ToSave

  protected formDataToSave: any = null;

  // Project data

  protected projectFormData: any = {};
  protected projectFormCreated: boolean = false;

  // Spaces data

  protected spacesFormsData: any[] = [];
  protected spacesFormsCreated: boolean[] = [];

  protected spacesDataOptionsList$: BehaviorSubject<any[]> =
    new BehaviorSubject<any[]>([]);

  // budget pdf url

  protected budgetPdfUrl: string | null = null;

  // Tabs

  protected formTabActive = 0;

  protected spaceTabActive = 0;

  protected spaceTabActiveAdded = false;

  protected spaceTabActiveDeleted = false;

  // image store base path

  protected imageStoreBasePath = this.fileUploader.getImageStoreBasePath();

  // ----------------------------------------------------------

  constructor() {
    super();
  }

  // ----------------------------------------------------------

  protected getDomainFacade(): AbstractDomainFacadeService {
    return this.facade;
  }

  // ----------------------------------------------------------

  protected override getCurrentFlowContextName(): string {
    return '';
  }

  protected override getCurrentFlowModuleName(): string {
    return 'projects';
  }

  protected override getCurrentFlowActionName(): string {
    return this.elementIsNew ? 'add' : 'edit';
  }

  // ----------------------------------------------------------

  protected override initFormGroup(): void {
    this.formGroup = this.fb.group({
      project: this.fb.group({}),
      spaces: this.fb.array([]),
    });
  }

  // ----------------------------------------------------------

  protected override initAction(): void {
    if (
      this.currentStep !== 'step1' ||
      this.currentStepIsFirstAccess !== true
    ) {
      return;
    }
    if (this.elementIsNew) {
      this.facade.setItemToEdit(null, null);
    } else {
      if (!this.elementId || !this.element) {
        this.logger.console.error(
          this.__classname,
          'There is not element to edit',
          this.elementId,
          this.element
        );
        this.facade.setItemToEdit(null, null);
        this.flow.closeCurrentAction().then(() => {
          this.flow
            .startAction(
              this.getCurrentFlowContextName(),
              this.getCurrentFlowModuleName(),
              'list',
              '',
              null,
              true
            )
            .then();
        });
      }
    }
    this.projectFormData = this.getProjectInitialData();
    this.spacesFormsData = this.getSpacesInitialData();

    this.spacesFormsData.forEach((spaceData, index) => {
      this.startLoader('Add-Edit-Create-Space-Tab-' + (index + 1));
    });
  }

  // ---------------------------------------------------------------

  protected getSpaceDefaultFormData(): any {
    return {
      id: this.uuidService.uuid(),
      $$__uuid: this.uuidService.uuid(),
      walls: [{}, {}, {}, {}],
      doors: [{}],
      windows: [],
      modules: [
        {
          mechanisms: [{}],
        },
      ],
    };
  }

  // ----------------------------------------------------------

  protected getProjectInitialData(): any {
    return this.elementIsNew ? {} : JSON.parse(JSON.stringify(this.element));
  }

  protected getSpacesInitialData(): any[] {
    const spacesData = this.elementIsNew
      ? []
      : this.element?.spaces
      ? JSON.parse(JSON.stringify(this.element?.spaces))
      : [];
    spacesData.forEach((space: any) => {
      space.id = space.id ? space.id : this.uuidService.uuid();
      space.$$__uuid = this.uuidService.uuid();
    });
    return spacesData;
  }

  // ----------------------------------------------------------

  protected onProjectFormGroupCreated(form: FormGroup<any>): void {
    this.logger.console.debug(
      this.__classname,
      'onProjectFormGroupCreated',
      form
    );

    this.formGroup.setControl('project', form);

    this.projectFormCreated = true;

    this.onFormGroupCreated(form);
  }

  protected onSpaceFormGroupCreated(form: FormGroup, i: number): void {
    this.logger.console.debug(
      this.__classname,
      'onSpaceFormGroupCreated',
      form
    );

    (this.formGroup.get('spaces') as FormArray).controls[i] = form;

    if (this.formIsEditable) {
      if (
        this.spaceTabActiveDeleted !== true &&
        this.spaceTabActiveAdded === true
      ) {
        this.spaceTabActive = i;
        this.spaceTabActiveAdded = false;
      }
    }

    this.endLoader('Add-Edit-Create-Space-Tab-' + (i + 1));

    this.spacesFormsCreated[i] = true;

    this.checkSpacesChangesSubscriptions();

    this.onFormGroupCreated(form);

    setTimeout(() => {
      this.cdr.detectChanges();
      this.onActivateSpaceTabX(this.spaceTabActive);
    }, 100);
  }

  // ---------------------------------------------------------------

  protected onAddItemToSpaceFormArray(): void {
    this.startLoader(
      'Add-Edit-Create-Space-Tab-' + (this.spacesFormsData.length + 1)
    );
    setTimeout(() => {
      this.spaceTabActiveAdded = true;
      this.spaceTabActiveDeleted = false;

      this.spacesFormsData.push(this.getSpaceDefaultFormData());

      setTimeout(() => {
        this.cdr.detectChanges();
      }, 100);
    }, 100);
  }

  protected onDeleteSpaceItem(event: any, index: number): void {
    this.uiModalOpenConfirm(
      this.uiTranslate().instant(
        _i18n('app.projects.ui.form.spaces.delete.confirmationTitle')
      ),
      this.uiTranslate().instant(
        _i18n('app.projects.ui.form.spaces.delete.confirmationBody')
      ),
      (result) => {
        if (result.confirmed) {
          if (this.formIsEditable) {
            this.startLoader('Add-Edit-Remove-Space-Tab-' + index);

            setTimeout(() => {
              const totalSpaces = this.spacesFormsData.length;
              const tempSpaceData = this.formGroup.get('spaces')?.getRawValue();
              // this.spacesFormsData
              for (let i = index; i < totalSpaces - 1; i++) {
                this.spacesFormsData[i] = {
                  ...tempSpaceData[i + 1],
                  $$__uuid: this.uuidService.uuid(),
                };
              }

              this.spacesFormsCreated.pop();

              this.spacesFormsData.pop();

              (this.formGroup.get('spaces') as FormArray).removeAt(
                totalSpaces - 1
              );

              this.spaceTabActiveDeleted = true;

              if (totalSpaces <= 1) {
                this.spaceTabActive = 0;
              } else if (index === totalSpaces - 1) {
                this.spaceTabActive = index - 1;
              } else {
                this.spaceTabActive = index;
              }

              // this.spacesFormsData = [...this.spacesFormsData];

              this.endLoader('Add-Edit-Remove-Space-Tab-' + index);

              setTimeout(() => {
                this.cdr.detectChanges();
                this.onActivateSpaceTabX(this.spaceTabActive);
              }, 100);
            }, 100);
          }
        }
      }
    );
  }

  protected spacesFormsDataTrackByFn(index: number, item: any): any {
    return item.$$__uuid;
  }

  protected checkSpacesChangesSubscriptions(): void {
    const spacesFormArray = this.formGroup.get('spaces') as FormArray;

    this.addSubscription(
      spacesFormArray.valueChanges
        .pipe(debounceTime(200), distinctUntilChanged())
        .subscribe(() => {
          this.emitSpacesDataOptionList();
        })
    );

    const total = spacesFormArray.controls.length;

    for (let index = 0; index < total; index++) {
      const spaceFormGroup = spacesFormArray.controls[index] as FormGroup;

      const spaceTypeIdFormControl = spaceFormGroup.get('space_type_id');

      if (
        !(spaceTypeIdFormControl as any).$$__hasValueChangesEventSubscription
      ) {
        (spaceTypeIdFormControl as any).$$__hasValueChangesEventSubscription =
          true;

        this.addSubscription(
          spaceTypeIdFormControl?.valueChanges
            .pipe(debounceTime(200), distinctUntilChanged())
            .subscribe(() => {
              this.emitSpacesDataOptionList();
            })
        );
        this.emitSpacesDataOptionList();
      }

      const wallsArrayFormControl = spaceFormGroup.get('walls');

      if (
        !(wallsArrayFormControl as any).$$__hasValueChangesEventSubscription
      ) {
        (wallsArrayFormControl as any).$$__hasValueChangesEventSubscription =
          true;

        this.addSubscription(
          wallsArrayFormControl?.valueChanges
            .pipe(debounceTime(200), distinctUntilChanged())
            .subscribe(() => {
              this.emitSpacesDataOptionList();
            })
        );
        this.emitSpacesDataOptionList();
      }
    }

    this.emitSpacesDataOptionList();
  }

  protected emitSpacesDataOptionList(): void {
    const spacesFormArray = this.formGroup.get('spaces') as FormArray;

    const total = spacesFormArray.controls.length;

    const spacesDataOptionsList: any[] = [];

    for (let index = 0; index < total; index++) {
      const spaceFormGroup = spacesFormArray.controls[index] as FormGroup;

      const id = spaceFormGroup.get('id')?.value;
      const space_type_id = spaceFormGroup.get('space_type_id')?.value;
      const space_walls = spaceFormGroup
        .get('walls')
        ?.getRawValue()
        .map((wallData: any, index: number, arr: any[]) => {
          const value =
            String.fromCharCode('A'.charCodeAt(0) + index) +
            ' - ' +
            String.fromCharCode(
              'A'.charCodeAt(0) + (index < arr.length - 1 ? index + 1 : 0)
            );
          return {
            wall_identifier: value,
            wall_area:
              Number.parseFloat(
                isNaN(wallData.wall_width) ? 0 : wallData.wall_width
              ) *
              Number.parseFloat(
                isNaN(wallData.wall_height) ? 0 : wallData.wall_height
              ),
          };
        });

      spacesDataOptionsList.push({
        id: id,
        space_type_id: space_type_id,
        space_area: this.facade.calculateAreaFromSpaceData(
          spaceFormGroup.getRawValue()
        ),
        walls: space_walls,
      });
    }

    this.spacesDataOptionsList$.next(spacesDataOptionsList);
  }

  // ----------------------------------------------------------

  protected updateFormDataBeforeSave(): Observable<any> {
    if (this.formGroup && this.formGroup.get('project')) {
      this.projectFormData = this.formGroup.get('project')?.getRawValue();
    }
    if (this.formGroup && this.formGroup.get('spaces')) {
      this.spacesFormsData = this.formGroup.get('spaces')?.getRawValue();
    }

    this.formDataToSave = this.getFormDataToSave();

    return of(this.formDataToSave).pipe(
      tap((formDataToSave) => {
        this.logger.console.debug(
          this.__classname,
          'updateFormDataBeforeSave -> formDataToSave',
          formDataToSave
        );
      }),
      switchMap((formDataToSave: any) => {
        return this.facade.updateProjectImagesDesigns(
          formDataToSave,
          this.element
        );
      }),
      tap((formDataToSave) => {
        this.logger.console.debug(
          this.__classname,
          'updateFormDataBeforeSave -> formDataToSave - updated',
          formDataToSave
        );
      })
    );
  }

  // ---------------------------------------------------------------

  protected getFormDataToSave() {
    const entityData = {
      ...this.formGroup.get('project')?.getRawValue(),
    };

    // Project data

    delete entityData['$$__hr'];
    delete entityData['$$__br'];

    delete entityData['client']['$$__hr'];
    delete entityData['client']['$$__br'];

    delete entityData['address']['$$__hr'];
    delete entityData['address']['$$__br'];

    // Spaces data

    const spacesData: any[] = this.formGroup.get('spaces')?.getRawValue();

    spacesData.forEach((spaceData: any) => {
      delete spaceData['$$__hr'];
      delete spaceData['$$__br'];

      if (spaceData.window_has_window !== true) {
        spaceData.windows = [];
      }

      spaceData.modules.forEach((moduleData: any) => {
        delete moduleData['$$__hr'];
        delete moduleData['$$__br'];
      });

      spaceData.windows.forEach((windowData: any) => {
        delete windowData['$$__hr'];
        delete windowData['$$__br'];

        windowData.window_area =
          Number.parseInt(windowData.window_width) *
          Number.parseInt(windowData.window_height);
      });

      spaceData.doors.forEach((doorData: any) => {
        delete doorData['$$__hr'];
        delete doorData['$$__br'];

        doorData.door_area =
          Number.parseInt('' + doorData.door_width) *
          Number.parseInt('' + doorData.door_height);
      });

      spaceData.walls.forEach((wallData: any) => {
        delete wallData[''];
        delete wallData['$$__hr'];
        delete wallData['$$__br'];

        wallData.wall_area =
          Number.parseInt('' + wallData.wall_width) *
          Number.parseInt('' + wallData.wall_height);

        spaceData.windows.forEach((windowData: any) => {
          if (wallData.wall_identifier === windowData.window_wall_identifier) {
            wallData.wall_area = wallData.wall_area - windowData.window_area;
          }
        });

        spaceData.doors.forEach((doorData: any) => {
          if (wallData.wall_identifier === doorData.door_wall_identifier) {
            wallData.wall_area = wallData.wall_area - doorData.door_area;
          }
        });
      });

      if (spaceData.walls.length >= 2) {
        const spaceArea = this.facade.calculateAreaFromSpaceData(spaceData);
        spaceData.space_floor_area = Number.parseInt('' + spaceArea);
        spaceData.space_ceiling_area = spaceData.space_floor_area;
      } else {
        spaceData.space_floor_area = 0;
      }
    });

    const formDataToSave = {
      ...entityData,
      spaces: spacesData,
    };

    return formDataToSave;
  }

  // ----------------------------------------------------------

  protected override isFormGroupValid(): boolean {
    let formValid = super.isFormGroupValid();

    // general validation

    if (!formValid) return false;

    // spaces validation

    formValid = formValid && this.isSpacesFormArrayValid();

    if (!formValid) return false;

    return formValid;
  }

  protected isProjectFormGroupValid(): boolean {
    if (!this.formIsEditable) return true;
    return !!(
      !this.formGroup.get('project')?.touched ||
      this.formGroup.get('project')?.valid
    );
  }

  protected isSpacesFormArrayValid(): boolean {
    if (!this.formIsEditable) return true;
    let formValid = true;
    (this.formGroup.get('spaces') as FormArray).controls.forEach(
      (spaceForm, index) => {
        formValid =
          formValid && this.spacesFormsCreated[index] && spaceForm.valid;
        (spaceForm.get('modules') as FormArray).controls.forEach(
          (moduleItemForm, index2) => {
            formValid =
              formValid &&
              moduleItemForm?.valid &&
              (moduleItemForm as any)?.$$__embedded &&
              (moduleItemForm as any)?.$$__embedded?.valid;
          }
        );
      }
    );
    return formValid;
  }

  protected isSpaceFormGroupValid(index: number): boolean {
    if (!this.formIsEditable) return true;
    if (!this.spacesFormsCreated[index]) return false;

    const spaceForm = (this.formGroup.get('spaces') as FormArray)?.controls[
      index
    ];
    let formValid = true;

    formValid = formValid && this.spacesFormsCreated[index] && spaceForm.valid;
    (spaceForm.get('modules') as FormArray).controls.forEach(
      (moduleForm, index2) => {
        formValid =
          formValid &&
          moduleForm?.valid &&
          (moduleForm as any)?.$$__embedded &&
          (moduleForm as any)?.$$__embedded?.valid;
      }
    );

    return formValid;
  }

  // ----------------------------------------------------------

  protected override executeAction_Start(): void {
    this.flow.closeCurrentAction().then(() => {
      this.flow
        .startAction(
          this.getCurrentFlowContextName(),
          this.getCurrentFlowModuleName(),
          this.getCurrentFlowActionName(),
          'step1',
          {},
          true
        )
        .then();
    });
  }

  protected override executeAction_Previous(): void {
    this.startLoader('Add-Execute-Backward');
    setTimeout(() => {
      this.flow.stepBackward().then(() => {
        this.formDataToSave = null;
        // this.formTabActive = 0;
        // this.spaceTabActive = 0;
        this.endLoader('Add-Execute-Backward');
        setTimeout(() => {
          this.cdr.detectChanges();
        }, 100);
      });
    }, 100);
  }

  protected override executeAction_Next(): void {
    if (this.formIsEditable && !this.isFormGroupValid()) {
      this.uiModalOpenAlert(
        this.uiTranslate().instant(
          _i18n('app.projects.feature.add.steps.next.confirmationTitle')
        ),
        this.uiTranslate().instant(
          this.elementIsNew
            ? _i18n('app.projects.feature.add.steps.next.confirmationAddedBody')
            : _i18n(
                'app.projects.feature.add.steps.next.confirmationEditedBody'
              )
        ),
        (result) => {
          window.scrollTo(0, 0);

          // general

          this.formGroup.markAsDirty();
          this.formGroup.markAllAsTouched();

          // spaces

          const spacesFormArray = this.formGroup.get('spaces') as FormArray;

          spacesFormArray.controls.forEach((spaceForm, index) => {
            spaceForm.markAsDirty();
            spaceForm.markAllAsTouched();

            (spaceForm.get('modules') as FormArray).controls.forEach(
              (moduleItemForm, index2) => {
                moduleItemForm.markAsDirty();
                moduleItemForm.markAllAsTouched();
                (moduleItemForm as any).$$__embedded.markAsDirty();
                (moduleItemForm as any).$$__embedded.markAllAsTouched();
              }
            );
          });

          // detect all changes

          setTimeout(() => {
            this.formService.detectChanges();
          }, 100);
        }
      );

      return;
    }

    this.startLoader('Add-Execute-Next');

    setTimeout(() => {
      this.flow
        .startStep(
          this.getCurrentFlowContextName(),
          this.getCurrentFlowModuleName(),
          this.getCurrentFlowActionName(),
          'step2'
        )
        .then(() => {
          this.endLoader('Add-Execute-Next');

          this.startLoader('Add-Execute-Next-Update-Before-Save');
          this.addSubscription(
            this.updateFormDataBeforeSave()
              .pipe(take(1))
              .subscribe((result) => {
                this.endLoader('Add-Execute-Next-Update-Before-Save');
                setTimeout(() => {
                  this.cdr.detectChanges();
                }, 100);
              })
          );
        });
    }, 100);
  }

  protected override executeAction_End(): void {
    this.uiModalOpenConfirm(
      this.uiTranslate().instant(
        _i18n('app.projects.feature.add.steps.end.confirmationTitle')
      ),
      this.uiTranslate().instant(
        this.elementIsNew
          ? _i18n('app.projects.feature.add.steps.end.confirmationAddedBody')
          : _i18n('app.projects.feature.add.steps.end.confirmationEditedBody')
      ),
      (result) => {
        if (result.confirmed) {
          this.startLoader('Add-Execute-End-Go-To-Last-Step');

          setTimeout(() => {
            const formDataToSaveId = this.elementIsNew ? null : this.elementId;
            const formDataToSaveValue = { ...this.formDataToSave };

            this.addSubscription(
              this.getDomainFacade()
                .saveItem(formDataToSaveId, formDataToSaveValue)
                .pipe(take(1))
                .subscribe((item: any) => {
                  this.endLoader('Add-Execute-End-Go-To-Last-Step');
                  this.logger.console.debug('Item saved!!!', item);
                  if (!item) {
                    this.uiModalOpenAlert(
                      this.uiTranslate().instant(
                        _i18n(
                          'app.projects.feature.add.step3.alert.confirmationErrorTitle'
                        )
                      ),
                      this.uiTranslate().instant(
                        this.elementIsNew
                          ? _i18n(
                              'app.projects.feature.add.step3.alert.confirmationAddedErrorBody'
                            )
                          : _i18n(
                              'app.projects.feature.add.step3.alert.confirmationEditedErrorBody'
                            )
                      ),
                      (result) => {
                        //
                      }
                    );
                    return;
                  } else {
                    this.uiModalOpenAlert(
                      this.uiTranslate().instant(
                        _i18n(
                          'app.projects.feature.add.step3.alert.confirmationTitle'
                        )
                      ),
                      this.uiTranslate().instant(
                        this.elementIsNew
                          ? _i18n(
                              'app.projects.feature.add.step3.alert.confirmationAddedBody'
                            )
                          : _i18n(
                              'app.projects.feature.add.step3.alert.confirmationEditedBody'
                            )
                      ),
                      () => {
                        if (this.elementIsNew) {
                          this.logger.console.debug('Item added!!!', item);
                          this.facade.setItemToEdit(item.id, item).then(() => {
                            this.flow
                              .startAction(
                                '',
                                'projects',
                                'edit',
                                'step1',
                                null,
                                true
                              )
                              .then();
                          });
                        } else {
                          this.logger.console.debug('Item updated!!!', item);
                          this.facade.setItemToEdit(item.id, item).then(() => {
                            this.executeAction_Previous();
                            this.budgetPdfUrl = null;
                            this.onActivateProjectTabX(this.formTabActive);
                            setTimeout(() => {
                              this.cdr.detectChanges();
                            }, 100);
                          });
                        }
                      }
                    );
                  }
                })
            );
          }, 100);
        }
      }
    );
  }

  protected override executeAction_Exit(): void {
    this.uiModalOpenConfirm(
      this.uiTranslate().instant(
        _i18n('app.projects.feature.add.steps.exit.confirmationTitle')
      ),
      this.uiTranslate().instant(
        _i18n('app.projects.feature.add.steps.exit.confirmationBody')
      ),
      (result) => {
        if (result.confirmed) {
          setTimeout(() => {
            this.flow.closeCurrentAction().then(() => {
              this.flow
                .startAction(
                  this.getCurrentFlowContextName(),
                  this.getCurrentFlowModuleName(),
                  'list',
                  '',
                  null,
                  true
                )
                .then();
            });
          }, 100);
        }
      }
    );
  }

  // ---------------------------------------------------------------

  protected onActivateProjectTabX(tab: number): void {
    this.formTabActive = tab;

    switch (tab) {
      case 0:
        // project tab
        break;
      case 1:
        // spaces tab
        break;
      case 2:
        // tab
        break;
      case 3:
        // tab
        break;
      case 4:
        // details tab
        break;
      case 5:
        // budget pdf tab
        if (this.budgetPdfUrl === null) {
          this.startLoader('Add-Edit-Budget-Pdf-Load');
          this.addSubscription(
            this.facade
              .getUrlForBudgetPdf(this.elementId as string, this.element)
              .pipe(take(1))
              .subscribe((result: any) => {
                this.endLoader('Add-Edit-Budget-Pdf-Load');
                if (result) {
                  this.budgetPdfUrl =
                    this.sanitizer.bypassSecurityTrustResourceUrl(
                      result
                    ) as any;
                  setTimeout(() => {
                    this.cdr.detectChanges();
                  }, 100);
                }
              })
          );
        }
        break;
      default:
        break;
    }
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 100);
  }

  protected onActivateSpaceTabX(tab: number): void {
    this.spaceTabActive = tab;
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 100);
  }

  // ---------------------------------------------------------------

  protected isVisibleTab_GENERAL_DATA(): boolean | undefined | null {
    return true;
  }

  protected isVisibleTab_SPACES(): boolean | undefined | null {
    return !this.elementIsNew;
  }

  protected isVisibleTab_DETAILS(): boolean | undefined | null {
    return !this.elementIsNew;
  }

  protected isVisibleTab_BUDGET(): boolean | undefined | null {
    return !this.elementIsNew;
  }

  // ---------------------------------------------------------------

  protected isDisabledTab_GENERAL_DATA(): boolean | undefined | null {
    return false;
  }

  protected isDisabledTab_SPACES(): boolean | undefined | null {
    return this.elementIsNew;
  }

  protected isDisabledTab_DETAILS(): boolean | undefined | null {
    return this.elementIsNew;
  }

  protected isDisabledTab_BUDGET(): boolean | undefined | null {
    return this.elementIsNew;
  }

  // ---------------------------------------------------------------

  protected override isVisibleBtn_Exit(): boolean {
    return true;
  }

  // ---------------------------------------------------------------

  protected getSpaceWallsDesignsGalleries(spaceData: any): any[] {
    const designs_gallery: any[] = [];
    spaceData.walls.forEach((wall: any) => {
      designs_gallery.push(...wall.designs_gallery);
    });
    return designs_gallery;
  }

  // ---------------------------------------------------------------

  protected hasMobileSize(): boolean {
    return ElementsResizeObserverService.hasMobileSize();
  }

  // ---------------------------------------------------------------

  @HostListener('window:dev-button-clicked', ['$event'])
  protected onDevBtnClickedEvent($event: any): void {
    if (!this.__isDevMode) {
      return;
    }

    this.logger.console.log(
      this.__classname,
      'Id, is New, Element',
      this.elementId,
      this.elementIsNew,
      this.element
    );

    this.logger.console.log(this.__classname, 'formGroup', this.formGroup);

    this.logger.console.log(
      this.__classname,
      'form.getRawValue',
      this.formGroup.getRawValue()
    );

    this.logger.console.log(
      this.__classname,
      'formDataToSave',
      this.formDataToSave
    );

    this.logger.console.log(
      this.__classname,
      'getFormDataToSave',
      this.getFormDataToSave()
    );
  }

  protected printThis() {
    window.print();
  }
}
