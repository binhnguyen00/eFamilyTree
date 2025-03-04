class WorldMapConfig { 
  initZoom: number = 6;
  credit: string = "Gia Phả Lạc Hồng";
  initLocation = { 
    latitude: 16.14930148943899, 
    longitude: 105.82677668547302 
  };
  defaultMaxZoom: number = 22;
  defaultTileLayer: string = "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}";
  satelliteMaxZoom: number = 21;
  satelliteTileLayer: string = "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}";
}

const config = new WorldMapConfig();

export default config;