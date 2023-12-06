/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Laravel
 * Joy VoyagerApi module adds REST Api end points to Voyager with Passport and Swagger support https://github.com/rxcod9/joy-voyager-api.
 *
 * OpenAPI spec version: 1.0.0
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */ /* tslint:disable:no-unused-variable member-ordering */

import { HttpClient, HttpEvent, HttpResponse } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';

import { Observable } from 'rxjs';
import { Configuration } from '../configuration';
import { BASE_PATH } from '../variables';
import { AbstractDomainService } from './abstract/abstract-domain.service';

@Injectable()
export class ProjectsService extends AbstractDomainService {
  constructor(
    httpClient: HttpClient,
    @Optional() @Inject(BASE_PATH) basePath: string,
    @Optional() configuration: Configuration
  ) {
    super(httpClient, basePath, configuration);
  }

  protected override getDomainNamePath(): string {
    return 'projects';
  }

  /**
   * budgetPdf
   *
   * @param id
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public budgetPdf(
    id: any,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<any>;
  public budgetPdf(
    id: any,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<any>>;
  public budgetPdf(
    id: any,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<any>>;
  public budgetPdf(
    id: any,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (id === null || id === undefined) {
      throw new Error(
        'Required parameter id was null or undefined when calling budgetPdf.'
      );
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    const httpHeaderAccepts: string[] = [];

    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);

    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [];

    // overriding to accept pdf response

    headers = headers.set('Accept', 'application/pdf');

    return this.httpClient.request(
      'get',
      `${this.basePath}/api/${this.getDomainNamePath()}/${encodeURIComponent(
        String(id)
      )}/budgetpdf`,
      {
        responseType: 'blob',
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }
}
