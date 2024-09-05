export default interface AuthInterface {
    loginData?: {

      
    } | null;
    baseUrl?: string;
    requestHeaders: {
      Authorization: string;
    };
    getUserData: () => void;
    
  }
  export interface ChangePasswordProps {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }
export interface AuthInputs  {
    email: string;
    password: string;
  };
  
  export interface ErrorProps {
    message: string;
    name: string;
    request: {
      status: number;
      statusText: string;
    };
    response: {
      data: { success: boolean; message: string; data: string | null };
    };
    status: number;
    statusText: string;
  }
  
  export interface ToastTypeProps {
    showToast: (
      type: "success" | "error" | "warning" | "info",
      message: string
    ) => void;
  }
  
  // ?==============>Useres<==============
  export interface User {
    country: string;
    email: string;
    creationDate: string;
    id: number;
    imagePath: string | undefined;
    isActivated: boolean;
    userName: string;
    status: string;
    phoneNumber: string;
  }
  
  export interface ActiveUserData {
    activatedEmployeeCount: number;
    deactivatedEmployeeCount: number;
  }
  // ?==============>End Useres<==============
  
  export interface RoomsListProps {
    capacity: number;
    createdAt: string;
    createdBy: { _id: string; userName: string };
    discount: number;
    facilities: Facility[];
    images: string[];
    price: number;
    roomNumber: string;
    updatedAt: string;
    _id: string;
  }
  
  export interface FacilitiesProps {
    createdAt: string;
    createdBy: { _id: string; userName: string };
    name: string;
    updatedAt: string;
    _id: string;
  }
  
 export interface Facility {
    _id: string;
    name: string;
  }
  
  export interface RoomsListProps {
    capacity: number;
    createdAt: string;
    createdBy: { _id: string; userName: string };
    discount: number;
    facilities: Facility[];
    images: string[];
    price: number;
    roomNumber: string;
    updatedAt: string;
    _id: string;
  }
  
  export interface Inputs {
    roomNumber: string;
    images: string[];
    price: string;
    capacity: string;
    discount: string;
    facilities: string[];
  }
  
  export interface ImageFile extends File {
    name: string;
  }
  
  // Ads
  
  export interface ADS {
    createdAt: string;
    createdBy: { _id: string; userName: string };
    isActive: boolean;
    room: {
      capacity: number;
      createdAt: string;
      createdBy: string;
      discount: number;
      facilities: string[];
      images: string[];
      price: number;
      roomNumber: string;
      updatedAt: string;
      _id: string;
    };
    updatedAt: string;
    _id: string;
  }
  
 
 export interface Rooms {
    _id: string;
  
    capacity: number;
    price: number;
    discount: number;
    roomNumber: string;
  }
 export interface Form {
    _id: string;
    room: String;
    discount: number;
    isActive: boolean;
    roomNumber: string;
    
  }
  export interface IBooking {
    _id: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
    user: {
      _id: string;
      userName: string;
    };
    room: {
      roomNumber:string;
    }
    status: string;
    createdAt: string;
    updatedAt: string;
  }