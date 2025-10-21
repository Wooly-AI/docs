// src/components/VideoEmbed.js
import React from 'react';
import ReactPlayer from 'react-player';

function VideoEmbed({ url }) {
  return (
    <div className="video-container" style={{ width: '100%', minHeight: '400px', height: '100%' }}> {/* Optional: for styling */}
      <ReactPlayer src={url} controls={true} style={{ width: '100%', minHeight: '400px', height: '100%' }} />
    </div>
  );
}

export default VideoEmbed;