import { QueryServiceQualification, Reservation, ResourceRef, SearchTimeSlot, ServiceQualificationItem, TimePeriod, TimeSlot, TmaInstallationAddress, TmaMeter, TmaTechnicalResource, TmaTechnicalResourceType, TmaTmfRelatedParty } from '../../../model';

//Mock Models for Premise Details
export const technicalResources: TmaTechnicalResource[] = [
  {
    'id': '72990',
    'type': TmaTechnicalResourceType.METER
  },
  {
    'id': '0.0.2.4.1.1.12.0.0.0.0.0.0.0.0.3.72.0',
    'type': TmaTechnicalResourceType.READING
  },
  {
    'id': 'electricity',
    'type': TmaTechnicalResourceType.DIVISION
  }
];

export const validPremiseResponse: any = {
    "status":"SUCCESS",
    "technicalResources":technicalResources
};

export const invalidPremiseResponse: TmaTechnicalResource[] = [];

export const premiseInstallationAddressMocks: TmaInstallationAddress[] = [
  {
    buildingNumber: '666',
    streetName: 'Pinot',
    apartmentNumber: '',
    city: 'Walldorf',
    country: {
      isocode: 'DE',
      name: 'Germany'
    },
    region: null,
    postalCode: '80808'
  },
  {
    buildingNumber: '666',
    streetName: 'Pinot',
    apartmentNumber: '1A',
    city: 'Walldorf',
    country: {
      isocode: 'DE',
      name: 'Germany'
    },
    region: null,
    postalCode: '80808'
  },
  {
    buildingNumber: '15',
    streetName: 'Murgasse',
    apartmentNumber: '',
    city: 'Graz',
    country: {
      isocode: 'AT',
      name: 'Austria'
    },
    region: null,
    postalCode: '8010'
  },
  {
    buildingNumber: '15',
    streetName: 'Murgasse',
    apartmentNumber: '21',
    city: 'Graz',
    country: {
      isocode: 'AT',
      name: 'Austria'
    },
    region: null,
    postalCode: '8010'
  },
  {
    buildingNumber: '34',
    streetName: 'Sierra',
    apartmentNumber: '',
    city: 'Kingsburg',
    country: {
      isocode: 'US',
      name: 'United States'
    },
    region: {
      isocode: 'US-CA',
      isocodeShort: 'CA'
    },
    postalCode: '93631'
  },
  {
    buildingNumber: '34',
    streetName: 'Sierra',
    apartmentNumber: '104',
    city: 'Kingsburg',
    country: {
      isocode: 'US',
      name: 'United States'
    },
    region: {
      isocode: 'US-CA',
      isocodeShort: 'CA'
    },
    postalCode: '93631'
  },
  {
    buildingNumber: '34',
    streetName: 'Sierra',
    apartmentNumber: '105',
    city: 'Kingsburg',
    country: {
      isocode: 'US',
      name: 'United States'
    },
    region: {
      isocode: 'US-CA',
      isocodeShort: 'CA'
    },
    postalCode: '93631'
  },
  {
    buildingNumber: '35',
    streetName: 'Marktgasse',
    apartmentNumber: '',
    city: 'Bern',
    country: {
      isocode: 'CH',
      name: 'Switzerland'
    },
    region: null,
    postalCode: '3011'
  },
  {
    buildingNumber: '35',
    streetName: 'Marktgasse',
    apartmentNumber: '1',
    city: 'Bern',
    country: {
      isocode: 'CH',
      name: 'Switzerland'
    },
    region: null,
    postalCode: '3011'
  },
  {
    buildingNumber: '35',
    streetName: 'Marktgasse',
    apartmentNumber: '2',
    city: 'Bern',
    country: {
      isocode: 'CH',
      name: 'Switzerland'
    },
    region: null,
    postalCode: '3011'
  }
];

export const premiseMeterMocks: TmaMeter[] = [
  {
    id: 'UWU111',
    type: 'electricity'
  },
  {
    id: 'UWU111',
    type: 'gas'
  },
  {
    id: 'PQR1234',
    type: 'electricity'
  },
  {
    id: 'PQR1234',
    type: 'gas'
  },
  {
    id: 'MKL357',
    type: 'electricity'
  },
  {
    id: 'MKL357',
    type: 'gas'
  },
  {
    id: '102847',
    type: 'electricity'
  },
  {
    id: '102847',
    type: 'gas'
  }
];

