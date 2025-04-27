import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  // 音频文件列表
  const audioFiles = [
    'https://static.bluebirdabc.com/lesson/ttsmv/c9/c92ba298970164cff2380caad3c4c4036755b432.mp3',
    'https://static.bluebirdabc.com/lesson/ttsmv/33/339f460fc1c51dfb175e2a6b96591c8465240803.mp3',
    'https://static.bluebirdabc.com/lesson/ttsmv/26/263d8aba4918689ece5a6d877257d97da5a8dbe1.mp3',
    'https://static.bluebirdabc.com/lesson/ttsmv/4e/4e9a90009073e7630bfbd77815063cc228521c4c.mp3',
    'https://static.bluebirdabc.com/lesson/ttsmv/9f/9f8a7f5e9035760a697ae9075e0a042449764bf9.mp3',
    'https://static.bluebirdabc.com/lesson/ttsmv/c9/c92ba298970164cff2380caad3c4c4036755b432.mp3',
    'https://static.bluebirdabc.com/lesson/ttsmv/33/339f460fc1c51dfb175e2a6b96591c8465240803.mp3',
    'https://static.bluebirdabc.com/lesson/ttsmv/26/263d8aba4918689ece5a6d877257d97da5a8dbe1.mp3',
    'https://static.bluebirdabc.com/lesson/ttsmv/4e/4e9a90009073e7630bfbd77815063cc228521c4c.mp3',
    'https://static.bluebirdabc.com/lesson/ttsmv/9f/9f8a7f5e9035760a697ae9075e0a042449764bf9.mp3'
  ];

  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSrc, setAudioSrc] = useState('');
  const [loadingNext, setLoadingNext] = useState(false);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 模拟获取下一个音频文件的接口请求
  const fetchNextAudio = async (index: number) => {
    setLoadingNext(true);
    
    // 模拟网络请求延迟，持续10秒
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    if (index < audioFiles.length) {
      setAudioSrc(audioFiles[index]);
    }
    
    setLoadingNext(false);
  };

  // 初始化函数 - 不自动加载音频，等待用户交互
  const initialize = () => {
    setInitialized(true);
    fetchNextAudio(0);
  };

  // 播放完成后自动播放下一个
  const handleAudioEnded = () => {
    const nextIndex = currentAudioIndex + 1;
    if (nextIndex < audioFiles.length) {
      setCurrentAudioIndex(nextIndex);
      fetchNextAudio(nextIndex);
    } else {
      // 所有音频播放完毕
      setIsPlaying(false);
      console.log('所有音频播放完毕');
    }
  };

  // 当音频源变化时自动播放
  useEffect(() => {
    if (audioSrc && audioRef.current && autoPlayEnabled) {
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.error('自动播放失败:', error);
            // 可能是浏览器策略阻止了自动播放
            setIsPlaying(false);
          });
      }
    }
  }, [audioSrc, autoPlayEnabled]);

  // 手动开始播放
  const startPlaying = () => {
    if (audioRef.current && !isPlaying) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setAutoPlayEnabled(true); // 启用自动播放功能
        })
        .catch(error => {
          console.error('播放失败:', error);
        });
    }
  };

  // 暂停播放
  const pausePlaying = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setAutoPlayEnabled(false); // 禁用自动播放功能
    }
  };

  return (
    <div className="audio-player">
      <h1>音频自动播放器</h1>
      
      {!initialized ? (
        <div className="start-container">
          <p>准备好自动播放所有音频文件</p>
          <button className="start-button" onClick={initialize}>开始播放</button>
        </div>
      ) : audioSrc ? (
        <>
          <audio 
            ref={audioRef}
            src={audioSrc}
            onEnded={handleAudioEnded}
          />
          
          <div className="audio-controls">
            <div className="audio-info">
              <p>当前播放: {currentAudioIndex + 1}/{audioFiles.length}</p>
              {loadingNext && <p className="loading-text">模拟请求下一个音频中，请稍等约10秒...</p>}
            </div>
            
            <div className="audio-buttons">
              {isPlaying ? (
                <button onClick={pausePlaying}>暂停</button>
              ) : (
                <button onClick={startPlaying}>播放</button>
              )}
            </div>
          </div>
        </>
      ) : (
        <p className="loading-text">模拟请求下一个音频中，请稍等约10秒...</p>
      )}
    </div>
  )
}

export default App
