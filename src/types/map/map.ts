import { Photo } from "../common";

export type MapTile = {
  url: string;
  maxZoom: number;
}

export type MapMarker = {
  id: number;
  name: string;
  description?: string;
  coordinate: MapCoordinate;
  photoUrl?: string[]; // TODO: use photos in MemorialLocation
}

export type MapCoordinate = {
  lat: number;
  lng: number;
}

export interface MemorialLocation extends MapMarker {
  clanId: number;
  memberId?: number;
  memberName?: string;
  photos?: Photo[];
}