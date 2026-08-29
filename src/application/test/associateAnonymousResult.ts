import type { TestRepository } from "../../domain/test/TestRepository";


export async function associateAnonymousResult(userId: string, testRepository: TestRepository) {
  const raw = sessionStorage.getItem('vocational_test_result');
  if (!raw) return; // registo direto, sem ter feito teste antes — nada a associar

  const { recommendedCourseId, isTie, runnerUpCourseId, allScores } = JSON.parse(raw);

  await testRepository.saveResult({
    userId,
    recommendedCourseId,
    isTie,
    runnerUpCourseId, 
    allScores
  });

  sessionStorage.removeItem('vocational_test_answers');
  sessionStorage.removeItem('vocational_test_result');
}