'use client';

import { useState, useCallback } from 'react';

export default function Home() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 处理文件选择
  const handleFile = useCallback((file: File) => {
    // 验证文件类型
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('不支持的文件格式，请上传 PNG、JPG 或 WebP 格式');
      return;
    }

    // 验证文件大小（最大 10MB）
    if (file.size > 10 * 1024 * 1024) {
      setError('图片大小不能超过 10MB');
      return;
    }

    setError(null);
    setSelectedFile(file);
    
    // 创建预览 URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, []);

  // 拖拽事件处理
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  // 上传并处理图片
  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch('/api/remove', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '处理失败');
      }

      // 获取处理后的图片
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setResultUrl(url);

      // 自动下载
      const link = document.createElement('a');
      link.href = url;
      link.download = 'no-bg.png';
      link.click();
    } catch (err) {
      setError(err instanceof Error ? err.message : '处理失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 重新上传
  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResultUrl(null);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* 标题 */}
        <h1 className="text-4xl font-bold text-center text-indigo-600 mb-2">
          🎨 AI 背景移除工具
        </h1>
        <p className="text-center text-gray-600 mb-8">
          上传图片，5 秒内自动移除背景
        </p>

        {/* 上传区域 */}
        {!selectedFile ? (
          <div
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
              dragActive
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-300 bg-white'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleChange}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer"
            >
              <div className="text-6xl mb-4">📁</div>
              <p className="text-lg text-gray-700 mb-2">
                拖拽图片到此处，或点击选择
              </p>
              <p className="text-sm text-gray-500">
                支持 PNG, JPG, WebP（最大 10MB）
              </p>
            </label>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            {/* 预览区域 */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">原图</h3>
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="原图"
                    className="w-full h-64 object-contain rounded-lg bg-gray-100"
                  />
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">处理后</h3>
                {resultUrl ? (
                  <img
                    src={resultUrl}
                    alt="处理后"
                    className="w-full h-64 object-contain rounded-lg bg-gray-100"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    {loading ? (
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                        <p className="text-gray-600">正在移除背景...</p>
                      </div>
                    ) : (
                      <p className="text-gray-400">等待处理</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-4 justify-center">
              {!resultUrl && (
                <button
                  onClick={handleUpload}
                  disabled={loading}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? '处理中...' : '移除背景'}
                </button>
              )}
              {resultUrl && (
                <a
                  href={resultUrl}
                  download="no-bg.png"
                  className="px-8 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
                >
                  下载图片
                </a>
              )}
              <button
                onClick={handleReset}
                className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
              >
                重新上传
              </button>
            </div>
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center">
            ❌ {error}
          </div>
        )}

        {/* 特性说明 */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-medium text-gray-900">快速</h3>
            <p className="text-sm text-gray-600">5 秒内完成处理</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">✨</div>
            <h3 className="font-medium text-gray-900">简单</h3>
            <p className="text-sm text-gray-600">无需注册，即传即用</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-medium text-gray-900">高质量</h3>
            <p className="text-sm text-gray-600">基于 remove.bg AI 模型</p>
          </div>
        </div>
      </div>
    </main>
  );
}