//Mock models for MSISDN Reservations
 export const logicalResources: ResourceRef[] = [
  {
		"id": "1", 
		"href": " http://server:port/resourceInventoryManagement/logicalResource/1", 
		"referredType":"phone number", 
	  "value":"+91 7111944679"
	}, 
	{
		"id": "+2", 
		"href": " http://server:port/resourceInventoryManagement/logicalResource/2",
		"referredType":"phone number", 
	  "value":"+91 7113932404"
	}, 
	{
		"id": "3",
		"href": " http://server:port/resourceInventoryManagement/logicalResource/3", 
		"referredType":"phone number", 
		"value":"+91 7104016471" 
	}, 
	{
		"id": "4",
		"href": " http://server:port/resourceInventoryManagement/logicalResource/4",
		"referredType":"phone number", 
		"value":"+91 7113163986" 
	}, 
  {
    "id": "5",
    "href": " http://server:port/resourceInventoryManagement/logicalResource/5", 
    "referredType":"phone number", 
    "value":"+91 7120901703"
	},
	{
    "id": "6",
    "href": " http://server:port/resourceInventoryManagement/logicalResource/6",
    "referredType": "phone number",
    "value": "+91 7129506827"
  }
 ];

export const availableLogicalResources:any = {
  "appliedResourceCapacity" :
  { 
    "appliedCapacityAmount" : 5,
    "resource" : logicalResources 
  } 
};

//Mock Models for appointment
export const currentDate :Date = new Date();

export const nextDateSlot1ST: Date = new Date(currentDate);
nextDateSlot1ST.setDate((new Date()).getDate()+1);
nextDateSlot1ST.setHours(12);
nextDateSlot1ST.setMinutes(0);

export var nextDateSlot1ET: Date = new Date(currentDate);
nextDateSlot1ET.setDate(currentDate.getDate()+1);
nextDateSlot1ET.setHours(12);
nextDateSlot1ET.setMinutes(30);

export const nextDateSlot2ST: Date = new Date(currentDate);
nextDateSlot2ST.setDate(currentDate.getDate()+1);
nextDateSlot2ST.setHours(12);
nextDateSlot2ST.setMinutes(30);

export const nextDateSlot2ET: Date = new Date(currentDate);
nextDateSlot2ET.setDate(currentDate.getDate()+1);
nextDateSlot2ET.setHours(13);
nextDateSlot2ET.setMinutes(0);

export const nextDateSlot3ST: Date = new Date(currentDate);
nextDateSlot3ST.setDate(currentDate.getDate()+1);
nextDateSlot3ST.setHours(13);
nextDateSlot3ST.setMinutes(0);

export const nextDateSlot3ET: Date = new Date(currentDate);
nextDateSlot3ET.setDate(currentDate.getDate()+1);
nextDateSlot3ET.setHours(13);
nextDateSlot3ET.setMinutes(30);

export const nextToNextDateSlot1ST: Date = new Date(currentDate);
nextToNextDateSlot1ST.setDate(currentDate.getDate()+2);
nextToNextDateSlot1ST.setHours(12);
nextToNextDateSlot1ST.setMinutes(0);

export const nextToNextDateSlot1ET: Date = new Date(currentDate);
nextToNextDateSlot1ET.setDate(currentDate.getDate()+2);
nextToNextDateSlot1ET.setHours(12);
nextToNextDateSlot1ET.setMinutes(30);

export const nextToNextDateSlot2ST: Date = new Date(currentDate);
nextToNextDateSlot2ST.setDate(currentDate.getDate()+2);
nextToNextDateSlot2ST.setHours(12);
nextToNextDateSlot2ST.setMinutes(30);

export const nextToNextDateSlot2ET: Date = new Date(currentDate);
nextToNextDateSlot2ET.setDate(currentDate.getDate()+2);
nextToNextDateSlot2ET.setHours(13);
nextToNextDateSlot2ET.setMinutes(0);

export const nextToNextDateSlot3ST: Date = new Date(currentDate);
nextToNextDateSlot3ST.setDate(currentDate.getDate()+1);
nextToNextDateSlot3ST.setHours(13);
nextToNextDateSlot3ST.setMinutes(0);

export const nextToNextDateSlot3ET: Date = new Date(currentDate);
nextToNextDateSlot3ET.setDate(currentDate.getDate()+1);
nextToNextDateSlot3ET.setHours(13);
nextToNextDateSlot3ET.setMinutes(30);

