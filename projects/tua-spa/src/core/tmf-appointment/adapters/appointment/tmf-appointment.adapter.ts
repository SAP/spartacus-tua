import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConverterService } from '@spartacus/core';
import { Appointment } from '../../../model';
import { TmfAppointmentApiModel } from '../../tmf-appointment-models';
import { AppointmentAdapter } from '../../../appointment/store';
import { TmfAppointmentEndpointsService } from '../../services';
import { APPOINTMENT_NORMALIZER } from '../../../appointment';

@Injectable({
  providedIn: 'root',
})
export class TmfAppointmentAdapter implements AppointmentAdapter {
  constructor(
    protected http: HttpClient,
    protected tmfAppointmentEndpointsService: TmfAppointmentEndpointsService,
    protected converter: ConverterService
  ) {}

  setAppointment(appointment: Appointment): Observable<Appointment> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const url: string = this.tmfAppointmentEndpointsService.getUrl(
      'createAppointment'
    );
    return this.http
      .post<TmfAppointmentApiModel.TmfAppointment>(url, appointment, { headers })
      .pipe(this.converter.pipeable(APPOINTMENT_NORMALIZER));
  }

  getAppointmentById(id: string): Observable<Appointment> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const url: string = this.tmfAppointmentEndpointsService.getUrl(
      'getAppointmentById',
      {
        id: id,
      }
    );
    return this.http
      .get<TmfAppointmentApiModel.TmfAppointment>(url, { headers })
      .pipe(this.converter.pipeable(APPOINTMENT_NORMALIZER));
  }

  updateAppointmentById(
    id: string,
    appointment: Appointment
  ): Observable<Appointment> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const url: string = this.tmfAppointmentEndpointsService.getUrl(
      'updateAppointmentById',
      {
        id: id,
      }
    );
    return this.http
      .patch<TmfAppointmentApiModel.TmfAppointment>(url, appointment, { headers })
      .pipe(this.converter.pipeable(APPOINTMENT_NORMALIZER));
  }
}
