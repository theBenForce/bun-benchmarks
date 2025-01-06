import { handler } from '@repo/common-handler';

export default {
  async handler(request: Request) {
    const result = await handler();

    return new Response(result.body, {
      status: result.statusCode,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}