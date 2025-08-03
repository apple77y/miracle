'use client';

import { useIntl } from 'react-intl';

export default function Services() {
  const intl = useIntl();
  const services = [
    {
      titleKey: "services.bouquet.title",
      subtitleKey: "services.bouquet.subtitle",
      descriptionKey: "services.bouquet.description",
      featureKeys: ["services.bouquet.feature1", "services.bouquet.feature2", "services.bouquet.feature3"]
    },
    {
      titleKey: "services.plants.title",
      subtitleKey: "services.plants.subtitle",
      descriptionKey: "services.plants.description",
      featureKeys: ["services.plants.feature1", "services.plants.feature2", "services.plants.feature3"]
    },
    {
      titleKey: "services.event.title",
      subtitleKey: "services.event.subtitle", 
      descriptionKey: "services.event.description",
      featureKeys: ["services.event.feature1", "services.event.feature2", "services.event.feature3"]
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-light text-gray-800 mb-3 tracking-tight">
            {intl.formatMessage({ id: 'services.title' })}
          </h3>
          <div className="w-12 h-px bg-rose-300 mx-auto mb-4"></div>
          <p className="text-gray-600 font-light">
            {intl.formatMessage({ id: 'services.subtitle' })}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-8 hover:shadow-xl transition-all duration-300 group border border-gray-100/50">
              <div className="mb-6">
                <h4 className="text-xl font-medium text-gray-800 mb-2 group-hover:text-rose-500 transition-colors">
                  {intl.formatMessage({ id: service.titleKey })}
                </h4>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-4">
                  {intl.formatMessage({ id: service.subtitleKey })}
                </p>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line font-light break-words">
                  {intl.formatMessage({ id: service.descriptionKey })}
                </p>
              </div>
              
              <div className="space-y-2">
                {service.featureKeys.map((featureKey, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className="w-1 h-1 bg-rose-300 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600 font-light">
                      {intl.formatMessage({ id: featureKey })}
                    </span>
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