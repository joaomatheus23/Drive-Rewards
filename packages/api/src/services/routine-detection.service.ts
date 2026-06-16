/**
 * Smart Routine detection service.
 * Analyzes completed Session GPS trails to find repeated route patterns
 * (≥3 repetitions, same time window ±20min, same days of week).
 */
export class RoutineDetectionService {
  /** Run after session ends — checks if pattern qualifies for routine creation */
  async analyzeSession(_sessionId: string): Promise<void> {
    // TODO: cluster GPS points, match partner geofences, compare time windows
  }
}

export const routineDetectionService = new RoutineDetectionService();
