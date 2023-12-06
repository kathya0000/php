/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, inject } from '@angular/core';
import { AbstractService } from '@ng-techpromux-archetype-project/core-api';
import { Observable, catchError } from 'rxjs';
import { FilesService } from '../api-client/laravel9';
import { IMAGE_STORE_BASE_PATH } from '../variable/variables';

@Injectable()
export class AppFileUploaderService extends AbstractService {
  // ----------------------------------------------------

  protected fileService: FilesService = inject<FilesService>(FilesService);

  protected imageStoreBasePath: string = inject<string>(IMAGE_STORE_BASE_PATH);

  // ----------------------------------------------------

  constructor() {
    super();
  }

  // ----------------------------------------------------

  public upload(blobUrl: string, format: string): Observable<any> {
    return this.fileService
      .upload(blobUrl, format)
      .pipe(catchError(this.handleError));
  }

  public getImageStoreBasePath(): string {
    return this.imageStoreBasePath;
  }

  // ----------------------------------------------------
}
