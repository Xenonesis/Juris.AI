import { lazy } from 'react';

// Lazy load heavy components to improve initial bundle size
export const LazyBestModelResult = lazy(() => 
  import('./best-model-result').then(module => ({ default: module.BestModelResult }))
);

export const LazyModelComparison = lazy(() => 
  import('./model-comparison').then(module => ({ default: module.ModelComparison }))
);

export const LazyModelResults = lazy(() => 
  import('./model-results').then(module => ({ default: module.ModelResults }))
);

export const LazyCaseEstimation = lazy(() => 
  import('./case-estimation').then(module => ({ default: module.CaseEstimation }))
);

export const LazyCaseStudies = lazy(() => 
  import('./case-studies').then(module => ({ default: module.CaseStudies }))
);

// Chat components
export const LazyChatComponent = lazy(() => 
  import('./chat/chat-component').then(module => ({ default: module.ChatComponent }))
);

export const LazyChatUI = lazy(() => 
  import('./chat/chat-ui').then(module => ({ default: module.ChatUI }))
);
