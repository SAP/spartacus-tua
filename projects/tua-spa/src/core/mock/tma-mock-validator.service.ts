import { AppliedCapacityAmount, Appointment, AppointmentStateType, QueryServiceQualification, RelatedPlaceRefOrValue, Reservation, ReservationStateType, ResourceCapacityDemand, SearchTimeSlot, TmaInstallationAddress, TmaMeter, TmaPremiseDetail, TmaTechnicalResource } from '../model';
import { Observable } from 'rxjs';
import {
  availableLogicalResources,
  availableTimeSlots,
  invalidPremiseResponse,
  invalidServiceQualification,
  invalidTimeSlotResponse,
  premiseInstallationAddressMocks,
  premiseMeterMocks,
  serviceQualificationFor94120,
  serviceQualificationFor94121,
  serviceQualificationForUtilities,
  validPremiseResponse} from './tma-mock.model';
import { Injectable } from '@angular/core';


@Injectable({providedIn: 'root'})
export class TmaMockValidatorService {

  constructor(){
  }

  // Mock Methods for premise validation
  validatePremiseAddress(premiseDetail: TmaPremiseDetail): Observable<TmaTechnicalResource[]> {
    if (this.isPremiseValid(premiseDetail)) {
      return new Observable<TmaTechnicalResource[]>(observer => observer.next(validPremiseResponse));
    }

    return new Observable<TmaTechnicalResource[]>(observer => observer.next(invalidPremiseResponse));
  }

  protected isPremiseValid(premiseDetail: TmaPremiseDetail): boolean {
    return !!premiseInstallationAddressMocks.find(installationAddress => TmaInstallationAddress.equals(installationAddress, premiseDetail.installationAddress)) && 
     !!premiseMeterMocks.find(meter => TmaMeter.equals(meter, premiseDetail.meter));
  }

  //Mock methods for MSISDN Reservation

  getLogicalResources(resourceCapacityDemand: ResourceCapacityDemand): Observable<AppliedCapacityAmount> {
    return new Observable<AppliedCapacityAmount>(observer => observer.next(availableLogicalResources));
  }

  createReservation(reservation: Reservation): Observable<Reservation> {
   
    var selectedResourceValue = (reservation.reservationItem[0].appliedCapacityAmount[0].resource[0].value);
    var selectedResourceId = reservation.reservationItem[0].appliedCapacityAmount[0].resource[0].id;
    var selectedResourceHref = reservation.reservationItem[0].appliedCapacityAmount[0].resource[0].href;
    
    var relatedPartRole = reservation.relatedParty[0].role;
    var relatedPartyId = reservation.relatedParty[0].id;
    var productId = reservation.productOffering.id;
    var productName = reservation.productOffering.name;

    var reservationId = relatedPartyId + '_' + selectedResourceValue.replace('+91 ','');

    const createdReservation: Reservation = {
      id:reservationId,
      href:"https://hostname:port/ResourcePoolManagement/reservation/"+relatedPartyId+"_"+selectedResourceValue.replace("+91 ",""),
      "@type":"resourceItemReservation",
      reservationState:ReservationStateType.COMPLETED,
      relatedParty:[{
        role:relatedPartRole,
        id:relatedPartyId,
        href:"https://hostname:port/b2ctelcotmfwebservices/v2/partyRole/"+relatedPartyId
      }],
      productOffering : {         
        id : productId,        
        href : "https://hostname:port/b2ctelcotmfwebservices/v2/productOffering/"+productId,        
        name : productName      
      },  
      reservationItem:[
        {
            quantity:1,
            resourceCapacity:[{
              capacityDemandAmount:1,
              type:"phone number"
            }],
            appliedCapacityAmount:[{
              appliedCapacityAmount:1,
              resource:[
                  {
                    id:selectedResourceId,
                    href:selectedResourceHref,
                    referredType:"phone number",
                    value:selectedResourceValue
                  }
              ]
            }],
            subReservationState:"Completed"
        }
      ]
    }
    localStorage.setItem(reservationId, JSON.stringify(createdReservation));
    return new Observable<Reservation>(observer => observer.next(createdReservation));
  }

