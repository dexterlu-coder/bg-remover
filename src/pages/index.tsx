'use client';

import { useState, useCallback, useRef } from 'react';

export default function Home() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingTime, setProcessingTime] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理文件选择
  const handleFile = useCallback((file: File) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('不支持的文件格式，请上传 PNG、JPG 或 WebP 格式');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('图片大小不能超过 10MB');
      return;
    }

    setError(null);
    setSelectedFile(file);
    
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, []);

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

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    if (e.clipboardData?.files && e.clipboardData.files[0]) {
      handleFile(e.clipboardData.files[0]);
    }
  }, [handleFile]);

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    const startTime = Date.now();

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

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      
      const endTime = Date.now();
      setProcessingTime(Math.round((endTime - startTime) / 1000));

      const link = document.createElement('a');
      link.href = url;
      link.download = 'removed-background.png';
      link.click();
    } catch (err) {
      setError(err instanceof Error ? err.message : '处理失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResultUrl(null);
    setError(null);
    setProcessingTime(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const sampleImages = [
    { name: '产品图', emoji: '📦' },
    { name: '人像', emoji: '👤' },
    { name: '宠物', emoji: '🐱' },
    { name: '汽车', emoji: '🚗' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">🎨</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Background Remover
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">功能</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">如何使用</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">价格</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2U1ZTdlYiIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiBvcGFjaXR5PSIwLjQiLz48L3N2Zz4=')] opacity-40"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            一键移除图片背景
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mt-2">
              3 秒内完成
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            基于 AI 技术，自动识别并移除图片背景，保留完美边缘。
            <br />
            支持产品、人像、宠物、汽车等多种场景。
          </p>

          {/* Upload Area */}
          <div className="max-w-2xl mx-auto">
            {!selectedFile ? (
              <div
                className={`relative border-2 border-dashed rounded-3xl p-12 transition-all duration-300 ${
                  dragActive
                    ? 'border-purple-500 bg-purple-50 scale-105 shadow-xl'
                    : 'border-gray-300 bg-white/80 hover:border-purple-400 hover:shadow-lg'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onPaste={handlePaste}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleChange}
                />
                <label htmlFor="file-upload" className="cursor-pointer block">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-xl font-semibold text-gray-800 mb-2">
                    拖拽图片到此处，或点击选择
                  </p>
                  <p className="text-gray-500 mb-4">
                    支持 PNG, JPG, WebP（最大 10MB）
                  </p>
                  <p className="text-sm text-gray-400">
                    💡 提示：也可以使用 Ctrl+V 粘贴图片
                  </p>
                </label>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                {/* Comparison View */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="relative group">
                    <div className="absolute -top-3 left-4 bg-gray-800 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      原图
                    </div>
                    <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-200">
                      {previewUrl && (
                        <img
                          src={previewUrl}
                          alt="原图"
                          className="w-full h-full object-contain p-4"
                        />
                      )}
                    </div>
                  </div>
                  
                  <div className="relative group">
                    <div className="absolute -top-3 left-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      处理后
                    </div>
                    <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-purple-200">
                      {resultUrl ? (
                        <img
                          src={resultUrl}
                          alt="处理后"
                          className="w-full h-full object-contain p-4"
                          style={{
                            backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                            backgroundSize: '20px 20px',
                            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {loading ? (
                            <div className="text-center">
                              <div className="relative w-16 h-16 mx-auto mb-4">
                                <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 border-r-purple-600 animate-spin"></div>
                              </div>
                              <p className="text-gray-600 font-medium">正在智能识别...</p>
                              <p className="text-sm text-gray-400 mt-1">通常需要 3-5 秒</p>
                            </div>
                          ) : (
                            <div className="text-center">
                              <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <p className="text-gray-400">点击"移除背景"开始处理</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 justify-center">
                  {!resultUrl && (
                    <button
                      onClick={handleUpload}
                      disabled={loading}
                      className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          处理中...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          移除背景
                        </span>
                      )}
                    </button>
                  )}
                  
                  {resultUrl && (
                    <>
                      <a
                        href={resultUrl}
                        download="removed-background.png"
                        className="px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold text-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        下载高清图片
                      </a>
                      {processingTime && (
                        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="font-medium">处理完成！用时 {processingTime} 秒</span>
                        </div>
                      )}
                    </>
                  )}
                  
                  <button
                    onClick={handleReset}
                    className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    重新上传
                  </button>
                </div>
              </div>
            )}

            {/* Sample Images */}
            {!selectedFile && (
              <div className="mt-8">
                <p className="text-sm text-gray-500 mb-4">没有图片？试试这些示例</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {sampleImages.map((sample) => (
                    <button
                      key={sample.name}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-purple-300 hover:text-purple-600 transition-all flex items-center gap-2"
                    >
                      <span>{sample.emoji}</span>
                      <span>{sample.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 max-w-2xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              为什么选择我们？
            </h2>
            <p className="text-xl text-gray-600">
              专业的 AI 背景移除工具，适合各种使用场景
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '⚡',
                title: '极速处理',
                desc: '3 秒内完成背景移除，无需等待',
                color: 'from-yellow-400 to-orange-500'
              },
              {
                icon: '🎯',
                title: '精准识别',
                desc: 'AI 智能识别，完美处理发丝等细节',
                color: 'from-blue-400 to-purple-500'
              },
              {
                icon: '✨',
                title: '高清输出',
                desc: '保留原始分辨率，支持透明 PNG',
                color: 'from-green-400 to-emerald-500'
              },
              {
                icon: '🔒',
                title: '安全隐私',
                desc: '自动删除上传文件，保护您的隐私',
                color: 'from-pink-400 to-red-500'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              适用场景
            </h2>
            <p className="text-xl text-gray-600">
              无论个人还是企业，都能找到适合的用法
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { emoji: '📦', title: '电商产品', desc: '商品图去底，用于主图/详情页' },
              { emoji: '📱', title: '社交媒体', desc: '配图处理，制作精美封面' },
              { emoji: '🎨', title: '设计素材', desc: '快速抠图，创意合成' },
              { emoji: '👤', title: '证件照', desc: '更换背景色，制作标准证件照' },
              { emoji: '🏢', title: '企业宣传', desc: '团队照片统一背景' },
              { emoji: '📊', title: '演示文稿', desc: '制作专业的 PPT 配图' }
            ].map((useCase, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-4">{useCase.emoji}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {useCase.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {useCase.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              如何使用
            </h2>
            <p className="text-xl text-gray-600">
              简单的三步，完成专业级背景移除
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: '上传图片',
                desc: '拖拽或点击选择，支持多种格式',
                color: 'bg-blue-500'
              },
              {
                step: '02',
                title: 'AI 处理',
                desc: '智能识别主体，移除背景',
                color: 'bg-purple-500'
              },
              {
                step: '03',
                title: '下载结果',
                desc: '获取透明背景 PNG 图片',
                color: 'bg-green-500'
              }
            ].map((item, index) => (
              <div key={index} className="relative text-center">
                <div className={`w-16 h-16 ${item.color} text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6`}>
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.desc}
                </p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-gray-200 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              免费使用
            </h2>
            <p className="text-xl text-gray-600">
              目前完全免费，无需注册
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-purple-200">
              <div className="text-center mb-6">
                <div className="inline-block px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
                  限时免费
                </div>
                <div className="text-5xl font-bold text-gray-900 mb-2">
                  ¥0
                </div>
                <p className="text-gray-600">
                  目前阶段完全免费使用
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  '无限次背景移除',
                  '高清分辨率输出',
                  '透明 PNG 格式',
                  '无需注册账号',
                  '自动安全删除'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                立即开始使用
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">🎨</span>
                </div>
                <span className="text-xl font-bold">AI Background Remover</span>
              </div>
              <p className="text-gray-400 text-sm">
                专业的 AI 图片背景移除工具
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">产品</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">功能特性</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">使用教程</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">价格方案</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">支持</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">帮助中心</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API 文档</a></li>
                <li><a href="#" className="hover:text-white transition-colors">联系我们</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">法律</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">隐私政策</a></li>
                <li><a href="#" className="hover:text-white transition-colors">服务条款</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie 政策</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2026 AI Background Remover. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
