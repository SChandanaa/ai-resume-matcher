import api from './api';

export interface MatchResult {
      bestMatch: {
            _id: string;
            fileName: string;
            score: number;
            matchExplanation: string;
      };
      allMatches: Array<{
            _id: string;
            fileName: string;
            score: number;
      }>;
      jobUrl?: string;
}

export const findBestResume = async (data: {
      userId: string;
      jobDescription: string;
      jobUrl?: string;
}): Promise<MatchResult> => {
      const response = await api.post('/jobs/match', data);
      return response.data;
};
