export const sanitizeInput = (input) => {
    // 기본적인 HTML 태그 제거
    return input.replace(/<[^>]*>?/gm, '');
  };