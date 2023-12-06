export * from './blinds.service';
export * from './categories.service';
export * from './ceilings.service';
export * from './doors.service';
export * from './electrical-mechanisms.service';
export * from './files.service';
export * from './floors.service';
export * from './frame-materials.service';
export * from './geo-infos.service';
export * from './labours.service';
export * from './product-types.service';
export * from './projects.service';
export * from './sellers.service';
export * from './space-types.service';
export * from './windows.service';

import { BlindsService } from './blinds.service';
import { CategoriesService } from './categories.service';
import { CeilingsService } from './ceilings.service';
import { DoorsService } from './doors.service';
import { ElectricalMechanismsService } from './electrical-mechanisms.service';
import { FilesService } from './files.service';
import { FloorsService } from './floors.service';
import { FrameMaterialsService } from './frame-materials.service';
import { GeoInfosService } from './geo-infos.service';
import { LaboursService } from './labours.service';
import { ProductTypesService } from './product-types.service';
import { ProjectsService } from './projects.service';
import { SellersService } from './sellers.service';
import { SpaceTypesService } from './space-types.service';
import { WindowsService } from './windows.service';

export const APIS = [
  // --------------------------------
  ProjectsService,
  // --------------------------------
  GeoInfosService,
  // --------------------------------
  FilesService,
  // --------------------------------
  ProductTypesService,
  CategoriesService,

  DoorsService,
  WindowsService,
  BlindsService,
  ElectricalMechanismsService,
  // --------------------------------
  FloorsService,
  CeilingsService,
  FrameMaterialsService,
  // --------------------------------
  LaboursService,
  // --------------------------------
  SellersService,
  SpaceTypesService,
];
