export interface FreshWater {
  Empty: string;
}

export interface GreyWater {
  Full: string;
  Empty: string;
}

export interface ToiletSystem {
  Toilet: string;
  Controller: string;
  Vacuum_Pump: string;
}

export interface Waste {
  Full: string;
}

export interface HydraulicSystem {
  Fresh_Water: FreshWater;
  Pump_1: string;
  Grey_Water: GreyWater;
  Pump_2: string;
  Toilet_System: ToiletSystem;
  Waste: Waste;
  Valve_1: string;
  Valve_2: string;
}

export interface InternalExternal {
  In_Use_Sensor: boolean;
  In_Use_Indication: string;
  Int_Lights: string;
  Ext_Lights: string;
  Door_Lock: string;
  Loudspeaker: string;
  Exhaust_Fan: string;
  BLOWER_Fan: string;
  Int_Temp: number;
  Ext_Temp: number;
  Battery: string;
}

export interface BackCameraRecording {
  Driver_Camera_Recording: boolean;
  Driver_Cabin: boolean;
  GPS_Connection: boolean;
  LTE_Connection: boolean;
  Emergency_Button: boolean;
  Outrigger_Limit_Switch_1: boolean;
  Outrigger_Limit_Switch_2: boolean;
  Driver_Mode: boolean;
  Toilet_Mode: boolean;
}

export interface Adjustable {
  Min_BLOWER_Temp: number;
  Exhaust_Fan_Delta: number;
  Set_Audio_Volume: number;
}

export interface General {
  Internal_External: InternalExternal;
  Hydraulic_System: HydraulicSystem;
  Back_Camera_Recording: BackCameraRecording;
  Adjustable: Adjustable;
}

export interface CameraChannel {
  Camera_Recording: string;
  FPS: number;
}

export interface Camera {
  Front: CameraChannel;
  Back: CameraChannel;
}

export interface System {
  Vehicle_Number: string;
  Software_Version: string;
  System_Language: string;
}

export interface SettingsResponse {
  General: General;
  Camera: Camera;
  System: System;
}
