'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface BlogPreviewProps {
  content: string;
  isLoading: boolean;
}

export function BlogPreview({ content, isLoading }: BlogPreviewProps) {
  const [formattedContent, setFormattedContent] = useState<string>('');

  useEffect(() => {
    if (!content) return;

    // 마크다운 변환 전 처리
    const processedContent = content;
    
    // 간단한 마크다운 변환 (실제 프로덕션에서는 marked 등의 라이브러리 사용 권장)
    let formatted = processedContent;
    
    // 제목 변환
    formatted = formatted.replace(/^# (.*$)/gim, function(match, p1) {
      return `<h1 class="text-2xl font-bold mt-6 mb-[15px] text-blue-400 text-center">${p1}</h1>`;
    });
    
    formatted = formatted.replace(/^## (.*$)/gim, function(match, p1) {
      return `<h2 class="text-xl font-bold mt-5 mb-[15px] text-purple-400 text-center">${p1}</h2>`;
    });
    
    formatted = formatted.replace(/^### (.*$)/gim, function(match, p1) {
      return `<h3 class="text-lg font-bold mt-4 mb-[15px] text-pink-400 text-center">${p1}</h3>`;
    });
    
    // 굵은 글씨
    formatted = formatted.replace(/\*\*(.*?)\*\*/gim, function(match, p1) {
      return `<strong>${p1}</strong>`;
    });
    
    // 기울임체
    formatted = formatted.replace(/\*(.*?)\*/gim, function(match, p1) {
      return `<em>${p1}</em>`;
    });
    
    // 목록
    formatted = formatted.replace(/^\s*-\s(.*$)/gim, function(match, p1) {
      return `<li class="ml-4 mb-1">${p1}</li>`;
    });
    
    // 링크
    formatted = formatted.replace(/\[(.*?)\]\((.*?)\)/gim, function(match, p1, p2) {
      return `<a href="${p2}" class="text-blue-400 hover:underline">${p1}</a>`;
    });
    
    // 문단
    formatted = formatted.replace(/^\s*(\n)?([^\n]+)/gim, function(m) {
      return /^\s*<(\/)?(h|ul|ol|li|blockquote|pre|img)/.test(m) ? m : `<p class="mb-4 text-center mt-0">${m}</p>`;
    });
    
    
    // $2와 같은 패턴 제거 (최종 안전장치)
    formatted = formatted.replace(/\$(\d+)/g, function(match, p1) {
      return p1;
    });

    // 추가 스타일 적용
    const styleTag = `
      <style>
        h2 + p, h3 + p {
          margin-top: 0 !important;
        }
      </style>
    `;
    
    setFormattedContent(styleTag + formatted);
  }, [content]);

  if (isLoading) {
    return (
      <Card className="glass-effect p-[15px] overflow-hidden flex flex-col h-full">
        <div className="mb-4">
          <Skeleton className="h-8 w-3/4 bg-gray-700/30" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-full bg-gray-700/30" />
          <Skeleton className="h-4 w-full bg-gray-700/30" />
          <Skeleton className="h-4 w-5/6 bg-gray-700/30" />
          <Skeleton className="h-4 w-full bg-gray-700/30" />
          <Skeleton className="h-4 w-4/5 bg-gray-700/30" />
        </div>
        <div className="mt-6 mb-4">
          <Skeleton className="h-6 w-1/2 bg-gray-700/30" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-full bg-gray-700/30" />
          <Skeleton className="h-4 w-5/6 bg-gray-700/30" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass-effect p-[15px] overflow-auto h-full">
      {content ? (
        <div 
          className="prose prose-invert max-w-none text-white"
          dangerouslySetInnerHTML={{ __html: formattedContent }}
        />
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-white text-center p-8">
          <div className="text-6xl mb-4">✍️</div>
          <h3 className="text-xl font-bold mb-2">블로그 생성 준비 완료</h3>
          <p className="text-gray-300 mb-4">
            왼쪽 양식을 작성하고 생성 버튼을 클릭하면<br />
            AI가 SEO에 최적화된 블로그 글을 작성합니다
          </p>
          <ul className="text-sm text-gray-400 text-left">
            <li>• 주제에 맞는 전문적인 내용 생성</li>
            <li>• 선택한 톤에 맞춘 글쓰기 스타일</li>
            <li>• SEO 키워드 자연스럽게 포함</li>
            <li>• 구조화된 제목과 소제목</li>
          </ul>
        </div>
      )}
    </Card>
  );
} 