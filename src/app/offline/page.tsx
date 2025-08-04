import type { Metadata } from 'next';
import OfflineClient from '../../components/OfflineClient';

export const metadata: Metadata = {
  title: 'Offline - Miracle',
  description: '현재 인터넷에 연결되어 있지 않습니다.',
};

export default function OfflinePage() {
  return <OfflineClient />;
}