'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useIntl } from 'react-intl';



export default function GuidePage() {
  const intl = useIntl();

  const careGuides = [
    {
      id: 1,
      title: intl.formatMessage({ id: 'guide.bouquet.title' }),
      summary: intl.formatMessage({ id: 'guide.bouquet.summary' }),
      content: [
        intl.formatMessage({ id: 'guide.bouquet.tip1' }),
        intl.formatMessage({ id: 'guide.bouquet.tip2' }),
        intl.formatMessage({ id: 'guide.bouquet.tip3' }),
        intl.formatMessage({ id: 'guide.bouquet.tip4' }),
        intl.formatMessage({ id: 'guide.bouquet.tip5' })
      ],
      tips: intl.formatMessage({ id: 'guide.bouquet.tips' })
    },
    {
      id: 2,
      title: intl.formatMessage({ id: 'guide.plant.title' }),
      summary: intl.formatMessage({ id: 'guide.plant.summary' }),
      content: [
        intl.formatMessage({ id: 'guide.plant.tip1' }),
        intl.formatMessage({ id: 'guide.plant.tip2' }),
        intl.formatMessage({ id: 'guide.plant.tip3' }),
        intl.formatMessage({ id: 'guide.plant.tip4' }),
        intl.formatMessage({ id: 'guide.plant.tip5' })
      ],
      tips: intl.formatMessage({ id: 'guide.plant.tips' })
    },
    {
      id: 3,
      title: intl.formatMessage({ id: 'guide.seasonal.title' }),
      summary: intl.formatMessage({ id: 'guide.seasonal.summary' }),
      content: [
        intl.formatMessage({ id: 'guide.seasonal.spring' }),
        intl.formatMessage({ id: 'guide.seasonal.summer' }),
        intl.formatMessage({ id: 'guide.seasonal.autumn' }),
        intl.formatMessage({ id: 'guide.seasonal.winter' })
      ],
      tips: intl.formatMessage({ id: 'guide.seasonal.tips' })
    },
    {
      id: 4,
      title: intl.formatMessage({ id: 'guide.flowers.title' }),
      summary: intl.formatMessage({ id: 'guide.flowers.summary' }),
      content: [
        intl.formatMessage({ id: 'guide.flowers.rose' }),
        intl.formatMessage({ id: 'guide.flowers.tulip' }),
        intl.formatMessage({ id: 'guide.flowers.sunflower' }),
        intl.formatMessage({ id: 'guide.flowers.carnation' }),
        intl.formatMessage({ id: 'guide.flowers.mixed' })
      ],
      tips: intl.formatMessage({ id: 'guide.flowers.tips' })
    }
  ];

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">{intl.formatMessage({ id: 'guide.title' })}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {intl.formatMessage({ id: 'guide.subtitle' }).split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  {index === 0 && <br />}
                </span>
              ))}
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
                    <span className="font-medium">{intl.formatMessage({ id: 'guide.expertTip' })}</span> {guide.tips}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center bg-primary/5 rounded-lg p-8">
            <h3 className="text-2xl font-semibold mb-4">{intl.formatMessage({ id: 'guide.question.title' })}</h3>
            <p className="text-muted-foreground mb-6">
              {intl.formatMessage({ id: 'guide.question.description' })}
            </p>
            <div className="flex justify-center gap-4">
              <a 
                href="tel:0507-1456-0389" 
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                {intl.formatMessage({ id: 'guide.contact.phone' })}
              </a>
              <a 
                href="mailto:rmr0322@hanmail.net" 
                className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg hover:bg-secondary/80 transition-colors"
              >
                {intl.formatMessage({ id: 'guide.contact.email' })}
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}