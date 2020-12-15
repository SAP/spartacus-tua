import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BadRequestHandler, GlobalMessageType, ErrorModel } from '@spartacus/core';
import { LOCAL_STORAGE } from '../../../../util';

const { ORDER_PROCESSING_ERROR } = LOCAL_STORAGE.ORDER_PROCESSING;

@Injectable({
  providedIn: 'root'
})
export class TmaBadRequestHandler extends BadRequestHandler {

  handleError(request: HttpRequest<any>, response: HttpErrorResponse): void {
    super.handleError(request, response);
    this.handleOrderProcessingError(request, response);
  }

  protected handleOrderProcessingError(
    _request: HttpRequest<any>,
    response: HttpErrorResponse
  ): void {
    this.getErrors(response)
      .filter(
        (e) =>
          e.type === ORDER_PROCESSING_ERROR
      )
      .forEach((error: ErrorModel) => {
        this.globalMessageService.add(
          error.message,
          GlobalMessageType.MSG_TYPE_ERROR
        );
      });
  }
}
