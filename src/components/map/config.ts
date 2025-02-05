class WorldMapConfig { 
  initZoom: number = 6;
  maxZoom: number = 23;
  credit: string = "Gia Phả Lạc Hồng";
  initLocation = { 
    latitude: 16.14930148943899, 
    longitude: 105.82677668547302 
  };
  defaultTileLayer: string = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  satelliteTileLayer: string = "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
}

const config = new WorldMapConfig();

export default config;