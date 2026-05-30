import axios from 'axios';

export interface AIGenerationOptions {
  field: 'financialSituation' | 'employmentCircumstances' | 'reasonForApplying';
  prompt?: string;
  language: 'en' | 'ar';
  contextData: {
    fullName?: string;
    monthlyIncome?: number;
    dependents?: number;
    employmentStatus?: string;
  };
  signal?: AbortSignal;
}

export const generateProfessionalStatement = async (
  options: AIGenerationOptions
): Promise<string> => {
  const { field, prompt, language, contextData, signal } = options;

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  // Graceful fallback if no API key is provided
  if (!apiKey || apiKey === 'YOUR_OPENAI_API_KEY_HERE') {
    // console.warn('VITE_OPENAI_API_KEY environment variable is not defined. Falling back to mock generation.');
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network latency

    if (language === 'ar') {
      if (field === 'financialSituation') {
        return `بصفتي ${contextData.fullName || 'مقدم الطلب'}، أواجه حالياً صعوبات مالية كبيرة. دخلنا الشهري البالغ ${contextData.monthlyIncome || 0} دولار لا يكفي لتغطية الاحتياجات الأساسية لأسرتي المكونة من ${contextData.dependents || 0} أفراد، خاصة في ظل تراكم الديون وتصاعد فواتير المعيشة والخدمات الأساسية.`;
      }
      if (field === 'employmentCircumstances') {
        return `إن وضعي الوظيفي الحالي هو "${contextData.employmentStatus || 'عاطل عن العمل'}". أسعى جاهدًا للبحث عن عمل مستقر، ولكن الصعوبات الاقتصادية الحالية تؤثر بشكل كبير على فرص العمل المتاحة. أبحث بنشاط وأحتاج إلى هذا الدعم لمساعدتي في تغطية تكاليف التنقل والاحتياجات الأساسية أثناء هذه الفترة الانتقالية.`;
      }
      return `أتقدم بطلب الحصول على هذا الدعم الاجتماعي لمساعدتي وعائلتي في مواجهة هذه الظروف الصعبة بشكل عاجل. سيساعدنا هذا الدعم في الحفاظ على استقرار معيشتنا الأساسي وتجاوز هذه المرحلة الحرجة وتوفير بيئة لائقة لأطفالي.`;
    } else {
      if (field === 'financialSituation') {
        return `As ${contextData.fullName || 'the applicant'}, I am experiencing extreme financial hardship. Our monthly income of $${contextData.monthlyIncome || 0} is insufficient to cover the vital needs of my family, which includes ${contextData.dependents || 0} dependents. We are struggling with basic utilities, food expenses, and mounting outstanding bills.`;
      }
      if (field === 'employmentCircumstances') {
        return `My current employment situation is "${contextData.employmentStatus || 'unemployed'}". Despite my continuous effort to seek secure employment and sending applications daily, local economic conditions have limited my opportunities. This social assistance is critical to sustain my job hunt and cover core living costs.`;
      }
      return `I am formally applying for this government social support program to provide temporary stability for my household during this challenging time. This funding will directly enable me to maintain housing stability and purchase necessary groceries for my dependents.`;
    }
  }

  // OpenAI API request
  const systemInstruction =
    language === 'ar'
      ? 'أنت أخصائي اجتماعي وكاتب رسمي حكومي محترف. ساعد في صياغة فقرة رسمية، مهنية، ومؤثرة لطلب الدعم الاجتماعي باللغة العربية بناءً على المعطيات.'
      : 'You are a professional social worker and administrative writer. Draft a formal, compelling, and professional statement for a social support application portal based on the provided user profile.';

  const userPrompt = `
    Field of statement: ${field}
    Applicant Name: ${contextData.fullName || 'N/A'}
    Monthly Income: $${contextData.monthlyIncome || 0}
    Number of Dependents: ${contextData.dependents || 0}
    Employment Status: ${contextData.employmentStatus || 'N/A'}
    User raw comments / optional prompt: "${prompt || 'No guidance provided'}"

    Please write a professional paragraph of around 80-120 words. Focus on a humble, administrative, and urgent tone appropriate for government assistance review. Write strictly in ${language === 'ar' ? 'Arabic' : 'English'}. Do not add any conversational remarks, introductions, or salutations. Start directly with the text.
  `;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 400,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        signal,
      }
    );

    const generatedText = response.data.choices[0].message.content.trim();
    return generatedText;
  } catch (error: any) {
    if (axios.isCancel(error)) {
      console.log('AI generation request was successfully cancelled.');
      throw error;
    }
    console.error('OpenAI generation error:', error);
    throw new Error(error.response?.data?.error?.message || 'Error occurred during AI generation.');
  }
};
