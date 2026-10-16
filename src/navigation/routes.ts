/**
 * The two places the course navigates to, in one spot so every screen goes
 * there the same way — same params, same haptic.
 */

import { router } from 'expo-router';

import { emitFeedback } from '@/feedback';

export function openLesson(lessonId: string): void {
  router.push({ pathname: '/lesson/[lessonId]', params: { lessonId } });
}

export function openModule(moduleId: string): void {
  emitFeedback('select');
  router.push({ pathname: '/module/[moduleId]', params: { moduleId } });
}
