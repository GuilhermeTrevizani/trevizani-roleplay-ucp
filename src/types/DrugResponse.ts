export default interface DrugResponse {
  id: string;
  name: string;
  thresoldDeath: number;
  health: number;
  garbageCollectorMultiplier: number;
  truckerMultiplier: number;
  minutesDuration: number;
  warn: string;
  shakeGameplayCamName: string;
  shakeGameplayCamIntensity: number;
  timecycModifier: string;
  animpostFXName: string;
}