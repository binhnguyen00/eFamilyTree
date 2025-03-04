class WorldMapConfig { 
  initZoom: number = 6;
  credit: string = "Gia Phả Lạc Hồng";
  initLocation = { 
    latitude: 16.14930148943899, 
    longitude: 105.82677668547302 
  };
  defaultMaxZoom: number = 22;
  defaultTileLayer: string = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  satelliteMaxZoom: number = 21;
  satelliteTileLayer: string = "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.png";
}

const config = new WorldMapConfig();

export default config;