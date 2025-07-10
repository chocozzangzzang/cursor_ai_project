'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface BlogFormData {
  topic: string;
  tone: 'professional' | 'casual' | 'humorous' | 'inspirational' | 'educational' | 'conversational';
  length: number;
  keywords: string;
  audience: 'general' | 'beginners' | 'intermediate' | 'experts' | 'professionals' | 'students';
}

interface BlogFormProps {
  onSubmit: (data: BlogFormData) => Promise<void>;
  isLoading: boolean;
}

export function BlogForm({ onSubmit, isLoading }: BlogFormProps) {
  const [formData, setFormData] = useState<BlogFormData>({
    topic: '',
    tone: 'professional',
    length: 500,
    keywords: '',
    audience: 'general',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToneChange = (value: string) => {
    setFormData((prev) => ({ 
      ...prev, 
      tone: value as 'professional' | 'casual' | 'humorous' | 'inspirational' | 'educational' | 'conversational' 
    }));
  };

  const handleAudienceChange = (value: string) => {
    setFormData((prev) => ({ 
      ...prev, 
      audience: value as 'general' | 'beginners' | 'intermediate' | 'experts' | 'professionals' | 'students' 
    }));
  };

  const handleLengthChange = (value: number[]) => {
    setFormData((prev) => ({ ...prev, length: value[0] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic.trim()) {
      toast.error('주제를 입력해주세요');
      return;
    }

    await onSubmit(formData);
  };

  const getLengthLabel = (length: number) => {
    if (length < 400) return '짧은 글';
    if (length < 800) return '중간 길이';
    if (length < 1200) return '긴 글';
    return '매우 긴 글';
  };

  const toneDescriptions = {
    professional: '공식적이고 정보 중심적인 톤으로, 전문성을 강조합니다.',
    casual: '친근하고 일상적인 대화체로, 독자와 가깝게 소통합니다.',
    humorous: '재미있고 가벼운 톤으로, 유머와 위트를 섞어 표현합니다.',
    inspirational: '동기부여적이고 영감을 주는 톤으로, 독자에게 긍정적인 영향을 줍니다.',
    educational: '교육적이고 설명하는 톤으로, 개념을 명확히 전달합니다.',
    conversational: '대화형 톤으로, 독자와 직접 대화하는 듯한 느낌을 줍니다.'
  };

  const audienceDescriptions = {
    general: '일반 대중을 대상으로 하는 글입니다.',
    beginners: '해당 주제에 대한 기초 지식이 없는 초보자를 위한 글입니다.',
    intermediate: '기본 지식은 있지만 더 깊은 이해를 원하는 중급자를 위한 글입니다.',
    experts: '해당 분야에 대한 전문 지식을 가진 전문가를 위한 글입니다.',
    professionals: '관련 직종에 종사하는 전문 직업인을 위한 글입니다.',
    students: '학생들을 대상으로 교육적 목적의 글입니다.'
  };

  return (
    <Card className="p-[15px] glass-effect w-full">
      <form onSubmit={handleSubmit} className="space-y-[20px]">
        <div className="space-y-[10px]">
          <Label htmlFor="topic" className="text-white">블로그 주제</Label>
          <Input
            id="topic"
            name="topic"
            placeholder="작성할 블로그의 주제를 입력하세요"
            value={formData.topic}
            onChange={handleInputChange}
            className="glass-effect text-white placeholder-gray-400 w-full"
            style={{ 
              color: 'white',
              padding: '10px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div className="space-y-[10px]">
          <Label htmlFor="keywords" className="text-white">SEO 키워드 (쉼표로 구분)</Label>
          <Input
            id="keywords"
            name="keywords"
            placeholder="SEO에 활용할 키워드들을 쉼표로 구분하여 입력하세요"
            value={formData.keywords}
            onChange={handleInputChange}
            className="glass-effect text-white placeholder-gray-400 w-full"
            style={{ 
              color: 'white',
              padding: '10px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div className="space-y-[10px]">
          <Label className="text-white">글의 톤</Label>
          <Select 
            value={formData.tone} 
            onValueChange={handleToneChange}
          >
            <SelectTrigger className="glass-effect w-full" 
              style={{ 
                color: 'white',
                padding: '10px',
                boxSizing: 'border-box'
              }}
            >
              <SelectValue placeholder="글의 톤을 선택하세요" style={{ color: 'white' }} />
            </SelectTrigger>
            <SelectContent className="glass-effect" style={{ padding: '10px', color: 'white' }}>
              <SelectItem value="professional" className="text-white">전문적</SelectItem>
              <SelectItem value="casual" className="text-white">캐주얼</SelectItem>
              <SelectItem value="humorous" className="text-white">유머러스</SelectItem>
              <SelectItem value="inspirational" className="text-white">영감을 주는</SelectItem>
              <SelectItem value="educational" className="text-white">교육적</SelectItem>
              <SelectItem value="conversational" className="text-white">대화형</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-300 mt-1">
            {toneDescriptions[formData.tone]}
          </p>
        </div>

        <div className="space-y-[10px]">
          <Label className="text-white">대상 독자</Label>
          <Select 
            value={formData.audience} 
            onValueChange={handleAudienceChange}
          >
            <SelectTrigger className="glass-effect w-full" 
              style={{ 
                color: 'white',
                padding: '10px',
                boxSizing: 'border-box'
              }}
            >
              <SelectValue placeholder="대상 독자를 선택하세요" style={{ color: 'white' }} />
            </SelectTrigger>
            <SelectContent className="glass-effect" style={{ padding: '10px', color: 'white' }}>
              <SelectItem value="general" className="text-white">일반 대중</SelectItem>
              <SelectItem value="beginners" className="text-white">초보자</SelectItem>
              <SelectItem value="intermediate" className="text-white">중급자</SelectItem>
              <SelectItem value="experts" className="text-white">전문가</SelectItem>
              <SelectItem value="professionals" className="text-white">전문 직업인</SelectItem>
              <SelectItem value="students" className="text-white">학생</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-300 mt-1">
            {audienceDescriptions[formData.audience]}
          </p>
        </div>

        <div className="space-y-[10px]">
          <div className="flex justify-between">
            <Label className="text-white">글의 길이</Label>
            <span className="text-gray-300 text-sm">
              {formData.length} 자 ({getLengthLabel(formData.length)})
            </span>
          </div>
          <div className="py-6">
            <style jsx global>{`
              .slider-custom [data-slot="slider-track"] {
                background-color: rgba(255, 255, 255, 0.2);
                height: 8px;
              }
              .slider-custom [data-slot="slider-range"] {
                background: linear-gradient(to right, #3b82f6, #8b5cf6);
              }
              .slider-custom [data-slot="slider-thumb"] {
                background-color: white;
                border: 2px solid #8b5cf6;
                width: 20px;
                height: 20px;
              }
            `}</style>
            <div className="slider-custom">
              <Slider
                defaultValue={[500]}
                min={200}
                max={1500}
                step={50}
                value={[formData.length]}
                onValueChange={handleLengthChange}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>200자</span>
            <span>1500자</span>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
          style={{ 
            padding: '10px',
            boxSizing: 'border-box'
          }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span>블로그 글 생성하기</span>
            </div>
          )}
        </Button>
      </form>
    </Card>
  );
} 