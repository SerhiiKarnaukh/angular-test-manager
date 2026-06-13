import { AI_LAB_ROUTES } from './ai-lab.routes';

describe('AI_LAB_ROUTES', () => {
  it('registers all ai-lab child routes under main layout', () => {
    expect(AI_LAB_ROUTES).toHaveLength(1);

    const layoutRoute = AI_LAB_ROUTES[0];
    expect(layoutRoute.children).toHaveLength(4);
    expect(layoutRoute.children?.map((route) => route.path)).toEqual([
      'ai-lab',
      'ai-lab/image-generator',
      'ai-lab/voice-generator',
      'ai-lab/realtime-chat',
    ]);
  });
});