  updateReservation(updateReservation: Reservation, reservationId: string): Observable<Reservation> {
    var selectedResourceValue = (updateReservation.reservationItem[0].appliedCapacityAmount[0].resource[0].value);
    var selectedResourceId = updateReservation.reservationItem[0].appliedCapacityAmount[0].resource[0].id;
    var selectedResourceHref = updateReservation.reservationItem[0].appliedCapacityAmount[0].resource[0].href;
    
    var relatedPartRole = updateReservation.relatedParty[0].role;
    var relatedPartyId = updateReservation.relatedParty[0].id;
    var productId = updateReservation.productOffering.id;
    var productName = updateReservation.productOffering.name;

    const updatedReservation: Reservation = {
      id: reservationId,
      href:"https://hostname:port/ResourcePoolManagement/reservation/"+reservationId,
      "@type":"resourceItemReservation",
      reservationState:ReservationStateType.COMPLETED,
      relatedParty:[{
        role:relatedPartRole,
        id:relatedPartyId,
        href:"https://hostname:port/b2ctelcotmfwebservices/v2/partyRole/"+relatedPartyId
      }],
      productOffering : {         
        id : productId,        
        href : "https://hostname:port/b2ctelcotmfwebservices/v2/productOffering/"+productId,        
        name : productName      
      },  
      reservationItem:[
        {
            quantity:1,
            resourceCapacity:[{
              capacityDemandAmount:1,
              type:"phone number"
            }],
            appliedCapacityAmount:[{
              appliedCapacityAmount:1,
              resource:[
                  {
                    id:selectedResourceId,
                    href:selectedResourceHref,
                    referredType:"phone number",
                    value:selectedResourceValue
                  }
              ]
            }],
            subReservationState:"Completed"
        }
      ]
    }
    return new Observable<Reservation>(observer => observer.next(updatedReservation));
  }
  
  getReservationsByUserId(userId: string, cartEntryResourceValues: string[]): Observable<Reservation[]> {
   var reservationId:string = userId + '_' + cartEntryResourceValues[0].replace('+91 ','');
   var userReservations:Reservation[] = [];
   userReservations.push(JSON.parse(localStorage.getItem(reservationId)));
   return new Observable<Reservation[]>(observer => observer.next(userReservations));
  }

  //Mock methods for Appointment
  getTimeSlots(searchTimeSlot: SearchTimeSlot): Observable<SearchTimeSlot> {
    if (this.isInstallationAddressValid(searchTimeSlot)) {
      var availableSlots: SearchTimeSlot = {
        id:"99",
        status:"created",
        searchResult:"success",
        relatedPlace:searchTimeSlot.relatedPlace,
        requestedTimeSlot:[
          {
            validFor:searchTimeSlot.requestedTimeSlot[0].validFor
          }
        ],
        availableTimeSlot:availableTimeSlots
      }
      return new Observable<SearchTimeSlot>(observer => observer.next(availableSlots));
    }

    return new Observable<SearchTimeSlot>(observer => observer.next(invalidTimeSlotResponse));
  }

  protected isInstallationAddressValid(searchTimeSlot: SearchTimeSlot) {
    if(searchTimeSlot.relatedPlace.postcode == '94121' || searchTimeSlot.relatedPlace.postcode == '94120'){
      return true;
    }

    return false;  
  }

  setAppointment(appointment: Appointment): Observable<Appointment> {
    var appointmentId: string = Math.random().toString(36).substr(2, 9);
    var createdAppointment:Appointment = {
      validFor: {
        startDateTime: appointment.validFor.startDateTime,
        endDateTime: appointment.validFor.endDateTime
      },
      relatedPlace: {
        role: appointment.relatedParty[0].role,
        streetNr: appointment.relatedPlace.streetNr,
        streetType: appointment.relatedPlace.streetType,
        streetName: appointment.relatedPlace.streetName,
        postcode: appointment.relatedPlace.postcode,
        city: appointment.relatedPlace.city,
        country: appointment.relatedPlace.country,
        stateOfProvince: appointment.relatedPlace.stateOfProvince,
        "@type": "geographicAddress"
      },
      id: appointmentId,
      href: "https://localhost:8080/tmf-api/appointment/v4/appointment/"+appointmentId,
      lastUpdate: new Date(),
      "@type": "Appointment",
      status : AppointmentStateType.INITIALIZED,
      relatedParty:[{
        role:appointment.relatedParty[0].role,
        id:appointment.relatedParty[0].id,
        href:"https://hostname:port/b2ctelcotmfwebservices/v2/partyRole/"+appointment.relatedParty[0].id
      },
      {
        role:appointment.relatedParty[1].role,
        id:appointment.relatedParty[1].id,
        href:"https://hostname:port/b2ctelcotmfwebservices/v2/partyRole/"+appointment.relatedParty[1].id
      }]
    
    };
    localStorage.setItem(appointmentId,JSON.stringify(createdAppointment));
    return new Observable<Appointment>(observer => observer.next(createdAppointment));
  }

