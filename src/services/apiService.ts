import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import type { WizardState, SubmitResponse } from '../types';

export const apiClient = axios.create({
  baseURL: '/api',
  timeout: 5000,
});

// Configure mock adapter
export const mockAdapter = new MockAdapter(apiClient, { delayResponse: 2000 });

// Intercept '/submit' post request
mockAdapter.onPost('/submit').reply((config) => {
  try {
    const payload = JSON.parse(config.data) as WizardState;

    // Validate a few key details to check mock payload integrity
    if (!payload.personalInfo?.fullName || !payload.personalInfo?.nationalId) {
      return [
        400,
        {
          success: false,
          message: 'validation.required',
        },
      ];
    }

    // Dynamic random failure for realistic testing (75% success rate)
    const isSuccess = Math.random() > 0.25;

    if (isSuccess) {
      const trackingNumber = `SSP-${Math.floor(100000 + Math.random() * 900000)}`;
      return [
        200,
        {
          success: true,
          message: 'app.submitSuccess',
          applicationId: trackingNumber,
        } as SubmitResponse,
      ];
    } else {
      return [
        500,
        {
          success: false,
          message: 'app.submitErrorDesc',
        } as SubmitResponse,
      ];
    }
  } catch (e) {
    return [
      500,
      {
        success: false,
        message: 'An internal mock server error occurred.',
      },
    ];
  }
});

export const submitSocialSupportApplication = async (
  stateData: WizardState
): Promise<SubmitResponse> => {
  try {
    const response = await apiClient.post('/submit', stateData);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    throw new Error(error.message || 'Network connection failed.');
  }
};
