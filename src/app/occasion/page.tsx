'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useIntl } from 'react-intl';

export default function OccasionPage() {
  const intl = useIntl();

  const occasionGuides = [
    {
      id: 1,
      category: intl.formatMessage({ id: 'occasion.birthday.category' }),
      icon: "🎂",
      occasions: [
        {
          event: intl.formatMessage({ id: 'occasion.birthday.gift' }),
          flowers: [
            intl.formatMessage({ id: 'occasion.flowers.roseBouquet' }),
            intl.formatMessage({ id: 'occasion.flowers.mixedBouquet' }),
            intl.formatMessage({ id: 'occasion.flowers.potGift' })
          ],
          colors: [
            intl.formatMessage({ id: 'occasion.colors.red' }),
            intl.formatMessage({ id: 'occasion.colors.pink' }),
            intl.formatMessage({ id: 'occasion.colors.yellow' })
          ],
          tips: intl.formatMessage({ id: 'occasion.tips.birthday' })
        },
        {
          event: intl.formatMessage({ id: 'occasion.birthday.anniversary' }),
          flowers: [
            intl.formatMessage({ id: 'occasion.flowers.redRose' }),
            intl.formatMessage({ id: 'occasion.flowers.pinkRose' }),
            intl.formatMessage({ id: 'occasion.flowers.roseBox' })
          ],
          colors: [
            intl.formatMessage({ id: 'occasion.colors.red' }),
            intl.formatMessage({ id: 'occasion.colors.pink' }),
            intl.formatMessage({ id: 'occasion.colors.white' })
          ],
          tips: intl.formatMessage({ id: 'occasion.tips.anniversary' })
        },
        {
          event: intl.formatMessage({ id: 'occasion.birthday.marriage' }),
          flowers: [
            intl.formatMessage({ id: 'occasion.flowers.lily' }),
            intl.formatMessage({ id: 'occasion.flowers.roseLilyMix' }),
            intl.formatMessage({ id: 'occasion.flowers.elegantBouquet' })
          ],
          colors: [
            intl.formatMessage({ id: 'occasion.colors.white' }),
            intl.formatMessage({ id: 'occasion.colors.cream' }),
            intl.formatMessage({ id: 'occasion.colors.lightPink' })
          ],
          tips: intl.formatMessage({ id: 'occasion.tips.marriage' })
        }
      ]
    },
    {
      id: 2,
      category: intl.formatMessage({ id: 'occasion.graduation.category' }),
      icon: "🎓",
      occasions: [
        {
          event: intl.formatMessage({ id: 'occasion.graduation.ceremony' }),
          flowers: [
            intl.formatMessage({ id: 'occasion.flowers.sunflower' }),
            intl.formatMessage({ id: 'occasion.flowers.gerbera' }),
            intl.formatMessage({ id: 'occasion.flowers.bouquetBalloonSet' })
          ],
          colors: [
            intl.formatMessage({ id: 'occasion.colors.yellow' }),
            intl.formatMessage({ id: 'occasion.colors.orange' }),
            intl.formatMessage({ id: 'occasion.colors.brightColors' })
          ],
          tips: intl.formatMessage({ id: 'occasion.tips.graduation' })
        },
        {
          event: intl.formatMessage({ id: 'occasion.graduation.entrance' }),
          flowers: [
            intl.formatMessage({ id: 'occasion.flowers.tulip' }),
            intl.formatMessage({ id: 'occasion.flowers.freesia' }),
            intl.formatMessage({ id: 'occasion.flowers.sprayRose' })
          ],
          colors: [
            intl.formatMessage({ id: 'occasion.colors.pastelTone' }),
            intl.formatMessage({ id: 'occasion.colors.white' }),
            intl.formatMessage({ id: 'occasion.colors.lightPink' })
          ],
          tips: intl.formatMessage({ id: 'occasion.tips.entrance' })
        },
        {
          event: intl.formatMessage({ id: 'occasion.graduation.job' }),
          flowers: [
            intl.formatMessage({ id: 'occasion.flowers.lily' }),
            intl.formatMessage({ id: 'occasion.flowers.rose' }),
            intl.formatMessage({ id: 'occasion.flowers.premiumBouquet' })
          ],
          colors: [
            intl.formatMessage({ id: 'occasion.colors.white' }),
            intl.formatMessage({ id: 'occasion.colors.lightPurple' }),
            intl.formatMessage({ id: 'occasion.colors.blue' })
          ],
          tips: intl.formatMessage({ id: 'occasion.tips.job' })
        }
      ]
    },
    {
      id: 3,
      category: intl.formatMessage({ id: 'occasion.wedding.category' }),
      icon: "💒",
      occasions: [
        {
          event: intl.formatMessage({ id: 'occasion.wedding.bouquet' }),
          flowers: [
            intl.formatMessage({ id: 'occasion.flowers.rose' }),
            intl.formatMessage({ id: 'occasion.flowers.lily' }),
            intl.formatMessage({ id: 'occasion.flowers.peony' }),
            intl.formatMessage({ id: 'occasion.flowers.eucalyptus' })
          ],
          colors: [
            intl.formatMessage({ id: 'occasion.colors.white' }),
            intl.formatMessage({ id: 'occasion.colors.ivory' }),
            intl.formatMessage({ id: 'occasion.colors.blushPink' })
          ],
          tips: intl.formatMessage({ id: 'occasion.tips.weddingBouquet' })
        },
        {
          event: intl.formatMessage({ id: 'occasion.wedding.boutonniere' }),
          flowers: [
            intl.formatMessage({ id: 'occasion.flowers.rose' }),
            intl.formatMessage({ id: 'occasion.flowers.carnation' }),
            intl.formatMessage({ id: 'occasion.flowers.lisianthus' })
          ],
          colors: [
            intl.formatMessage({ id: 'occasion.colors.bouquetMatching' })
          ],
          tips: intl.formatMessage({ id: 'occasion.tips.boutonniere' })
        },
        {
          event: intl.formatMessage({ id: 'occasion.wedding.decoration' }),
          flowers: [
            intl.formatMessage({ id: 'occasion.flowers.largeArrangement' }),
            intl.formatMessage({ id: 'occasion.flowers.centerpiece' }),
            intl.formatMessage({ id: 'occasion.flowers.archDecoration' })
          ],
          colors: [
            intl.formatMessage({ id: 'occasion.colors.weddingTheme' })
          ],
          tips: intl.formatMessage({ id: 'occasion.tips.weddingDecoration' })
        }
      ]
    },
    {
      id: 4,
      category: intl.formatMessage({ id: 'occasion.business.category' }),
      icon: "🎊",
      occasions: [
        {
          event: intl.formatMessage({ id: 'occasion.business.opening' }),
          flowers: [
            intl.formatMessage({ id: 'occasion.flowers.openingWreath' }),
            intl.formatMessage({ id: 'occasion.flowers.foliagePlant' }),
            intl.formatMessage({ id: 'occasion.flowers.flowerBasket' })
          ],
          colors: [
            intl.formatMessage({ id: 'occasion.colors.red' }),
            intl.formatMessage({ id: 'occasion.colors.yellow' }),
            intl.formatMessage({ id: 'occasion.colors.vibrantColors' })
          ],
          tips: intl.formatMessage({ id: 'occasion.tips.opening' })
        },
        {
          event: intl.formatMessage({ id: 'occasion.business.promotion' }),
          flowers: [
            intl.formatMessage({ id: 'occasion.flowers.premiumBouquet' }),
            intl.formatMessage({ id: 'occasion.flowers.potGift' }),
            intl.formatMessage({ id: 'occasion.flowers.flowerBasket' })
          ],
          colors: [
            intl.formatMessage({ id: 'occasion.colors.darkColors' }),
            intl.formatMessage({ id: 'occasion.colors.luxuryTone' })
          ],
          tips: intl.formatMessage({ id: 'occasion.tips.promotion' })
        },
        {
          event: intl.formatMessage({ id: 'occasion.business.housewarming' }),
          flowers: [
            intl.formatMessage({ id: 'occasion.flowers.airPurifyingPlant' }),
            intl.formatMessage({ id: 'occasion.flowers.foliagePlant' }),
            intl.formatMessage({ id: 'occasion.flowers.smallPot' })
          ],
          colors: [
            intl.formatMessage({ id: 'occasion.colors.green' }),
            intl.formatMessage({ id: 'occasion.colors.white' }),
            intl.formatMessage({ id: 'occasion.colors.naturalColors' })
          ],
          tips: intl.formatMessage({ id: 'occasion.tips.housewarming' })
        }
      ]
    },
    {
      id: 5,
      category: intl.formatMessage({ id: 'occasion.memorial.category' }),
      icon: "🕊️",
      occasions: [
        {
          event: intl.formatMessage({ id: 'occasion.memorial.funeral' }),
          flowers: [
            intl.formatMessage({ id: 'occasion.flowers.chrysanthemum' }),
            intl.formatMessage({ id: 'occasion.flowers.lily' }),
            intl.formatMessage({ id: 'occasion.flowers.carnation' })
          ],
          colors: [
            intl.formatMessage({ id: 'occasion.colors.white' }),
            intl.formatMessage({ id: 'occasion.colors.yellow' }),
            intl.formatMessage({ id: 'occasion.colors.lightPurple' })
          ],
          tips: intl.formatMessage({ id: 'occasion.tips.funeral' })
        },
        {
          event: intl.formatMessage({ id: 'occasion.memorial.condolence' }),
          flowers: [
            intl.formatMessage({ id: 'occasion.flowers.lily' }),
            intl.formatMessage({ id: 'occasion.flowers.chrysanthemum' }),
            intl.formatMessage({ id: 'occasion.flowers.carnation' })
          ],
          colors: [
            intl.formatMessage({ id: 'occasion.colors.white' }),
            intl.formatMessage({ id: 'occasion.colors.lightPink' }),
            intl.formatMessage({ id: 'occasion.colors.lightPurple' })
          ],
          tips: intl.formatMessage({ id: 'occasion.tips.condolence' })
        }
      ]
    }
  ];

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">{intl.formatMessage({ id: 'occasion.title' })}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {intl.formatMessage({ id: 'occasion.subtitle' }).split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  {index === 0 && <br />}
                </span>
              ))}
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
                            <span className="font-medium">{intl.formatMessage({ id: 'occasion.flowers.recommend' })}</span>
                            <div className="mt-1">
                              {occasion.flowers.map((flower, idx) => (
                                <span key={idx} className="inline-block bg-secondary px-2 py-1 rounded mr-1 mb-1">
                                  {flower}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <span className="font-medium">{intl.formatMessage({ id: 'occasion.colors.recommend' })}</span>
                            <div className="mt-1">
                              {occasion.colors.map((color, idx) => (
                                <span key={idx} className="inline-block bg-accent px-2 py-1 rounded mr-1 mb-1">
                                  {color}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="bg-muted p-3 rounded">
                            <span className="font-medium">💡 {intl.formatMessage({ id: 'occasion.tips.selection' })}</span>
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
            <h3 className="text-2xl font-semibold mb-4">{intl.formatMessage({ id: 'occasion.consultation.title' })}</h3>
            <p className="text-muted-foreground mb-6">
              {intl.formatMessage({ id: 'occasion.consultation.description' }).split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  {index === 0 && <br />}
                </span>
              ))}
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <a 
                href="tel:0507-1456-0389" 
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap"
              >
                {intl.formatMessage({ id: 'occasion.consultation.phone' })}
              </a>
              <a 
                href="mailto:rmr0322@hanmail.net" 
                className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg hover:bg-secondary/80 transition-colors whitespace-nowrap"
              >
                {intl.formatMessage({ id: 'occasion.consultation.email' })}
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}