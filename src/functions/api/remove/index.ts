import { Context } from 'hono';

export interface Env {
  REMOVE_BG_API_KEY: string;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image');

    if (!imageFile || !(imageFile instanceof File)) {
      return Response.json(
        { error: '请上传有效的图片文件' },
        { status: 400 }
      );
    }

    // 验证文件类型
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(imageFile.type)) {
      return Response.json(
        { error: '不支持的文件格式，请上传 PNG、JPG 或 WebP 格式' },
        { status: 415 }
      );
    }

    // 验证文件大小（最大 10MB）
    if (imageFile.size > 10 * 1024 * 1024) {
      return Response.json(
        { error: '图片大小不能超过 10MB' },
        { status: 413 }
      );
    }

    // 调用 remove.bg API
    const removeBgFormData = new FormData();
    removeBgFormData.append('image_file', imageFile);
    removeBgFormData.append('size', 'auto');

    const removeBgResponse = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': (request as any).REMOVE_BG_API_KEY,
      },
      body: removeBgFormData,
    });

    if (!removeBgResponse.ok) {
      const errorData = await removeBgResponse.text();
      console.error('remove.bg API error:', errorData);
      
      if (removeBgResponse.status === 403) {
        return Response.json(
          { error: 'API Key 无效或已过期' },
          { status: 500 }
        );
      }
      
      if (removeBgResponse.status === 402) {
        return Response.json(
          { error: 'API 额度已用完，请稍后再试' },
          { status: 500 }
        );
      }

      return Response.json(
        { error: '背景移除失败，请稍后重试' },
        { status: 500 }
      );
    }

    // 返回处理后的图片
    const processedImage = await removeBgResponse.blob();
    
    return new Response(processedImage, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="no-bg.png"',
        'X-Image-ID': crypto.randomUUID(),
      },
    });
  } catch (error) {
    console.error('处理错误:', error);
    return Response.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}
