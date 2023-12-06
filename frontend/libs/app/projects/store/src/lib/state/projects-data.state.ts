/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AbstractStoreState } from '@ng-techpromux-archetype-project/core-api';
import { ProjectsResetDataStoreAction } from '../action/projects-reset-data-store.action';
import { ProjectsSetItemToEditStoreAction } from '../action/projects-set-item-to-edit-data-store.action';
import { ProjectsSetListDataStoreAction } from '../action/projects-set-list-data-store.action';
import { ProjectsStoreModel } from '../model/projects-data.model';
import { PROJECTS_STATE_TOKEN } from '../variable/variables';

@State<ProjectsStoreModel>({
  name: PROJECTS_STATE_TOKEN,
  defaults: ProjectsStoreState.getStoredDefaultsValue(),
})
@Injectable()
export class ProjectsStoreState extends AbstractStoreState {
  static override getStoredDefaultsValue(): any {
    return {
      list: ProjectsStoreState.getListDataDefaultValue(),
      edit: null,
    };
  }

  static override getStoredKeys(prefix: string = ''): string[] {
    return [];
  }

  // ----------------------------------------------------------

  static getListDataDefaultValue(): any {
    return {
      filters: {},
      sorts: [],
      page: 0,
      pageSize: 20,
      total: 0,
      items: [],
      selected: [],
    };
  }

  // ----------------------------------------------------------

  @Selector()
  static getListData(state: ProjectsStoreModel): any {
    return state.list;
  }

  @Selector()
  static getEditElementIdData(state: ProjectsStoreModel): string | null {
    return state.edit?.id;
  }

  @Selector()
  static getEditElementItemData(state: ProjectsStoreModel): any {
    return state.edit?.item;
  }

  // ----------------------------------------------------------

  @Action(ProjectsSetItemToEditStoreAction)
  setEditData(
    ctx: StateContext<ProjectsStoreModel>,
    action: ProjectsSetItemToEditStoreAction
  ): void {
    const state = ctx.getState();
    ctx.patchState({
      edit: {
        id: action?.id,
        item: action?.item,
      },
    });
  }

  // ----------------------------------------------------------

  @Action(ProjectsSetListDataStoreAction)
  setListData(
    ctx: StateContext<ProjectsStoreModel>,
    action: ProjectsSetListDataStoreAction
  ): void {
    const state = ctx.getState();
    ctx.patchState({
      list: {
        ...action.data,
      },
    });
  }

  // ----------------------------------------------------------

  @Action(ProjectsResetDataStoreAction)
  ProjectsResetDataStoreAction(
    ctx: StateContext<ProjectsStoreModel>,
    action: ProjectsResetDataStoreAction
  ): void {
    const state = ctx.getState();
    ctx.patchState({
      ...ProjectsStoreState.getStoredDefaultsValue(),
    });
  }

  // ----------------------------------------------------------
}
