import api from './api';

export interface ScanResult {
      trustScore: number;
      riskFactors: {
            riskType: string;
            severity: string;
            description: string;
      }[];
      reportCount: number;
}

export const verifyJob = async (data: {
      jobUrl?: string;
      companyName: string;
      recruiterEmail?: string;
      description?: string;
}): Promise<ScanResult> => {
      const response = await api.post('/scam/verify', data);
      return response.data;
};

export const reportScam = async (data: {
      companyName: string;
      jobUrl?: string;
      recruiterEmail?: string;
      description: string;
      scamType?: string;
}) => {
      const response = await api.post('/scam/report', data);
      return response.data;
};

export const getRecentReports = async () => {
      const response = await api.get('/scam/reports');
      return response.data;
};
