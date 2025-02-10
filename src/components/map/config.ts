class WorldMapConfig { 
  initZoom: number = 6;
  credit: string = "Gia Phả Lạc Hồng";
  initLocation = { 
    latitude: 16.14930148943899, 
    longitude: 105.82677668547302 
  };
  defaultTileLayer: string = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  defaultMaxZoom: number = 22;
  satelliteTileLayer: string = "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
  satelliteMaxZoom: number = 18.99;
}

const config = new WorldMapConfig();

export default config;