  getAppointmentById(id: string): Observable<Appointment> {
    var requiredAppointment:Appointment = JSON.parse(localStorage.getItem(id));
    return new Observable<Reservation>(observer => observer.next(requiredAppointment));
  }

  updateAppointmentById(id: string, appointment: Appointment): Observable<Appointment> {
    const UpdatedAppointment:Appointment = {
      validFor: {
        startDateTime: appointment.validFor.startDateTime,
        endDateTime: appointment.validFor.endDateTime
      },
      relatedPlace: {
        role: appointment.relatedParty[0].role,
        streetNr: appointment.relatedPlace.streetNr,
        streetType: appointment.relatedPlace.streetType,
        streetName: appointment.relatedPlace.streetName,
        postcode: appointment.relatedPlace.postcode,
        city: appointment.relatedPlace.city,
        country: appointment.relatedPlace.country,
        stateOfProvince: appointment.relatedPlace.stateOfProvince,
        "@type": "geographicAddress"
      },
      id: id,
      href: "https://localhost:8080/tmf-api/appointment/v4/appointment/"+id,
      lastUpdate: new Date(),
      "@type": "Appointment",
      status : AppointmentStateType.INITIALIZED,
      relatedParty:[
        {role:appointment.relatedParty[0].role,
          id:appointment.relatedParty[0].id,
          href:"https://hostname:port/b2ctelcotmfwebservices/v2/partyRole/"+appointment.relatedParty[0].id
        },
        {
        role:appointment.relatedParty[1].role,
        id:appointment.relatedParty[1].id,
        href:"https://hostname:port/b2ctelcotmfwebservices/v2/partyRole/"+appointment.relatedParty[1].id
      }]
   }
    return new Observable<Appointment>(observer => observer.next(UpdatedAppointment));
  }

  //Mock method service qualification
  createQueryServiceQualification(queryServiceQualification: QueryServiceQualification): Observable<QueryServiceQualification> {
    
    var relatedPlaceRef : RelatedPlaceRefOrValue = queryServiceQualification.searchCriteria.service.place[0];
    
    if(queryServiceQualification.searchCriteria== null ||queryServiceQualification.searchCriteria.service.place[0].postcode == null 
      || queryServiceQualification.searchCriteria.service.place[0].postcode ==''  ){
        return new Observable<QueryServiceQualification>(observer => observer.next(invalidServiceQualification));
    } else if(relatedPlaceRef.postcode == '94121'){
      return new Observable<QueryServiceQualification>(observer => observer.next(this.createQueryServiceQualificationResponseFor94121(relatedPlaceRef)));
    } else if (relatedPlaceRef.postcode == '94120'){
      return new Observable<QueryServiceQualification>(observer => observer.next(this.createQueryServiceQualificationResponseFor94120(relatedPlaceRef)));
    } else if((relatedPlaceRef.postcode  == '8010' )|| (relatedPlaceRef.postcode == '80808') || (relatedPlaceRef.postcode == '93631') || (relatedPlaceRef.postcode =='3011')){
      return new Observable<QueryServiceQualification>(observer => observer.next(this.createQueryServiceQualificationResponseForUtilities(relatedPlaceRef)));
    } else {
      return new Observable<QueryServiceQualification>(observer => observer.next(this.createQueryServiceQualificationResponseForOtherPostCode(relatedPlaceRef)));
    }
  }

