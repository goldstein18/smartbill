
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Handshake, TrendingUp, Award, Users, DollarSign, Clock } from 'lucide-react';
import { PARTNER_PROGRAM } from '@/config/pricing';
import { useLanguage } from '@/context/LanguageContext';
import { useNavigate } from 'react-router-dom';

export const PartnerProgram: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const handleApplyForPartnership = () => {
    navigate('/partner-contact');
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Handshake className="h-8 w-8 text-blue-600" />
          <h2 className="text-4xl font-bold text-gray-900">
            {t('pricing.partnerProgram.title')}
          </h2>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {t('pricing.partnerProgram.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Program Overview */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-6 w-6 text-blue-600" />
              {t('pricing.partnerProgram.programHighlights')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white rounded-lg">
                <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{PARTNER_PROGRAM.commission}%</div>
                <div className="text-sm text-gray-600">{t('pricing.partnerProgram.commissionRate')}</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{PARTNER_PROGRAM.duration}</div>
                <div className="text-sm text-gray-600">{t('pricing.partnerProgram.monthsCommission')}</div>
              </div>
            </div>

            <div className="text-center p-4 bg-white rounded-lg">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{PARTNER_PROGRAM.maxPartners}</div>
              <div className="text-sm text-gray-600">{t('pricing.partnerProgram.limitedPartnerSpots')}</div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
              {t('pricing.partnerProgram.partnerBenefits')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {PARTNER_PROGRAM.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="text-center p-8">
          <h3 className="text-2xl font-bold mb-4">{t('pricing.partnerProgram.readyToBecome')}</h3>
          <p className="text-blue-100 mb-6">
            {t('pricing.partnerProgram.joinExclusive')}
          </p>
          <div className="flex items-center justify-center gap-4 mb-6">
            <Badge className="bg-white text-blue-600 px-3 py-1">
              {t('pricing.partnerProgram.limitedTime')}
            </Badge>
            <Badge className="bg-yellow-500 text-white px-3 py-1">
              {t('pricing.partnerProgram.spotsAvailable').replace('{count}', PARTNER_PROGRAM.maxPartners.toString())}
            </Badge>
          </div>
          <Button 
            onClick={handleApplyForPartnership}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
          >
            {t('pricing.partnerProgram.applyForPartnership')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
