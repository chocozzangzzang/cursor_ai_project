'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface SeoHelperProps {
  content: string;
  keywords: string;
}

export function SeoHelper({ content, keywords }: SeoHelperProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [seoScore, setSeoScore] = useState<number | null>(null);
  const [seoTips, setSeoTips] = useState<string[]>([]);
  const [keywordDensity, setKeywordDensity] = useState<Record<string, number>>({});

  const analyzeSeo = () => {
    if (!content) return;
    
    setIsAnalyzing(true);
    
    // 간단한 SEO 분석 로직 (실제로는 더 복잡한 알고리즘 사용 필요)
    setTimeout(() => {
      const contentLower = content.toLowerCase();
      const wordCount = content.split(/\s+/).length;
      
      // 키워드 밀도 분석
      const keywordList = keywords
        .split(',')
        .map(k => k.trim().toLowerCase())
        .filter(Boolean);
      
      const densityMap: Record<string, number> = {};
      
      keywordList.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = content.match(regex) || [];
        const density = Math.round((matches.length / wordCount) * 100 * 10) / 10;
        densityMap[keyword] = density;
      });
      
      // SEO 팁 생성
      const tips: string[] = [];
      
      // 제목 분석
      const hasH1 = /^#\s.+/m.test(content);
      if (!hasH1) {
        tips.push('H1 태그(#)를 사용하여 주요 제목을 추가하세요.');
      }
      
      // 소제목 분석
      const hasH2 = /^##\s.+/m.test(content);
      if (!hasH2) {
        tips.push('H2 태그(##)를 사용하여 소제목을 추가하세요.');
      }
      
      // 키워드 밀도 분석
      Object.entries(densityMap).forEach(([keyword, density]) => {
        if (density < 0.5) {
          tips.push(`'${keyword}' 키워드의 밀도가 낮습니다(${density}%). 1-2% 사이가 이상적입니다.`);
        } else if (density > 3) {
          tips.push(`'${keyword}' 키워드의 밀도가 높습니다(${density}%). 키워드 스터핑으로 간주될 수 있습니다.`);
        }
      });
      
      // 문단 길이 분석
      const paragraphs = content.split(/\n\n+/);
      const longParagraphs = paragraphs.filter(p => p.split(/\s+/).length > 100).length;
      
      if (longParagraphs > 0) {
        tips.push('일부 문단이 너무 깁니다. 가독성을 위해 100단어 이하로 유지하세요.');
      }
      
      // 이미지 태그 분석
      const hasImageSuggestion = !content.includes('![');
      if (hasImageSuggestion) {
        tips.push('이미지를 추가하여 시각적 매력을 높이고 SEO를 개선하세요.');
      }
      
      // 내부/외부 링크 분석
      const hasLinks = /\[.*?\]\(.*?\)/.test(content);
      if (!hasLinks) {
        tips.push('내부 또는 외부 링크를 추가하여 SEO 점수를 향상시키세요.');
      }
      
      // 점수 계산 (간단한 알고리즘)
      let score = 70; // 기본 점수
      
      // 제목 보너스
      if (hasH1) score += 5;
      if (hasH2) score += 5;
      
      // 키워드 밀도 보너스/페널티
      Object.values(densityMap).forEach(density => {
        if (density >= 0.5 && density <= 3) {
          score += 5;
        } else {
          score -= 5;
        }
      });
      
      // 문단 길이 페널티
      score -= longParagraphs * 2;
      
      // 링크 보너스
      if (hasLinks) score += 5;
      
      // 이미지 보너스
      if (!hasImageSuggestion) score += 5;
      
      // 점수 범위 제한
      score = Math.max(0, Math.min(100, score));
      
      setSeoScore(score);
      setSeoTips(tips);
      setKeywordDensity(densityMap);
      setIsAnalyzing(false);
    }, 1500);
  };
  
  const getSeoScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (!content) {
    return null;
  }

  return (
    <Card className="p-4 glass-effect mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">SEO 분석</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={analyzeSeo}
          disabled={isAnalyzing}
          className="text-white border-gray-500 hover:bg-gray-700"
        >
          {isAnalyzing ? '분석 중...' : '분석하기'}
        </Button>
      </div>

      {seoScore === null ? (
        <div className="text-white text-center py-4">
          <Info className="w-5 h-5 mx-auto mb-2" />
          <p>분석 버튼을 클릭하여 SEO 점수를 확인하세요</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <div className={`text-4xl font-bold ${getSeoScoreColor(seoScore)}`}>
              {seoScore}
            </div>
            <div className="text-white ml-2">/100</div>
          </div>

          {seoTips.length > 0 && (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="tips">
                <AccordionTrigger className="text-white">
                  개선 사항 ({seoTips.length})
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {seoTips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <AlertCircle className="w-4 h-4 text-yellow-400 mr-2 mt-0.5" />
                        <span className="text-white text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="keywords">
                <AccordionTrigger className="text-white">
                  키워드 밀도
                </AccordionTrigger>
                <AccordionContent>
                  {Object.keys(keywordDensity).length > 0 ? (
                    <ul className="space-y-2">
                      {Object.entries(keywordDensity).map(([keyword, density]) => (
                        <li key={keyword} className="flex items-center justify-between">
                          <span className="text-white text-sm">{keyword}</span>
                          <span 
                            className={`text-sm ${
                              density >= 0.5 && density <= 3 
                                ? 'text-green-400' 
                                : 'text-yellow-400'
                            }`}
                          >
                            {density}%
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-white text-sm">키워드를 입력하여 밀도를 분석하세요</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          <Alert className="bg-blue-900/20 border-blue-400/30">
            <Info className="h-4 w-4 text-blue-400" />
            <AlertTitle className="text-blue-400">SEO 팁</AlertTitle>
            <AlertDescription className="text-white text-sm">
              키워드 밀도는 1-2% 사이가 이상적입니다. 제목, 소제목, 첫 문단에 주요 키워드를 포함하세요.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </Card>
  );
} 