  protected createQueryServiceQualificationResponseForUtilities(relatedPlaceRef : RelatedPlaceRefOrValue): QueryServiceQualification{
    var serviceQualificationUtilities:QueryServiceQualification = {
      id: "58",
      href: "http://serverlocation:port/serviceQualificationManagement/v4/queryServiceQualification/58",
      description: "Query Service Qualification Illustration ",
      instantSyncQualification: true,
      searchCriteria: {
        id: "1",
        service: {
          place: [
            {
              role: "Installation Place",
              "@type": "GeographicAddress",
              city: relatedPlaceRef.city,
              postcode: relatedPlaceRef.postcode,
              streetName: relatedPlaceRef.streetName,
              streetType: relatedPlaceRef.streetType,
              streetNr: relatedPlaceRef.streetNr
            }
          ]
        },
        type: "SearchCriteria"
      },
      serviceQualificationItem: serviceQualificationForUtilities,
      state: "done",
      type: "QueryServiceQualification"
    }

    return serviceQualificationUtilities;
  }

  protected createQueryServiceQualificationResponseFor94121(relatedPlaceRef : RelatedPlaceRefOrValue): QueryServiceQualification{
    var serviceQualification94121:QueryServiceQualification = {
      id: "54",
      href: "http://serverlocation:port/serviceQualificationManagement/v4/queryServiceQualification/54",
      description: "Query Service Qualification Illustration ",
      instantSyncQualification: true,
      searchCriteria: {
        id: "1",
        service: {
        place: [
            {
              role: "Installation Place",
              "@type": "GeographicAddress",
              city: relatedPlaceRef.city,
              postcode: relatedPlaceRef.postcode,
              streetName: relatedPlaceRef.streetName,
              streetType: relatedPlaceRef.streetType,
              streetNr: relatedPlaceRef.streetNr
            }
          ]
        },
        type: "SearchCriteria"
      }
      ,
      serviceQualificationItem: serviceQualificationFor94121,
      state: "done",
      type: "QueryServiceQualification"
    }
    return serviceQualification94121;
  }

  protected createQueryServiceQualificationResponseFor94120(relatedPlaceRef : RelatedPlaceRefOrValue): QueryServiceQualification{
    var serviceQualification94120:QueryServiceQualification = {
      id: "54",
      href: "http://serverlocation:port/serviceQualificationManagement/v4/queryServiceQualification/54",
      description: "Query Service Qualification Illustration ",
      instantSyncQualification: true,
      searchCriteria: {
        id: "1",
        service: {
          place: [
            {
              role: "Installation Place",
              "@type": "GeographicAddress",
              city: relatedPlaceRef.city,
              postcode: relatedPlaceRef.postcode,
              streetName: relatedPlaceRef.streetName,
              streetType: relatedPlaceRef.streetType,
              streetNr: relatedPlaceRef.streetNr
            }
          ]
        },
        type: "SearchCriteria"
      },
      serviceQualificationItem: serviceQualificationFor94120,
      state: "done",
      type: "QueryServiceQualification"
    }

    return serviceQualification94120;
  }

  protected createQueryServiceQualificationResponseForOtherPostCode(relatedPlaceRef : RelatedPlaceRefOrValue): QueryServiceQualification{
    var serviceQualificationAnyotherPostCode:QueryServiceQualification = {
      id: "57",
      href: "http://serverlocation:port/serviceQualificationManagement/v4/queryServiceQualification/57",
      description: "Query Service Qualification Illustration",
      instantSyncQualification: true,
      searchCriteria: {
        id: "1",
        service: {
          place: [
            {
              role: "Installation Place",
              "@type": "GeographicAddress",
              city: relatedPlaceRef.city,
              postcode: relatedPlaceRef.postcode,
              streetName: relatedPlaceRef.streetName,
              streetType: relatedPlaceRef.streetType,
              streetNr: relatedPlaceRef.streetNr
            }
          ]
        },
        type: "SearchCriteria"
      },
      state: "done",
      type: "QueryServiceQualification"
    }
    return serviceQualificationAnyotherPostCode;
  }

}


