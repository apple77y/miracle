export default function Services() {
  const services = [
    {
      title: "플라워 부케",
      subtitle: "Flower Bouquet",
      description: "특별한 순간을 위한\n맞춤형 부케 디자인",
      features: ["웨딩 부케", "기념일 꽃다발", "축하 화환"]
    },
    {
      title: "인테리어 플랜츠",
      subtitle: "Interior Plants", 
      description: "공간을 아름답게 하는\n다양한 식물과 화분",
      features: ["관엽식물", "다육식물", "허브 화분"]
    },
    {
      title: "이벤트 플로럴",
      subtitle: "Event Floral",
      description: "특별한 행사를 위한\n공간 꽃 장식 서비스",
      features: ["웨딩 장식", "파티 데코", "개업 화환"]
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-light text-gray-800 mb-3 tracking-tight">서비스</h3>
          <div className="w-12 h-px bg-rose-300 mx-auto mb-4"></div>
          <p className="text-gray-600 font-light">정성스럽게 준비한 다양한 플라워 서비스</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-8 hover:shadow-xl transition-all duration-300 group border border-gray-100/50">
              <div className="mb-6">
                <h4 className="text-xl font-medium text-gray-800 mb-2 group-hover:text-rose-500 transition-colors">
                  {service.title}
                </h4>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-4">
                  {service.subtitle}
                </p>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line font-light">
                  {service.description}
                </p>
              </div>
              
              <div className="space-y-2">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className="w-1 h-1 bg-rose-300 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600 font-light">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}