export const timePeriod1:TimePeriod = {
  startDateTime:nextDateSlot1ST,
  endDateTime:nextDateSlot1ET 
};

export const timePeriod2:TimePeriod = {
  startDateTime:nextDateSlot2ST,
  endDateTime:nextDateSlot2ET 
};

export const timePeriod3:TimePeriod = {
  startDateTime:nextDateSlot3ST,
  endDateTime:nextDateSlot3ET 
};

export const timePeriod4:TimePeriod = {
  startDateTime:nextToNextDateSlot1ST,
  endDateTime:nextToNextDateSlot1ET 
};

export const timePeriod5:TimePeriod = {
  startDateTime:nextToNextDateSlot2ST,
  endDateTime:nextToNextDateSlot2ET 
};

export const timePeriod6:TimePeriod = {
  startDateTime:nextToNextDateSlot3ST,
  endDateTime:nextToNextDateSlot3ET 
};

export const technician1 : TmaTmfRelatedParty = {
  id: "58",
  href: "https://host:port/partyManagement/individual/58",
  name: "Adam Smith",
  role: "technician",
};

export const technician2 : TmaTmfRelatedParty = {
  id: "56",
  href: "https://host:port/partyManagement/individual/56",
  name: "John Doe",
  role: "technician",
};

export const availableTimeSlots: TimeSlot[] = [
  {
    id:"365",
    href:"https://host:port/appointment/searchtimeslot/99/availableTimeSlot/365",
    validFor:timePeriod1,
    relatedParty:technician1
  },
  {
    id:"921",
    href:"https://host:port/appointment/searchtimeslot/99/availableTimeSlot/921",
    validFor:timePeriod2,
    relatedParty:technician2
  },
  {
    id:"325",
    href:"https://host:port/appointment/searchtimeslot/99/availableTimeSlot/325",
    validFor:timePeriod3,
    relatedParty:technician1
  },
  {
    id:"326",
    href:"https://host:port/appointment/searchtimeslot/99/availableTimeSlot/326",
    validFor:timePeriod4,
    relatedParty:technician2
  },
  {
    id:"327",
    href:"https://host:port/appointment/searchtimeslot/99/availableTimeSlot/327",
    validFor:timePeriod5,
    relatedParty:technician1
  },
  {
    id:"328",
    href:"https://host:port/appointment/searchtimeslot/99/availableTimeSlot/328",
    validFor:timePeriod6,
    relatedParty:technician2
  }
];

export const invalidTimeSlotResponse:SearchTimeSlot= {

};

export const invalidServiceQualification:QueryServiceQualification = {
  type:"QueryServiceQualification",
  searchCriteria:null
};

export const serviceQualificationForUtilities:ServiceQualificationItem[] = [
  {
    id: "1",
    service: {
      serviceSpecification: {
        id: "138",
        href: "http://serverlocation:port/serviceCatalogManagement/v4/serviceSpecification/138",
        name: "electricity_svc",
        type: "ServiceSpecification"
      }
    },
    type: "ServiceQualificationItem"
  },
  {
    id: "2",
    service: {
      serviceSpecification: {
        id: "148",
        href: "http://serverlocation:port/serviceCatalogManagement/v4/serviceSpecification/148",
        name: "gas_svc",
        type: "ServiceSpecification"
      }
    },
    type: "ServiceQualificationItem"
  }
];

