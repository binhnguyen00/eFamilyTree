import React, { useState } from 'react';

import { t } from 'i18next';

import { CommonComponentUtils } from 'components/common/CommonComponentUtils';
import { Box, Stack } from 'zmp-ui';

const UIHome = () => {
  const [posts] = useState([
    { id: 1, user: 'Phạm Khắc Toàn', content: 'Cuối tuần với gia đình', likes: 15, img: "https://images.pexels.com/photos/356378/pexels-photo-356378.jpeg" },
    { id: 2, user: 'Phạm Khắc Thê', content: 'Chúc mừng đại gia tộc', likes: 23, img: "https://images.pexels.com/photos/34950/pexels-photo.jpg" },
    { id: 3, user: 'Phạm Thị Ngọc', content: 'Cuối tuần zui zẻ', likes: 42, img: "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg" },
    { id: 4, user: 'Phạm Khắc Khanh', content: 'Xin chào mọi người', likes: 31 },
    { id: 5, user: 'Phạm Xuân Diệu', content: 'Chúc mừng đại gia tộc', likes: 56 },
  ]);

  const [stories] = useState([
    { id: 1, user: 'User 1' },
    { id: 2, user: 'User 2' },
    { id: 3, user: 'User 3' },
    { id: 4, user: 'User 4' },
    { id: 5, user: 'User 5' },
    { id: 6, user: 'User 6' },
  ]);

  return (
    <>
      {CommonComponentUtils.renderHeader(t("home"), undefined, undefined, false)}
      
      <div className="container">
        {/* <section style={{ overflowX: 'auto', whiteSpace: 'nowrap', padding: '10px 0' }}>
          {stories.map((story) => (
            <div key={story.id} style={{ display: 'inline-block', marginRight: '10px' }}>
              <div style={{ width: '100px', height: '150px', backgroundColor: '#1877f2', borderRadius: '10px', color: 'white', display: 'flex', alignItems: 'flex-end', padding: '10px', boxSizing: 'border-box' }}>
                <span>{story.user}</span>
              </div>
            </div>
          ))}
        </section> */}

        <Stack space='1rem' aria-label="News Feed">
          {posts.map((post) => (
            <div key={post.id} className='box-shadow' style={{ padding: 10 }}>
              <div>
                <Box flex flexDirection='row' alignContent='center'>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ccc', marginRight: '10px' }}></div>
                  <h3 style={{ margin: 0 }}>{post.user}</h3>
                </Box>
                  <span style={{ color: '#65676b', fontSize: '12px' }}>2 giờ trước</span>
              </div>

              <p>{post.content}</p>
              <br />

              <img src={post.img}/>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
                <button style={actionButtonStyle}>Thích ({post.likes})</button>
                <button style={actionButtonStyle}>Bình Luận</button>
                <button style={actionButtonStyle}>Chia Sẻ</button>
              </div>
            </div>
          ))}
        </Stack>
      </div>
    </>
  );
};

const actionButtonStyle = {
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  color: '#65676b',
};

export default UIHome;