'use client';

import { useState } from 'react';
import { ArrowLeft, Copy } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { BlogForm, BlogFormData } from '@/components/BlogForm';
import { BlogPreview } from '@/components/BlogPreview';

export default function BlogWriterPage() {
  const [blogContent, setBlogContent] = useState<string>('');
  const [processedContent, setProcessedContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // $ 기호 문제를 해결하는 함수
  const processDollarSigns = (content: string): string => {
    // $2와 같은 패턴을 찾아서 처리
    return content.replace(/\$(\d+)/g, (match, number) => {
      return `${number}`;
    });
  };

  const handleSubmit = async (formData: BlogFormData) => {
    setIsLoading(true);
    setBlogContent('');
    setProcessedContent('');

    try {
      const response = await fetch('/api/blog-writer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('응답을 받아올 수 없습니다.');

      const data = await response.json();
      // 원본 컨텐츠 저장
      setBlogContent(data.content);
      // $ 기호 문제 처리 후 컨텐츠 설정
      const processed = processDollarSigns(data.content);
      setProcessedContent(processed);
    } catch (error) {
      console.error('Error:', error);
      toast.error('블로그 글 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(processedContent)
      .then(() => toast.success('클립보드에 복사되었습니다'))
      .catch(() => toast.error('복사 실패'));
  };

  return (
    <div className="min-h-screen bg-[#121212] text-gray-200 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          블로그 글 작성기
        </h1>
        
        <div className="flex justify-center">
          <div className="w-[60%] flex justify-between items-start">
            <div className="w-[43%] flex flex-col">
              <div className="flex items-center h-[36px] mb-[15px]">
                <Link href="/" className="flex items-center text-gray-400 hover:text-gray-200 transition-colors">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  <span>돌아가기</span>
                </Link>
              </div>
              <BlogForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
            
            <div className="w-[53%] flex flex-col">
              <div className="flex justify-between items-center h-[36px] mb-[15px]">
                <h2 className="text-xl font-semibold text-gray-200">생성된 블로그 글</h2>
                {processedContent && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={copyToClipboard}
                    className="text-white border-gray-500 hover:bg-gray-700"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    복사
                  </Button>
                )}
              </div>
              <div className="flex-1">
                <BlogPreview content={processedContent} isLoading={isLoading} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 