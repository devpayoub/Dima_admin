export async function generateReward(): Promise<{ code: string; message: string }> {
  try {
    const res = await fetch('/api/v1/public/reward');
    if (!res.ok) throw new Error('Failed to generate reward');
    return await res.json();
  } catch {
    return {
      code: 'STAMP10',
      message: "Enjoy your well-earned reward!"
    };
  }
}