export const serviceQualificationFor94121:ServiceQualificationItem[] = [
  {
    id: "1",
    service: {
      serviceSpecification: {
        id: "78",
        href: "http://serverlocation:port/serviceCatalogManagement/v4/serviceSpecification/78",
        name: "copper_internet_svc",
        type: "ServiceSpecification"
      },
      serviceCharacteristic: [
        {
          name: "upload_speed",
          valueType: "String",
          value: "100 MB/s"
        },
        {
          name: "download_speed",
          valueType: "String",
          value: "100 MB/s"
        }
      ]
    },
    type: "ServiceQualificationItem"
  },
  {
    id: "2",
    service: {
      serviceSpecification: {
        id: "88",
        href: "http://serverlocation:port/serviceCatalogManagement/v4/serviceSpecification/88",
        name: "fiber_internet_svc",
        type: "ServiceSpecification"
      },
      serviceCharacteristic: [
        {
          name: "upload_speed",
          valueType: "String",
          value: "500 MB/s"
        },
        {
          name: "download_speed",
          valueType: "String",
          value: "500 MB/s"
        }
      ]
    },
    type: "ServiceQualificationItem"
  },
  {
    id: "3",
    service: {
      serviceSpecification: {
        id: "98",
        href: "http://serverlocation:port/serviceCatalogManagement/v4/serviceSpecification/98",
        name: "5g_internet_svc",
        type: "ServiceSpecification"
      },
      serviceCharacteristic: [
        {
          name: "upload_speed",
          valueType: "String",
          value: "1 GB/s"
        },
        {
          name: "download_speed",
          valueType: "String",
          value: "10 GB/s"
        }
      ]
    },
    type: "ServiceQualificationItem"
  },
  {
    id: "4",
    service: {
      serviceSpecification: {
        id: "108",
        href: "http://serverlocation:port/serviceCatalogManagement/v4/serviceSpecification/108",
        name: "cable_tv_svc",
        type: "ServiceSpecification"
      }
    },
    type: "ServiceQualificationItem"
  },
  {
    id: "5",
    service: {
      serviceSpecification: {
        id: "118",
        href: "http://serverlocation:port/serviceCatalogManagement/v4/serviceSpecification/118",
        name: "satellite_tv_svc",
        type: "ServiceSpecification"
      }
    },
    type: "ServiceQualificationItem"
  },
  {
    id: "6",
    service: {
      serviceSpecification: {
        id: "128",
        href: "http://serverlocation:port/serviceCatalogManagement/v4/serviceSpecification/128",
        name: "ip_tv_svc",
        type: "ServiceSpecification"
      }
    },
    type: "ServiceQualificationItem"
  }
];

export const serviceQualificationFor94120:ServiceQualificationItem[] = [
  {
    id: "1",
    service: {
      serviceSpecification: {
        id: "78",
        href: "http://serverlocation:port/serviceCatalogManagement/v4/serviceSpecification/78",
        name: "copper_internet_svc",
        type: "ServiceSpecification"
      },
      serviceCharacteristic: [
        {
          name: "upload_speed",
          valueType: "String",
          value: "100 MB/s"
        },
        {
          name: "download_speed",
          valueType: "String",
          value: "100 MB/s"
        }
      ]
    },
    type: "ServiceQualificationItem"
  },
  {
    id: "2",
    service: {
      serviceSpecification: {
        id: "88",
        href: "http://serverlocation:port/serviceCatalogManagement/v4/serviceSpecification/88",
        name: "fiber_internet_svc",
        type: "ServiceSpecification"
      },
      serviceCharacteristic: [
        {
          name: "upload_speed",
          valueType: "String",
          value: "500 MB/s"
        },
        {
          name: "download_speed",
          valueType: "String",
          value: "500 MB/s"
        }
      ]
    },
    type: "ServiceQualificationItem"
  },
  {
    id: "3",
    service: {
      serviceSpecification: {
        id: "98",
        href: "http://serverlocation:port/serviceCatalogManagement/v4/serviceSpecification/98",
        name: "5g_internet_svc",
        type: "ServiceSpecification"
      },
      serviceCharacteristic: [
        {
          name: "upload_speed",
          valueType: "String",
          value: "1 GB/s"
        },
        {
          name: "download_speed",
          valueType: "String",
          value: "10 GB/s"
        }
      ]
    },
    type: "ServiceQualificationItem"
  },
  {
    id: "4",
    service: {
      serviceSpecification: {
        id: "108",
        href: "http://serverlocation:port/serviceCatalogManagement/v4/serviceSpecification/108",
        name: "cable_tv_svc",
        type: "ServiceSpecification"
      }
    },
    type: "ServiceQualificationItem"
  },
  {
    id: "5",
    service: {
      serviceSpecification: {
        id: "118",
        href: "http://serverlocation:port/serviceCatalogManagement/v4/serviceSpecification/118",
        name: "satellite_tv_svc",
        type: "ServiceSpecification"
      }
    },
    type: "ServiceQualificationItem"
  },
  {
    id: "6",
    service: {
      serviceSpecification: {
        id: "128",
        href: "http://serverlocation:port/serviceCatalogManagement/v4/serviceSpecification/128",
        name: "ip_tv_svc",
        type: "ServiceSpecification"
      }
    },
    type: "ServiceQualificationItem"
  }
];