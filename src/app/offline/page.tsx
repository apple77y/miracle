import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Offline - Miracle',
  description: '현재 인터넷에 연결되어 있지 않습니다.',
};

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          오프라인 상태
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          현재 인터넷에 연결되어 있지 않습니다.
        </p>
        <p className="text-gray-500">
          인터넷 연결을 확인한 후 다시 시도해주세요.
        </p>
      </div>
    </div>
  );
}