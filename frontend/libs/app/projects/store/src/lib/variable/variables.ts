import { StateToken } from '@ngxs/store';
import { ProjectsStoreModel } from '../model/projects-data.model';

export const PROJECTS_STATE_TOKEN = new StateToken<ProjectsStoreModel>('projects');
