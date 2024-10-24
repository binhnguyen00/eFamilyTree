import React from "react";
import { Page, Text, Box, ImageViewer } from "zmp-ui";

export function UIDummyAlbum() {
  const [visible, setVisible] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  
  return (
    <Page className='section-container'>
      <Box mt={6}>
        <Box mt={2}>
          <Text size='xSmall' className='input-desc'>
            {"Ảnh Gia Đình"}
          </Text>
        </Box>
        <Box mt={2}>
          <Box flex flexDirection='row' flexWrap>
            {images.map((img, index) => (
              <Box
                mr={1}
                key={img.key}
                style={{
                  width: "68px",
                  height: "69px",
                  borderRadius: "8px",
                  overflow: "hidden"
                }}
              >
                <img
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  role='presentation'
                  onClick={() => {
                    setActiveIndex(index);
                    setVisible(true);
                  }}
                  src={img.src}
                  alt={img.alt}
                />
              </Box>
            ))}
          </Box>
          <ImageViewer
            onClose={() => setVisible(false)}
            activeIndex={activeIndex}
            images={images}
            visible={visible}
          />
        </Box>
      </Box>
    </Page>
  );
}

const images = [
  {
    src: "https://stc-zmp.zadn.vn/zmp-zaui/images/e2e10aa1a6087a5623192.jpg",
    alt: "img 1",
    key: "1"
  },
  {
    src: "https://stc-zmp.zadn.vn/zmp-zaui/images/fee40cbea0177c4925061.jpg",
    alt: "img 2",
    key: "2"
  },
  {
    src: "https://stc-zmp.zadn.vn/zmp-zaui/images/82ca759bd932056c5c233.jpg",
    alt: "img 3",
    key: "3"
  },
  {
    src: "https://stc-zmp.zadn.vn/zmp-zaui/images/77f5b8cd1464c83a91754.jpg",
    alt: "img 4",
    key: "4"
  }
];