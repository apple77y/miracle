'use client';

import { useBackgroundSync } from '../hooks/useBackgroundSync';
import { useIsPWA } from '../hooks/useIsPWA';

export default function BackgroundSyncIndicator() {
  const isPWA = useIsPWA();
  const { 
    isSupported, 
    pendingOrders,
    pendingInquiries,
    isSyncing, 
    lastSyncTime, 
    syncStatus,
    requestSync,
    resetSyncStatus
  } = useBackgroundSync();

  // PWA가 아니거나 지원하지 않으면 표시하지 않음
  if (!isPWA || !isSupported) return null;

  // 동기화할 항목이 없고 동기화 중이 아니면 표시하지 않음
  const totalPending = pendingOrders + pendingInquiries;
  if (totalPending === 0 && !isSyncing) return null;

  const formatLastSync = (timestamp: number | null) => {
    if (!timestamp) return '동기화된 적 없음';
    
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    return new Date(timestamp).toLocaleDateString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'syncing': return '🔄';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '⏳';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'syncing': return 'text-blue-600';
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-40 max-w-sm">
      <div className="bg-white rounded-lg shadow-lg border border-blue-200 p-3">
        <div className="flex items-center space-x-2 mb-2">
          {isSyncing ? (
            <>
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium text-blue-700">동기화 중...</span>
            </>
          ) : (
            <>
              <span className="text-blue-500">📡</span>
              <span className="text-sm font-medium text-gray-700">
                백그라운드 동기화 ({totalPending}개 대기)
              </span>
            </>
          )}
        </div>
        
        {/* 동기화 상세 상태 */}
        <div className="text-xs space-y-1 mb-3">
          {pendingOrders > 0 && (
            <div className="flex justify-between items-center">
              <span>주문 ({pendingOrders}개)</span>
              <span className={`flex items-center space-x-1 ${getStatusColor(syncStatus.orders)}`}>
                <span>{getStatusIcon(syncStatus.orders)}</span>
                <span>{syncStatus.orders === 'syncing' ? '동기화 중' : 
                      syncStatus.orders === 'success' ? '완료' :
                      syncStatus.orders === 'error' ? '실패' : '대기'}</span>
              </span>
            </div>
          )}
          
          {pendingInquiries > 0 && (
            <div className="flex justify-between items-center">
              <span>문의 ({pendingInquiries}개)</span>
              <span className={`flex items-center space-x-1 ${getStatusColor(syncStatus.inquiries)}`}>
                <span>{getStatusIcon(syncStatus.inquiries)}</span>
                <span>{syncStatus.inquiries === 'syncing' ? '동기화 중' : 
                      syncStatus.inquiries === 'success' ? '완료' :
                      syncStatus.inquiries === 'error' ? '실패' : '대기'}</span>
              </span>
            </div>
          )}
          
          {syncStatus.preferences !== 'idle' && (
            <div className="flex justify-between items-center">
              <span>환경설정</span>
              <span className={`flex items-center space-x-1 ${getStatusColor(syncStatus.preferences)}`}>
                <span>{getStatusIcon(syncStatus.preferences)}</span>
                <span>{syncStatus.preferences === 'syncing' ? '동기화 중' : 
                      syncStatus.preferences === 'success' ? '완료' :
                      syncStatus.preferences === 'error' ? '실패' : '대기'}</span>
              </span>
            </div>
          )}
        </div>

        {lastSyncTime && (
          <div className="text-xs text-gray-400 mb-3">
            마지막 동기화: {formatLastSync(lastSyncTime)}
          </div>
        )}

        <div className="flex space-x-2">
          <button
            onClick={requestSync}
            disabled={isSyncing}
            className="flex-1 text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSyncing ? '동기화 중...' : '지금 동기화'}
          </button>
          
          {(syncStatus.orders === 'success' || syncStatus.inquiries === 'success' || syncStatus.preferences === 'success') && (
            <button
              onClick={resetSyncStatus}
              disabled={isSyncing}
              className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              상태 초기화
            </button>
          )}
        </div>

        {/* 네트워크 상태 표시 */}
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>네트워크:</span>
            <span className={navigator.onLine ? 'text-green-600' : 'text-red-600'}>
              {navigator.onLine ? '🟢 온라인' : '🔴 오프라인'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}