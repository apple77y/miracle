'use client';

import { useEffect, useState } from 'react';

export default function OfflineClient() {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // 온라인이 되면 홈으로 리다이렉트
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    // 현재 온라인 상태 확인
    setIsOnline(navigator.onLine);

    // 온라인/오프라인 이벤트 리스너
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    if (navigator.onLine) {
      window.location.href = '/';
    } else {
      // 네트워크 상태 다시 확인
      fetch('/', { method: 'HEAD', cache: 'no-cache' })
        .then(() => {
          window.location.href = '/';
        })
        .catch(() => {
          alert('아직 인터넷에 연결되지 않았습니다.');
        });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-100">
      <div className="text-center max-w-md mx-auto px-6">
        {/* 꽃 아이콘 */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-pink-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">🌸</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {isOnline ? '연결 복구됨!' : '오프라인 상태'}
        </h1>
        
        {isOnline ? (
          <div>
            <p className="text-lg text-green-600 mb-6">
              인터넷 연결이 복구되었습니다! 🎉
            </p>
            <p className="text-sm text-gray-500">
              잠시 후 자동으로 이동됩니다...
            </p>
          </div>
        ) : (
          <div>
            <p className="text-lg text-gray-600 mb-6">
              현재 인터넷에 연결되어 있지 않습니다.
            </p>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border border-pink-100 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                오프라인에서도 이용 가능:
              </h2>
              <ul className="text-sm text-gray-600 space-y-2 text-left">
                <li>• 꽃 갤러리 둘러보기</li>
                <li>• 이전에 본 꽃 정보</li>
                <li>• 오케이전별 꽃 추천</li>
                <li>• 연락처 정보</li>
              </ul>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleRetry}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                다시 시도
              </button>
              
              <button
                onClick={() => window.history.back()}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
              >
                이전 페이지로
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-6">
              연결이 복구되면 자동으로 동기화됩니다
            </p>
          </div>
        )}
      </div>
    </div>
  );
}