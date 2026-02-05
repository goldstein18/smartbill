
import React from "react";
import { Star } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const TestimonialsSection: React.FC = () => {
  const { t } = useLanguage();

  const testimonials = [
    {
      name: t('landing.testimonials.testimonial1.name'),
      title: t('landing.testimonials.testimonial1.title'),
      content: t('landing.testimonials.testimonial1.content'),
      rating: 5
    },
    {
      name: t('landing.testimonials.testimonial2.name'),
      title: t('landing.testimonials.testimonial2.title'),
      content: t('landing.testimonials.testimonial2.content'),
      rating: 5
    },
    {
      name: t('landing.testimonials.testimonial3.name'),
      title: t('landing.testimonials.testimonial3.title'),
      content: t('landing.testimonials.testimonial3.content'),
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-16 bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            {t('landing.testimonials.title')}
          </h2>
          <p className="text-xl text-slate-300">
            {t('landing.testimonials.subtitle')}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-accent">
              <div className="text-4xl text-accent/30 font-serif leading-none mb-2">"</div>
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-warning fill-current" />
                ))}
              </div>
              <p className="text-slate-600 mb-4">{testimonial.content}</p>
              <div>
                <div className="font-semibold text-slate-900">{testimonial.name}</div>
                <div className="text-sm text-slate-500">{testimonial.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
