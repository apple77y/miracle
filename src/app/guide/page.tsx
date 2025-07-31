import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: "꽃 관리 가이드 | Miracle Flower - 미라클 플라워",
  description: "꽃다발과 화분을 오래 보관하는 방법, 계절별 꽃 관리 팁을 알려드립니다. 전문가의 꽃 관리 노하우를 확인하세요.",
};

const careGuides = [
  {
    id: 1,
    title: "꽃다발 오래 보관하는 법",
    summary: "받은 꽃다발을 최대한 오래 싱싱하게 유지하는 방법",
    content: [
      "물을 자주 갈아주세요 (2-3일마다)",
      "줄기를 사선으로 1-2cm 잘라주세요",
      "직사광선을 피하고 서늘한 곳에 두세요",
      "시든 꽃과 잎은 즉시 제거해주세요",
      "꽃병을 깨끗하게 세척 후 사용하세요"
    ],
    tips: "설탕이나 표백제를 한 방울 넣으면 더 오래 갑니다"
  },
  {
    id: 2,
    title: "화분 관리 방법",
    summary: "실내 화분을 건강하게 키우는 기본 원칙",
    content: [
      "화분 배수구가 막히지 않았는지 확인하세요",
      "겉흙이 마르면 물을 충분히 주세요",
      "한 달에 한 번 액체비료를 희석해서 주세요",
      "잎에 먼지가 쌓이면 젖은 천으로 닦아주세요",
      "통풍이 잘 되는 곳에 두세요"
    ],
    tips: "과습보다는 약간 건조하게 키우는 것이 좋습니다"
  },
  {
    id: 3,
    title: "계절별 꽃 관리 팁",
    summary: "봄, 여름, 가을, 겨울 각 계절에 맞는 꽃 관리법",
    content: [
      "🌸 봄: 새순이 나오면 가지치기를 해주세요",
      "☀️ 여름: 물을 자주 주고 그늘에서 관리하세요",
      "🍂 가을: 시든 꽃을 제거하고 월동 준비를 하세요", 
      "❄️ 겨울: 물 주는 횟수를 줄이고 실내로 이동하세요"
    ],
    tips: "계절 변화에 따라 물 주는 양과 횟수를 조절하세요"
  },
  {
    id: 4,
    title: "꽃 종류별 특성",
    summary: "대표적인 꽃들의 특징과 관리 포인트",
    content: [
      "🌹 장미: 가시 조심, 줄기를 사선으로 자르기",
      "🌷 튤립: 차가운 물 선호, 직사광선 피하기",
      "🌻 해바라기: 큰 꽃병 사용, 물을 많이 필요",
      "🌺 카네이션: 오래가는 편, 마른 잎 제거 중요",
      "💐 혼합부케: 각 꽃의 특성 고려한 관리"
    ],
    tips: "꽃마다 수명이 다르니 상태를 자주 확인하세요"
  }
];

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">꽃 관리 가이드</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              미라클 플라워의 전문가가 알려드리는 꽃 관리 노하우로<br />
              소중한 꽃을 더 오래, 더 아름답게 간직하세요
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {careGuides.map((guide) => (
              <div key={guide.id} className="bg-card rounded-lg p-6 shadow-lg border">
                <h2 className="text-2xl font-semibold mb-3 text-primary">{guide.title}</h2>
                <p className="text-muted-foreground mb-4">{guide.summary}</p>
                
                <div className="space-y-2">
                  {guide.content.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-secondary rounded-lg">
                  <p className="text-sm text-secondary-foreground">
                    <span className="font-medium">💡 전문가 팁:</span> {guide.tips}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center bg-primary/5 rounded-lg p-8">
            <h3 className="text-2xl font-semibold mb-4">더 궁금한 점이 있으시나요?</h3>
            <p className="text-muted-foreground mb-6">
              꽃 관리에 대한 추가 문의사항이 있으시면 언제든지 연락주세요
            </p>
            <div className="flex justify-center gap-4">
              <a 
                href="tel:0507-1456-0389" 
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                📞 전화 문의
              </a>
              <a 
                href="mailto:rmr0322@hanmail.net" 
                className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg hover:bg-secondary/80 transition-colors"
              >
                ✉️ 이메일 문의
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}