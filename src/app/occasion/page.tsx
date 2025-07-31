import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: "이벤트·기념일 가이드 | Miracle Flower - 미라클 플라워",
  description: "생일, 기념일, 결혼식, 졸업식 등 특별한 날에 어울리는 꽃 추천과 선택 가이드를 제공합니다.",
};

const occasionGuides = [
  {
    id: 1,
    category: "생일 & 기념일",
    icon: "🎂",
    occasions: [
      {
        event: "생일 선물",
        flowers: ["장미 부케", "혼합 꽃다발", "화분 선물"],
        colors: ["빨강", "분홍", "노랑"],
        tips: "상대방이 좋아하는 색상을 고려하세요"
      },
      {
        event: "연인 기념일",
        flowers: ["빨간 장미", "핑크 장미", "로즈 박스"],
        colors: ["빨강", "분홍", "화이트"],
        tips: "장미 개수에 의미를 담아보세요 (12송이, 100송이 등)"
      },
      {
        event: "결혼기념일",
        flowers: ["백합", "장미와 백합 혼합", "우아한 꽃다발"],
        colors: ["화이트", "크림", "연분홍"],
        tips: "우아하고 고급스러운 느낌의 꽃을 선택하세요",
      }
    ]
  },
  {
    id: 2,
    category: "졸업 & 입학",
    icon: "🎓",
    occasions: [
      {
        event: "졸업식",
        flowers: ["해바라기", "거베라", "꽃다발+풍선세트"],
        colors: ["노랑", "주황", "밝은 색상"],
        tips: "밝고 희망찬 느낌의 꽃을 선택하세요",
      },
      {
        event: "입학식",
        flowers: ["튤립", "프리지아", "스프레이장미"],
        colors: ["파스텔 톤", "화이트", "연분홍"],
        tips: "새로운 시작을 의미하는 봄꽃이 좋습니다",
      },
      {
        event: "취업 축하",
        flowers: ["백합", "장미", "고급 꽃다발"],
        colors: ["화이트", "연보라", "블루"],
        tips: "성숙하고 전문적인 이미지의 꽃을 선택하세요",
      }
    ]
  },
  {
    id: 3,
    category: "결혼식",
    icon: "💒",
    occasions: [
      {
        event: "웨딩 부케",
        flowers: ["장미", "백합", "작약", "유칼립투스"],
        colors: ["화이트", "아이보리", "블러쉬 핑크"],
        tips: "드레스와 웨딩 테마에 맞춰 선택하세요",
      },
      {
        event: "부토니어",
        flowers: ["장미", "카네이션", "리시안셔스"],
        colors: ["부케와 매칭되는 색상"],
        tips: "신랑 정장 색상과 조화를 이루도록 하세요",
      },
      {
        event: "웨딩 장식",
        flowers: ["대형 꽃꽂이", "테이블 센터피스", "아치 장식"],
        colors: ["웨딩 테마 컬러"],
        tips: "전체적인 웨딩홀 분위기와 통일감을 주세요",
      }
    ]
  },
  {
    id: 4,
    category: "개업 & 축하",
    icon: "🎊",
    occasions: [
      {
        event: "개업 축하",
        flowers: ["개업 화환", "관엽식물", "꽃바구니"],
        colors: ["빨강", "노랑", "화려한 색상"],
        tips: "풍요와 번영을 의미하는 꽃을 선택하세요",
      },
      {
        event: "승진 축하",
        flowers: ["고급 꽃다발", "화분 선물", "꽃바구니"],
        colors: ["진한 색상", "고급스러운 톤"],
        tips: "품격 있고 격조 높은 느낌을 연출하세요",
      },
      {
        event: "집들이",
        flowers: ["공기정화 식물", "관엽식물", "작은 화분"],
        colors: ["초록", "화이트", "자연스러운 색"],
        tips: "오래도록 키울 수 있는 식물을 선택하세요",
      }
    ]
  },
  {
    id: 5,
    category: "위로 & 추모",
    icon: "🕊️",
    occasions: [
      {
        event: "장례식 조화",
        flowers: ["국화", "백합", "카네이션"],
        colors: ["화이트", "노랑", "연보라"],
        tips: "조용하고 차분한 색상으로 선택하세요",
      },
      {
        event: "위로 꽃다발",
        flowers: ["백합", "국화", "카네이션"],
        colors: ["화이트", "연분홍", "연보라"],
        tips: "너무 화려하지 않은 은은한 색상이 좋습니다",
      }
    ]
  }
];

export default function OccasionPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">이벤트·기념일 가이드</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              특별한 날에 어울리는 꽃을 찾고 계신가요?<br />
              상황별 맞춤 꽃 추천으로 더욱 의미 있는 순간을 만들어보세요
            </p>
          </div>

          <div className="space-y-12 max-w-6xl mx-auto">
            {occasionGuides.map((category) => (
              <div key={category.id} className="bg-card rounded-lg shadow-lg border overflow-hidden">
                <div className="bg-primary/10 p-6">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <span className="text-3xl">{category.icon}</span>
                    {category.category}
                  </h2>
                </div>
                
                <div className="p-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.occasions.map((occasion, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h3 className="font-semibold text-lg mb-3 text-primary">{occasion.event}</h3>
                        
                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="font-medium">추천 꽃:</span>
                            <div className="mt-1">
                              {occasion.flowers.map((flower, idx) => (
                                <span key={idx} className="inline-block bg-secondary px-2 py-1 rounded mr-1 mb-1">
                                  {flower}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <span className="font-medium">추천 색상:</span>
                            <div className="mt-1">
                              {occasion.colors.map((color, idx) => (
                                <span key={idx} className="inline-block bg-accent px-2 py-1 rounded mr-1 mb-1">
                                  {color}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="bg-muted p-3 rounded">
                            <span className="font-medium">💡 선택 팁:</span>
                            <p className="mt-1 text-muted-foreground">{occasion.tips}</p>
                          </div>
                          
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-8">
            <h3 className="text-2xl font-semibold mb-4">맞춤 상담 서비스</h3>
            <p className="text-muted-foreground mb-6">
              특별한 날에 어울리는 꽃을 직접 상담받고 싶으시다면<br />
              미라클 플라워 전문가와 상담해보세요
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <a 
                href="tel:0507-1456-0389" 
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                📞 전화 상담
              </a>
              <a 
                href="mailto:rmr0322@hanmail.net" 
                className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg hover:bg-secondary/80 transition-colors"
              >
                ✉️ 이메일 상담
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}