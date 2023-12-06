/* eslint-disable @typescript-eslint/no-explicit-any */
export class ProjectsSetItemToEditStoreAction {
  static readonly type = '[APP-PROJECTS] Set Item to Edit Data';

  constructor(public id: string | null, public item: any) {}
}
