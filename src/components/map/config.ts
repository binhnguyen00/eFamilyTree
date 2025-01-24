class WorldMapConfig { 
  initZoom: number = 13;
  maxZoom: number = 23;
  credit: string = "Gia Phả Lạc Hồng";
  initLocation = { 
    latitude: 20.81837730031204, 
    longitude: 106.69754943953069 
  }
}

const config = new WorldMapConfig();

export default config;