import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './component/home/home.component';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [HomeComponent],
  exports: [HomeComponent],
})
export class AppBaseHomeFeatureModule {}
