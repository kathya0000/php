import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProjectsCanvasUtilService } from './service/projects-canvas-util.service';
import { ProjectsDomainFacadeService } from './service/projects-domain-facade.service';

@NgModule({
  imports: [CommonModule],
  providers: [ProjectsDomainFacadeService, ProjectsCanvasUtilService],
})
export class AppProjectsDomainModule {}
