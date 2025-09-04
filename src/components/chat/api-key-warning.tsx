'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface ApiKeyWarningProps {
  show: boolean;
  aiProvider: string;
}

export function ApiKeyWarning({ show, aiProvider }: ApiKeyWarningProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 border-l-4 border-yellow-400"
        >
          <div className="p-3 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                API Key Missing
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                You don't have an API key for {aiProvider}. Results may be limited. Configure your API keys in settings.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
